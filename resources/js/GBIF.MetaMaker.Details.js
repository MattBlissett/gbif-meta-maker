Ext.namespace('GBIF');
Ext.namespace('GBIF.MetaMaker');

GBIF.MetaMaker.Details = function(config){

	Ext.apply(this, config, {
			height: 100
		,	title: 'Details'
		,	split: true
		,	padding: 10
		,	html: 'To get started check any extension to add these attributes to metafile to meta file.'
		,	border: false
	})

	GBIF.MetaMaker.Details.superclass.constructor.call(this, config);

}	

Ext.extend(GBIF.MetaMaker.Details, Ext.Panel, {	
});