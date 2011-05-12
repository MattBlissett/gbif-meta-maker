Ext.namespace('GBIF');
Ext.namespace('GBIF.MetaMaker');

GBIF.MetaMaker.Center = function(config){

	this.metaMakerCenterTab = new GBIF.MetaMaker.CenterTab({region: 'center'});
	this.extensionsTree = new GBIF.MetaMaker.ExtensionsTree({
			region: 'west'
		,	width: 250
		,	minWidth: 250
		,	maxWidth: 250
		,	split: true
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
	this.metaMakerCenterTab.metaPanel.on('loadXML', this.loadXML, this);	
	Ext.apply(this, config, {
			layout : 'border'
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
	
	,	loadXML: function(me){
			var xmlTag = me.currentXml
			if(Ext.isDefined(xmlTag.archive)){
				this.loadTreeNode( xmlTag.archive.core);
				if(Ext.isDefined(xmlTag.archive.extension)){
			//		for(var i=0; i< xmlTag.archive.extension.length; i++){
				//		this.loadTreeNode( xmlTag.archive.extension);
			//		}
				}
				console.log(xmlTag);
				me.loadXml.close();
			}else{	
				alert('Invalid XML');
			}	
		}
	,	loadTreeNode: function(data){
			var ignoreHeaderRow = (data.ignoreheaderlines == 1)? true : false;
			var currentNode = data.rowtype.split('/');
			var length = currentNode.length;
			var currentNode = currentNode[length-1];
			var treeNode = this.extensionsTree.getRootNode().firstChild.childNodes;
			for(var i=0; i<treeNode.length; i++){
				if((currentNode == treeNode[i].attributes.name)){
					treeNode[i].getUI().toggleCheck();
					var currentTree = treeNode[i];
					this.extensionsTree.loader.on('load', function(){
						this.setValues(data, currentTree)
					}, this, {single: true});
				}	
			};
		}
	,	setValues: function(data, currentTree){
			this.metaMakerCenterTab.items.each(function(item){
				if(item.title == currentTree.text){
					item.fileSettings.prop.setSource({
							'File Encoding': data.encoding
						,	'Field Delimiter': data.fieldsterminatedby
						,	'Fields enclosed by': data.fieldsenclosedby
						,	'Line ending': data.linesterminatedby
						,	'Ignore header row': data.ignoreHeaderRow
					});
				}
			}, this);
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