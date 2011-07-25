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
		,	tbar: [{
						xtype: 'combo'   
					,	store: language
					,	mode: 'local'
					,	value: lang
					,	displayField: 'value'
					,	valueField: 'id'
					,	typeAhead: false
					,	triggerAction: 'all'
					,	editable: false
					,	width: 80
					,	listeners: {
							select: function(f, r, i){
								var lang = r.data.id;
								window.location ='?lang=' + lang;
							}
						}
				}
				,	'->', {
					text: this.txtResetAssistant
				,	scope: this
				,	iconCls: 'iconReset'
				, 	handler: function() {
						Ext.Msg.confirm(this.msgConfirmTitle, this.msgResetAssistant, function(btn){
							if(btn == 'yes'){
								this.resetAssistant();
							}
						}, this);
				 	}	
			}]
		,	listeners: {
					checkchange: this.checkchange
				,	click: this.activateTab
				,	beforeexpandnode: this.checkDisabled
				,	scope: this
				,	contextmenu: function(node) {
						node.select();
						if (node.attributes.type == 'core' || node.attributes.type == 'extension') {
							var menu = new Ext.menu.Menu();            
							menu.add(new Ext.menu.Item({
									text: this.txtSortFields
								,	scope: this
								, 	handler: function() {
										node.sort(Sorter);
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
	
		resetCoreExtension: function(type) {
			// clears the filename, resets the radio to CSV and properties, then unchecks the extension selected
			this.extensionsTree.getRootNode().cascade(function(node) {							 
				if (node.attributes.type == type && node.getUI().isChecked()) {
					this.metaMakerCenterTab.getComponent(type + "-" + node.id).extension.filename.setValue('');
					this.metaMakerCenterTab.getComponent(type + "-" + node.id).fileSettings.fileSettingOptions.getComponent('radio-csv').setValue(true);
					this.metaMakerCenterTab.getComponent(type + "-" + node.id).fileSettings.prop.setCSV();
					this.metaMakerCenterTab.getComponent(type + "-" + node.id).extension.store.each(function(rec, i, t) {
						if (rec.data.term == "Spacer") {
							this.remove(rec);
						} else {
							rec.set("global", false);
							rec.set("vocabulary", "");
							rec.set("static", "");
							rec.commit();
						}
					}, this.metaMakerCenterTab.getComponent(type + "-" + node.id).extension.store);
					node.getUI().toggleCheck();
				}
			}, this);
			if (type == "core") {
				if (this.extensionsTree.getRootNode().findChild("id", "occurrence", true).getUI().isChecked() ) {
					this.extensionsTree.getRootNode().findChild("id", "taxon", true).getUI().toggleCheck(true);
				} else {
					this.metaMakerCenterTab.setActiveTab('core-taxon');
//					this.metaMakerCenterTab.metaPanel.generateXML();
				}
			}
		}
		
	,	resetAssistant: function() {
			// remove attributes from core and extensions, ignore required fields
			this.extensionsTree.getRootNode().cascade(function(node) {
				if (node.attributes.type == "attribute" && node.getUI().isChecked() && node.attributes.required == "false") {
					node.getUI().toggleCheck();
				}
			});

			this.resetCoreExtension("extension");
			this.resetCoreExtension("core");
			this.metaMakerCenterTab.metaPanel.filename.setValue('');
		}

	, findField: function(index, fields) {
			for(var i=0;i<fields.length;i++) {
				if (fields[i].index == index) {
					return(fields[i]);
				}
			}
		}

	,	loadExtension: function(type, node, e) {
			var maxIndex = 0;
			var tNode = null;
			var rec = null;
			var tStore = this.metaMakerCenterTab.getComponent(type + "-" + node.id).extension.store;
			if (!Ext.isObject(e.files.location)) {
				this.metaMakerCenterTab.getComponent(type + "-" + node.id).extension.filename.setValue(e.files.location);
			}

			// Loop for defaults and get highest index
			Ext.each(e.field, function(field) {
				if (Ext.isEmpty(field.index)) {
					tNode = node.findChild("qualName", field.term, true);
					if (!Ext.isEmpty(tNode)) {
						if (!tNode.getUI().isChecked()) {
							tNode.getUI().toggleCheck(true);
						}
					}
					rec = tStore.getAt(tStore.findExact("qualName", field.term));
					if (!Ext.isEmpty(rec)) {
						rec.set("global", true);
						if (Ext.isEmpty(field.vocabulary) != true && Ext.isObject(field.vocabulary) != true) rec.set("vocabulary", field.vocabulary);
						if (Ext.isEmpty(field.default_) != true && Ext.isObject(field.default_) != true) rec.set("static", field.default_);
						rec.commit();						
					}
				} else {
					maxIndex = (field.index > maxIndex) ? field.index : maxIndex;
				}
			}, this);
			this.metaMakerCenterTab.getComponent(type + "-" + node.id).extension.reindex();

			// Loop and check items in order adding spacers along the way.
			for(var i=0;i<=maxIndex;i++) {
				tField = this.findField(i,e.field);
				if (Ext.isEmpty(tField)) {
					if ((e.id && e.id.index != i) || (e.coreid && e.coreid.index != i)) {
						// Add Spacer
						this.metaMakerCenterTab.getComponent(type + "-" + node.id).extension.addSpacer();
					} else {
						// Move ID to this location.
						var index = tStore.findExact("term", "ID");
						if (index == -1) {
							index = tStore.findExact("term", "Core ID");
							if (index != -1) {
								rec = tStore.getAt(index);
								tStore.removeAt(index);
								tStore.add(rec);
							}
						}
					}
				} else {
					tNode = node.findChild("qualName", tField.term, true);
					if (!Ext.isEmpty(tNode)) {
						if (!tNode.getUI().isChecked()) {
							tNode.getUI().toggleCheck(true);
						} else {
							// Already checked so should be as a constant so we need to pop and push it back on the store.
							var index = tStore.findExact("qualName", tField.term);
							rec = tStore.getAt(index);
							tStore.removeAt(index);
							tStore.add(rec);
						}
					}
					tStore = this.metaMakerCenterTab.getComponent(type + "-" + node.id).extension.store;
					rec = tStore.getAt(tStore.findExact("qualName", tField.term));
					if (!Ext.isEmpty(rec)) {
						if (Ext.isEmpty(tField.vocabulary) != true && Ext.isObject(tField.vocabulary) != true) rec.set("vocabulary", tField.vocabulary);
						if (Ext.isEmpty(tField.default_) != true && Ext.isObject(tField.default_) != true) rec.set("static", tField.default_);
						rec.commit();						
					}					
				}
			}
			this.metaMakerCenterTab.getComponent(type + "-" + node.id).extension.reindex();
			this.metaMakerCenterTab.getComponent(type + "-" + node.id).fileSettings.fileSettingOptions.getComponent('radio-custom').setValue(true);
			this.metaMakerCenterTab.getComponent(type + "-" + node.id).fileSettings.prop.setCustom({
					'Field Delimiter': this.getFieldsterminate(e.fieldsterminatedby)
				,	'Fields enclosed by': this.getFieldsenclosed(e.fieldsenclosedby)
				,	'File Encoding': e.encoding
				,	'Ignore header row': (e.ignoreheaderlines == 1) ? true : false
				,	'Line ending': this.getFieldsterminate(e.linesterminatedby)
			});
		}

	,	loadXML: function(data) {
			this.resetAssistant(); // Clears the form.
			if (data.archive.metadata) this.metaMakerCenterTab.metaPanel.filename.setValue(data.archive.metadata);
			Ext.each(data.archive.extension, function(e) {
				var n = this.extensionsTree.getRootNode().findChild("identifier", e.rowtype, true);
				if (!Ext.isEmpty(n)) {
					n.collapse();
					n.on('expand', this.loadExtension.createDelegate(this, ["extension", n, e]), this, {single: true, delay: 500});
					this.checkchange(n, true);
				}
			}, this);
			
			// Core			
			var n = this.extensionsTree.getRootNode().findChild("identifier", data.archive.core.rowtype, true);
			if (!Ext.isEmpty(n)) {
				n.collapse();
				n.on('expand', this.loadExtension.createDelegate(this, ["core", n, data.archive.core]), this, {single: true, delay: 500});
				n.expand();
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
							node.expand();
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
						var index = tmpTab.extension.store.findExact("term", node.attributes.term);
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