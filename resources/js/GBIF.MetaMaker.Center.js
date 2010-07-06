Ext.namespace('GBIF');
Ext.namespace('GBIF.MetaMaker');

GBIF.MetaMaker.Center = function(config){

//	this.metaSources = new GBIF.MetaSources({region : 'west'});
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
				,	scope: this
			}
	}, this);
	
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
	
		loadExtension: function( node ) {
//			console.log( this, node );
		}

	,	activateTab: function( node ) {
			if( this.metaMakerCenterTab.findById("ext-" + node.id) ) {			
				this.metaMakerCenterTab.setActiveTab( "ext-" + node.id );
			}
		}
		
	,	checkchange: function( node, state ) {
			switch( node.attributes.type ) {
				case 'core':
					var previousCoreItem = this.extensionsTree.toggleCore( node.id );
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
					var prefix = node.parentNode.attributes.type;			

					// Check parent if not already checked
					if (!node.parentNode.attributes.checked) {
						node.parentNode.getUI().toggleCheck();
					}

//console.log( prefix );					
					var tmpTab = this.metaMakerCenterTab.findById( prefix + "-" + node.parentNode.id );
//console.log(tmpTab);					
					if (tmpTab) {
						this.metaMakerCenterTab.unhideTabStripItem( prefix + "-" + node.parentNode.id );
						this.metaMakerCenterTab.setActiveTab( prefix + "-" + node.parentNode.id );
					} else {
						tmpTab = new GBIF.MetaMaker.ExtensionPanel({
								id: "ext-" + node.parentNode.id
							,	title: node.parentNode.text
							,	type: 'ext'
						});

						this.metaMakerCenterTab.add( tmpTab );
						this.metaMakerCenterTab.setActiveTab( tmpTab.id );
					}
//					console.log(node.attributes);
					if (state) {
						tmpTab.extension.store.loadData([[node.attributes.term, "string", true]], true );
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