Ext.namespace('GBIF');

GBIF.MetaMakerSouth = function(config){

	Ext.apply(this, config, {
			width: 700
        ,	height: 200
        ,	title: 'Details'
        ,   split: false
        ,   padding: 10
        ,   html: 'This is where the detilas go.'
		,	border : true
		
	})
	GBIF.MetaMakerSouth.superclass.constructor.call(this, config);
}	
Ext.extend(GBIF.MetaMakerSouth,Ext.Panel,  {
	
});
