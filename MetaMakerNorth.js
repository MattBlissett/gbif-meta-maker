Ext.namespace('GBIF');

GBIF.MetaMakerNorth = function(config){

	Ext.apply(this, config, {
			width: 700
        ,	height: 90
        ,	html: 'GBIF MetaMaker v1.0'
		,	border : true
		
	})
	GBIF.MetaMakerNorth.superclass.constructor.call(this, config);
}	
Ext.extend(GBIF.MetaMakerNorth,Ext.Panel,  {
	
});
