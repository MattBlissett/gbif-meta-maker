Ext.namespace('GBIF');
Ext.namespace('GBIF.MetaMaker');

GBIF.MetaMaker.Center = function(config){
	this.metaMakerCenterTab = new GBIF.MetaMaker.CenterTab({region: 'center'});
	this.oldXML = '';
	this.itemsArray = [];
	this.extensionsTree = new GBIF.MetaMaker.ExtensionsTree({
			region: 'west'
		,	width: 270
		,	minWidth: 270
		,	maxWidth: 270
		,	split: true
		,	tbar: [
				'->',{
					text: 'Reset Assistant'
				,	scope: this
				,	iconCls: 'iconReset'
				, 	handler: function() {
						Ext.Msg.confirm("Confirm", "Are you sure reset assistant?", function(btn){
							if(btn == 'yes'){
								this.resetXML();	
							}
						}, this)
				 	}	
				}]
		,	listeners: {
					dblclick: this.loadExtension		
				,	checkchange: this.checkchange
				,	click: this.activateTab
				,	beforeexpandnode: this.checkDisabled
				,	scope: this
				,	contextmenu: function(node) {
						node.select();
						if (node.attributes.type == 'core' || node.attributes.type == 'extension') {
							var menu = new Ext.menu.Menu();            
							menu.add(new Ext.menu.Item({
									text: 'Sort Fields'
								,	scope: node
								, handler: function() {
										this.sort(Sorter);
									}
							}));
							menu.show(node.ui.getAnchor());
						}
					}					
			}
	}, this);

	this.metaMakerCenterTab.metaPanel.on('loadXML', function(me){
		this.loadXML(me)
	}, this);
	Ext.apply(this, config, {
			layout : 'border'
		,	newMetaData: ''
		,	indexArray: []
		,	tagIndex: []
		,	defaults: {
				border: false
			}
		,	items: [
					this.extensionsTree
				,	this.metaMakerCenterTab
			]
	});

	GBIF.MetaMaker.Center.superclass.constructor.call(this, config);

}	

