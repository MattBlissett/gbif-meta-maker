Ext.namespace('GBIF');
Ext.namespace('GBIF.MetaMaker');
GBIF.MetaMaker.LoadWindow = function(config){
	Ext.apply(this, config, {
			width: 500
		,	height: 350
		,	title: 'Load File'
		,	modal: true
		,	resizable: false
/*		
		,	defaults: {
					padding: 5
				,	border: false
			}
*/			
		,	plain: true
		,	closable: true
		,	currentXml: ''
		,	items: [{
					xtype: 'displayfield'
				,	value: '<div style="padding: 10px;">Please paste your meta.xml text into the area below and click "Load".</div>'	
			},{
					xtype: 'textarea'
				,	ref: 'txtLoadFile'
				,	allowBlank: false
				,	scope: this
				,	height: 245
				,	width: 483
			}]
		,	buttonAlign: 'right'		
		,	buttons: [{
					text: 'Load'
				,	scope: this
				,	ref: '../refBtnLoad'
			//	,	handler: this.loadFile
			}, {
					text: 'Cancel'
				,	scope: this
				,	handler: function(){
						this.close();
					}	
			}]
	});
	
	GBIF.MetaMaker.LoadWindow.superclass.constructor.call(this, config);
	
};

Ext.extend(GBIF.MetaMaker.LoadWindow, Ext.Window, {});