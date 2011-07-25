Ext.namespace('GBIF');
Ext.namespace('GBIF.MetaMaker');
GBIF.MetaMaker.LoadWindow = function(config){
	Ext.apply(this, config, {
			width: 500
		,	height: 350
		,	modal: true
		,	resizable: false
		,	plain: true
		,	closable: true
		,	currentXml: ''
		,	items: [{
					xtype: 'displayfield'
				,	value: '<div style="padding: 10px;">' + this.txtLoadInstruction + '</div>'	
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
					text: this.btnLoad
				,	scope: this
				,	ref: '../refBtnLoad'
			//	,	handler: this.loadFile
			}, {
					text: this.btnCancel
				,	scope: this
				,	handler: function(){
						this.close();
					}	
			}]
	});
	
	GBIF.MetaMaker.LoadWindow.superclass.constructor.call(this, config);
	
};

Ext.extend(GBIF.MetaMaker.LoadWindow, Ext.Window, {});