Ext.namespace('GBIF');
Ext.namespace('GBIF.MetaMaker');

GBIF.MetaMaker.Center = function(config){

//	this.metaSources = new GBIF.MetaSources({region : 'west'});
	this.metaMakerCenterTab = new GBIF.MetaMaker.CenterTab({region: 'center'});
	this.extensionsTree = new GBIF.MetaMaker.ExtensionsTree({
			region: 'west'
		,	width: 250
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
			this.metaMakerCenterTab.setActiveTab( "ext-" + node.id );
		}
		
	,	checkchange: function( node, state ) {
			switch( node.attributes.type ) {
				case 'core':
					var activeCoreItem = this.extensionsTree.toggleCore( node.id );
					this.metaMakerCenterTab.setActiveTab("core-" + node.id );
					node.expand();
					break;
				
				case 'extension':
					if (state) {
						if( this.metaMakerCenterTab.findById("ext-" + node.id) ) {
							this.metaMakerCenterTab.setActiveTab( "ext-" + node.id );
						} else {
							this.metaMakerCenterTab.add( new GBIF.MetaMaker.ExtensionPanel({
									id: "ext-" + node.id
								,	title: node.text
								,	type: 'ext'
							}) );
							this.metaMakerCenterTab.setActiveTab( "ext-" + node.id );
							node.expand();
						}
					} else {
						this.metaMakerCenterTab.remove( "ext-" + node.id );
					}
					break;

				case 'attribute':
					var prefix = node.parentNode.attributes.type;
					var tmpTab = this.metaMakerCenterTab.findById( prefix + "-" + node.parentNode.id );
					if (tmpTab) {
						this.metaMakerCenterTab.setActiveTab( prefix + "-" + node.parentNode.id );
					} else {
						tmpTab = new GBIF.MetaMaker.ExtensionPanel({
								id: "ext-" + node.parentNode.id
							,	title: node.parentNode.text
							,	type: 'ext'
						});

						this.metaMakerCenterTab.add( tmpTab );
						this.metaMakerCenterTab.setActiveTab( "ext-" + node.parentNode.id );
					}
//					console.log(node.attributes);
					tmpTab.extension.store.loadData([[node.attributes.term, "string", true]], true );
					break;

				default:
					break;
			}
		}
});