Ext.extend(GBIF.MetaMaker.Center,Ext.Panel,  {
	
		loadExtension: function( node ) {}
	,	resetXML: function(){
				var me = this.metaMakerCenterTab.metaPanel;
				var oldxml = '<?xml version="1.0"?> <archive xmlns="http://rs.tdwg.org/dwc/text/"> <core encoding="UTF-8" linesTerminatedBy="\r\n" fieldsTerminatedBy="," fieldsEnclosedBy="&quot;" ignoreHeaderLines="1" rowType="http://rs.tdwg.org/dwc/terms/Taxon"> <files> <location></location> </files> <id index="0"/> </core> </archive>'
				var xmlTag = xml2json.parser(oldxml);
				if(Ext.isDefined(xmlTag.archive)){
					if(Ext.isDefined(xmlTag.archive.core)){
						this.resetCheck(xmlTag.archive.core);
					}
					var treeNode = this.extensionsTree.getRootNode().lastChild.childNodes;
					for(var i=0; i<treeNode.length; i++){
						if(treeNode[i].attributes.checked){
							childTree = treeNode[i].childNodes;
							this.metaMakerCenterTab.items.each(function(item){
								if(item.title == treeNode[i].attributes.title){
									this.setDefault(item);
								}
							},this);
							for(var j=0; j<childTree.length; j++){
								if(childTree[j].attributes.checked){
									childTree[j].getUI().toggleCheck();	
								}	
							}
							treeNode[i].getUI().toggleCheck();
							treeNode[i].collapse();
						}
					}
					this.newLoad = false;
					this.metaMakerCenterTab.metaPanel.generateXML();
					this.metaMakerCenterTab.setActiveTab('core-taxon');
					this.metaMakerCenterTab.metaPanel.filename.setValue('');
				}else {	
					alert('Error in reset XML');
				}
		}
	,	resetCheck: function(data){
			var currentNode = this.getName(data.rowtype);
			var treeNode = this.extensionsTree.getRootNode().firstChild.childNodes;
			for(var i=0; i<treeNode.length; i++){
				var identifier = this.getName(treeNode[i].attributes.identifier);
				if(currentNode == identifier){
					treeNode[i].getUI().toggleCheck();
					childTree = treeNode[i].childNodes;
					for(var j=0; j<childTree.length; j++){
						if(childTree[j].attributes.checked){
							childTree[j].getUI().toggleCheck();
						}	
					}
					this.metaMakerCenterTab.items.each(function(item){
						if(item.title == treeNode[i].attributes.title){
							this.setDefault(item);	
						}
					},this);
					treeNode[i].collapse();
				}
			}
		}
	,	setDefault: function(item){
			item.extension.store.each(function(){
				var index = item.extension.store.find("term", 'Spacer');
				if (index >= 0 ) {
					item.extension.store.remove( item.extension.store.getAt( index ) );
				}
			});
			item.fileSettings.prop.setSource({
					'File Encoding': 'UTF-8'
				,	'Field Delimiter': ','
				,	'Fields enclosed by': '\"'
				,	'Line ending': '\\r\\n'
				,	'Ignore header row': true
			});
			item.fileSettings.form.setValues({format:'csv'});
			item.extension.filename.setValue('');	
		}	
	,	loadXML: function(me){
			var xmlTag = me.currentXml
			this.oldXML = me.body.dom.textContent;
			if(Ext.isDefined(xmlTag.archive)){
				this.newMetaData = Ext.isDefined(xmlTag.archive.metadata)? xmlTag.archive.metadata: '';
				this.loadTreeNode( xmlTag.archive.core, 'firstChild');
				if(Ext.isDefined(xmlTag.archive.extension)){
					if(Ext.isDefined(xmlTag.archive.extension.length)){
						for(var i=0; i< xmlTag.archive.extension.length; i++){
							this.loadTreeNode( xmlTag.archive.extension[i], 'lastChild');
						}
					}else{
						this.loadTreeNode( xmlTag.archive.extension, 'lastChild');
					}	
				}
				me.loadXml.close();
			}else{	
				alert('Invalid XML');
			}	
		}
	,	getName: function(value){
			var currentNode = value.split('/');
			var length = currentNode.length;
			return currentNode[length-1];	
		}	
	,	loadTreeNode: function(data, child){
			if(Ext.isDefined(data.rowtype)){
				var currentNode = this.getName(data.rowtype);
				if(child == "firstChild"){
					var treeNode = this.extensionsTree.getRootNode().firstChild.childNodes;
				}else if(child == "lastChild"){
					var treeNode = this.extensionsTree.getRootNode().lastChild.childNodes;
				}
				for(var i=0; i<treeNode.length; i++){
					var identifier = this.getName(treeNode[i].attributes.identifier);
					if((currentNode == identifier )){
						treeNode[i].getUI().toggleCheck();
						this.isFirstLoaded = true;
						var currentTree = treeNode[i];
						currentTree.reload();
						this.newLoad = true;
						this.extensionsTree.loader.on('load', function(me, node){
							if(this.newLoad && (currentNode == this.getName(node.attributes.identifier))){
								this.setValues(data, currentTree, child);
								this.metaMakerCenterTab.metaPanel.filename.setValue(this.newMetaData);
								this.metaMakerCenterTab.metaPanel.generateXML();
								this.isFirstLoaded = false;
							}	
						}, this );//, {single: true});
					}	
				}
			}	
		}
	,	getFieldsterminate: function(data){
			var fieldsterminatedby = '';
			switch(data){
				case '&amp;#44;':
					fieldsterminatedby = ',';
					break;
				case '\\tabSpace':
					fieldsterminatedby = '\\t';
					break;
				case '&amp;#59;':
					fieldsterminatedby = ';';
					break;
				case '&amp;#124;':
					fieldsterminatedby = '|';
					break;
				case '&amp;#93;':
					fieldsterminatedby = ']';
					break;
				default:
					fieldsterminatedby = (Ext.encode(data)!='{}')? data : '(none)'
					break;
			}
			return fieldsterminatedby;
		}
	,	checkCustom: function(mnTpl){
			if(mnTpl['File Encoding'] == 'UTF-8' && mnTpl['Line ending']=='\\r\\n' && mnTpl['Ignore header row']== true){
				if(mnTpl['Field Delimiter'] == ',' && mnTpl['Fields enclosed by'] == '\"')
					return 'csv';
				else if(mnTpl['Field Delimiter'] == '\\t' && mnTpl['Fields enclosed by'] == '(none)')
					return 'tab';
				else return 'custom';
			}else if(!Ext.isDefined(mnTpl)){
				return 'custom';
			}else return 'custom';
		}		
	,	getFieldsenclosed: function(data){
			var fieldsenclosedby = '';
			switch(data){
				case '&amp;quot;':
					fieldsenclosedby = '"';
					break;
				case '&quot;':
					fieldsenclosedby = '"';
					break;
				case '&amp;#39;':
					fieldsenclosedby = "'";
					break;	
				default:
					fieldsenclosedby = (Ext.encode(data)!='{}')? data : '(none)';
					break;
			}
			return fieldsenclosedby;
		}	
	,	setValues: function(data, currentTree, child){
			var ignoreHeaderRow = (data.ignoreheaderlines == 1)? true : false;
			var linesterminatedby = (Ext.encode(data.linesterminatedby)!='{}')? data.linesterminatedby : '';
			var encoding = data.encoding;
			var fieldsenclosedby = this.getFieldsenclosed(data.fieldsenclosedby);
			var fieldsterminatedby = this.getFieldsterminate(data.fieldsterminatedby);
			var mainTempalte = {
					'File Encoding': encoding
				,	'Field Delimiter': fieldsterminatedby
				,	'Fields enclosed by': fieldsenclosedby
				,	'Line ending': linesterminatedby
				,	'Ignore header row': ignoreHeaderRow
			}
			var setCustom = this.checkCustom(mainTempalte);
			this.metaMakerCenterTab.items.each(function(item){
				if(item.title == currentTree.attributes.title){
					item.fileSettings.form.setValues({format: setCustom});
					this.tagIndex = [];
					item.extension.store.removeAll();
					this.indexArray = [];
					if(child == 'firstChild' && !this.isFirstLoaded){
							item.extension.store.insert(0, new Ext.data.Record({
										term: 'ID' 
									,	dataType: ''
									,	required: true
									,	rIndex: ''
							}));
					}
					if(child == 'lastChild' &&  !this.isFirstLoaded){
							item.extension.store.insert(0, new Ext.data.Record({
										term: 'Core ID' 
									,	dataType: ''
									,	required: true
									,	rIndex: ''
							}));
							
					}
					if(child == 'firstChild'){
						this.metaMakerCenterTab.setActiveTab('core-'+currentTree.id);
					}
					if(child == 'lastChild'){
						if(Ext.isDefined(data.coreid)){
								this.indexArray.push ({term: 'Core ID', index: data.coreid.index});
						/**		if(!Ext.isEmpty(data.coreid.index)){
									this.tagIndex.push(data.coreid.index);
								} **/
						}	
					}
					if(child == 'firstChild'){
						if(Ext.isDefined(data.id)){
							this.indexArray.push ({term:'ID', index: data.id.index});
						/**	if(!Ext.isEmpty(data.id.index)){
								this.tagIndex.push(data.id.index);
							}	**/
						}	
					}	
					item.fileSettings.prop.setSource(mainTempalte);
					
					if(Ext.isDefined(data.field)){
						if(Ext.isDefined(data.field.length)){
							for(var i=0; i< data.field.length; i++){
								this.setField(data.field[i], currentTree, item);
							}
						}else{
							this.setField(data.field, currentTree, item);
						}	
					}
					
					if(Ext.isDefined(data.files)){
						if(Ext.isDefined(data.files.location)){
							var location = (Ext.encode(data.files.location)!='{}')?data.files.location:''
							item.extension.filename.setValue(location);
						}
					}
				/**	var missing = [];
					if(!Ext.isEmpty(this.tagIndex)){
						this.tagIndex.sort(function(a, b){
							return a-b;
						});
						var len = this.tagIndex.length;
						var lastIndex = this.tagIndex[len-1];
						for(var i=0; i<lastIndex; i++){
							var found = false;
							for(var j=0; j<len; j++){
								if(i == this.tagIndex[j]){
									found = true;
									break;
								}
							}
							if(!found){
								missing.push(i);
							}
						}
					}**/
					if(!Ext.isEmpty(this.indexArray)){
						for(var i=0; i<this.indexArray.length; i++){
							var index = item.extension.store.findExact('qualName', this.indexArray[i]['qualName']);
							var rec = item.extension.store.getAt(index);
							if(Ext.isDefined(rec)){
								rec.set('rIndex', this.indexArray[i]['index']);
								rec.set('vocabulary', this.indexArray[i]['vocabulary']);
								rec.set('global', this.indexArray[i]['global']);
								rec.set('static', this.indexArray[i]['default_']);
								rec.commit();
								item.extension.store.commitChanges();
							}
						}
					}
				/**	if(!Ext.isEmpty(missing)){
							item.extension.store.each(function(){
								var index = item.extension.store.find("term", 'Spacer');
								if (index >= 0 ) {
									item.extension.store.remove( item.extension.store.getAt( index ) );
								}
							});
							for(var i=0; i< missing.length; i++){
								item.extension.store.insert(missing[i], new Ext.data.Record({
											term: 'Spacer' 
										,	dataType: ''
										,	required: false
										,	rIndex: missing[i]
								}));
							}
					} **/
				//	item.extension.store.sort('rIndex', 'ASC');
				}
			}, this);
		}
	,	setField: function(data, currentTree, item){
			var childTree=	currentTree.childNodes
			for(var i=0; i < childTree.length; i++){
				var qualName = this.getName(childTree[i].attributes.qualName);
				var term = this.getName(data.term);
				var indexing = ((Ext.isDefined(data.index)) && (Ext.encode(data.index) != '{}')) ? data.index : '';
				var vocabulary = ((Ext.isDefined(data.vocabulary)) && (Ext.encode(data.vocabulary) != '{}')) ? data.vocabulary : '';
				if((Ext.isDefined(data.global)) && (Ext.encode(data.global) != '{}')){
					if( data.global || data.global == "true"){
						var global = true;
					}else{
						var global = false;
					}
				}
				var default_ = ((Ext.isDefined(data.default_)) && (Ext.encode(data.default_) != '{}')) ? data.default_ : '';
				if(term == qualName){
					childTree[i].getUI().toggleCheck();
					if(!childTree[i].attributes.checked){
						childTree[i].getUI().toggleCheck();
					}			
					tempRec = {	
								term: term
							,	index: indexing
							, 	vocabulary: vocabulary
							,	global: global
							,	default_: default_
							,	qualName: childTree[i].attributes.qualName
					}
					this.indexArray.push(tempRec);
				/**	if(!Ext.isEmpty(indexing)){
						this.tagIndex.push(indexing);
					} **/
				}
			}
		}
	,	activateTab: function( node ) {
			if( this.metaMakerCenterTab.findById("extension-" + node.id) ) {			
				this.metaMakerCenterTab.setActiveTab( "extension-" + node.id );
			}
		}

	,	checkDisabled: function(node) {
//			console.log(this, node);
			return(!node.disabled);
		}

	,	checkchange: function( node, state ) {
//			console.log(node, state);
			switch( node.attributes.type ) {
				case 'core':
					if (state == false) {
						this.extensionsTree.suspendEvents();						
							node.getUI().toggleCheck(true);			
						this.extensionsTree.resumeEvents();
						return;
					}
					
					var previousCoreItem = this.extensionsTree.toggleCore( node.id, state );
					this.metaMakerCenterTab.hideTabStripItem("core-" + previousCoreItem);
					this.metaMakerCenterTab.getComponent("core-" + previousCoreItem).skip = true;
					
					this.metaMakerCenterTab.unhideTabStripItem("core-" + node.id);
					this.metaMakerCenterTab.getComponent("core-" + node.id).skip = false;

					this.metaMakerCenterTab.setActiveTab("core-" + node.id );
					node.expand();
					break;
				
				case 'extension':
					if (state) {
						if( this.metaMakerCenterTab.findById("extension-" + node.id) ) {
							this.metaMakerCenterTab.unhideTabStripItem("extension-" + node.id);
							this.metaMakerCenterTab.getComponent("extension-" + node.id).skip = false;
							this.metaMakerCenterTab.setActiveTab( "extension-" + node.id );
						} else {
							this.metaMakerCenterTab.add( new GBIF.MetaMaker.ExtensionPanel({
									id: "extension-" + node.id
								,	title: node.text
								,	type: 'ext'
								,	skip: false
								,	identifier: node.attributes.identifier
							}) );
							this.metaMakerCenterTab.setActiveTab( "extension-" + node.id );
							node.expand();
						}
					} else {
						this.metaMakerCenterTab.hideTabStripItem("extension-" + node.id);
						this.metaMakerCenterTab.getComponent("extension-" + node.id).skip = true;

						if (this.metaMakerCenterTab.getActiveTab().id == "meta") {
							this.metaMakerCenterTab.checkTab( this.metaMakerCenterTab, this.metaMakerCenterTab.getComponent("meta") );
						} else {
							this.metaMakerCenterTab.setActiveTab("meta");
						}
					}
					break;

				case 'attribute':
					// Check to see if it is required if so do not allow item to be unchecked and removed.
					
					if (node.attributes.required == "true" && state == false) {
						node.suspendEvents();
						node.getUI().toggleCheck(true);
						node.resumeEvents();
						return(false);
					}
					
					var prefix = node.parentNode.attributes.type;			

					// Check parent if not already checked
					if (!node.parentNode.attributes.checked) {
						node.parentNode.getUI().toggleCheck();
					}

					var tmpTab = this.metaMakerCenterTab.findById( prefix + "-" + node.parentNode.id );

					if (tmpTab) {
						this.metaMakerCenterTab.unhideTabStripItem( prefix + "-" + node.parentNode.id );
						this.metaMakerCenterTab.setActiveTab( prefix + "-" + node.parentNode.id );
					} else {
						tmpTab = new GBIF.MetaMaker.ExtensionPanel({
								id: "ext-" + node.parentNode.id
							,	title: node.parentNode.text
							,	type: 'ext'
							,	identifier: node.parentNode.attributes.identifier
						});

						this.metaMakerCenterTab.add( tmpTab );
						this.metaMakerCenterTab.setActiveTab( tmpTab.id );
					}

					if (state) {
						tmpTab.extension.store.loadData([[
									node.attributes.term
								, node.attributes.dataType
								, node.attributes.required							
								, node.attributes.static							
								, node.attributes.description							
								, node.attributes.qualName					
								, node.attributes.namespace
								, node.attributes.relation
							]], true );	
					} else {
						var index = tmpTab.extension.store.find("term", node.attributes.term);
						if (index >= 0 ) {
							tmpTab.extension.store.remove( tmpTab.extension.store.getAt( index ) );
						}
					}
					
					break;

				default:
					break;
			}
		}
});