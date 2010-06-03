Ext.namespace('GBIF');

GBIF.MetaMakerCenter = function(config){

	this.metaSources = new GBIF.MetaSources({region : 'west'});
	this.metaMakerCenterTab = new GBIF.MetaMakerCenterTab({region: 'center'});
	
	Ext.apply(this, config, {
			width : 700
        ,	height : 400
		, 	layout : 'border'
		,	defaults: {
                    border: false
            }
        ,	items : [this.metaSources,this.metaMakerCenterTab]
	})
	GBIF.MetaMakerCenter.superclass.constructor.call(this, config);
}	
Ext.extend(GBIF.MetaMakerCenter,Ext.Panel,  {
	
});