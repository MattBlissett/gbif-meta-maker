Ext.namespace('GBIF');
Ext.namespace('GBIF.MetaMaker');

GBIF.MetaMaker.FileSettings = function(config){

	this.prop = new GBIF.MetaMaker.Properties({
			autoHeight: true
		,	style: 'border-top: solid thin;'
	});

	Ext.apply(this, config, {
			defaults: {
				border: false
			}
		,	items: [{
					xtype: 'fieldset'						
				,	defaultType: 'radio'
				,	ref: 'fileSettingOptions'
				,	defaults: {
							handler: this.changeProp
						,	scope: this
					}
				,	items: [{
//							checked: true
							fieldLabel: 'File Settings'
						,	itemId: 'radio-csv'
						,	boxLabel: 'CSV File'
						,	name: 'format'
						,	inputValue: 'csv'
					}, {
							fieldLabel: ''
						,	itemId: 'radio-tab'
						, labelSeparator: ''
						, boxLabel: 'Tab Separated File'
						, name: 'format'
						, inputValue: 'tab'
					}, {
							fieldLabel: ''
						,	itemId: 'radio-custom'
						, labelSeparator: ''
						, boxLabel: 'Custom Format'
						, name: 'format'
						, inputValue: 'custom'
					}]
				,	listeners: {
							change: this.changeProp
						,	scope: this
					}
			}, this.prop
			]
		,	listeners: {
				render: function() {
					this.fileSettingOptions.getComponent('radio-csv').setValue(true);
					this.fileSettingOptions.fireEvent('change', this.fileSettingOptions.getComponent('radio-csv'), true );
				}
			}
	});

	GBIF.MetaMaker.FileSettings.superclass.constructor.call(this, config);

}	

Ext.extend(GBIF.MetaMaker.FileSettings, Ext.form.FormPanel, {

		changeProp: function( obj, state ) {
			if (!state) {
				return;
			}

			switch( obj.inputValue ) {
				case 'csv':
					var task = new Ext.util.DelayedTask(function(){
						this.prop.setCSV();
					}, this);
					task.delay(300); 
					break;

				case 'tab':
					this.prop.setTAB();
					break;
					
				default:
					this.prop.setCustom();
					break;
			}
		}

});