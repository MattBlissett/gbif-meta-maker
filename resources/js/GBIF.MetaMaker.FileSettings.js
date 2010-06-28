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
				,	defaults: {
							handler: this.changeProp
						,	scope: this
					}
				,	items: [{
							checked: true
						,	fieldLabel: 'File Settings'
						,	boxLabel: 'CSV File'
						,	name: 'format'
						,	inputValue: 'csv'
					}, {
							fieldLabel: ''
						 , labelSeparator: ''
						 , boxLabel: 'Tab Separated File'
						 , name: 'format'
						 , inputValue: 'tab'
					}, {
							fieldLabel: ''
						 , labelSeparator: ''
						 , boxLabel: 'Custom Format'
						 , name: 'format'
						 , inputValue: 'custom'
					}]
				,	listeners: {
						change: this.changeProp
					}
			}, this.prop
			]
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
					this.prop.setCSV();
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