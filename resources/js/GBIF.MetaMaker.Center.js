Ext.namespace('GBIF');
Ext.namespace('GBIF.MetaMaker');

GBIF.MetaMaker.Center = function(config){

//	this.metaSources = new GBIF.MetaSources({region : 'west'});
	this.metaMakerCenterTab = new GBIF.MetaMakerCenterTab({region: 'center'});
	this.extensionsTree = new GBIF.MetaMaker.ExtensionsTree({
			region: 'west'
		,	width: 250
		,	listeners: {
					dblclick: this.loadExtension				
				,	checkchange: this.checkchange
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

	,	checkchange: function( node, value ) {
			switch( node.attributes.type ) {
				case 'core':
					var activeCoreItem = this.extensionsTree.toggleCore( node.id );
//					console.log(activeCoreItem);
					break;
				default:
					break;
			}
		}
});