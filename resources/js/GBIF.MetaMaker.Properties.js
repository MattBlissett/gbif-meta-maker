Ext.namespace('GBIF');
Ext.namespace('GBIF.MetaMaker');

GBIF.MetaMaker.Properties = function(config){

	editable: true;

 var comboEncoding = new Ext.form.ComboBox({
			fieldLabel: 'comboEncoding'
		,	name: 'comboEncoding'
		,	allowBlank: false
		,	store: ['UTF-8', 'UTF-16', 'Latin1', 'Windows1252']
		,	typeAhead: true
		,	mode: 'local'
		,	triggerAction: 'all'
		,	emptyText:'-- Select encoding--'
		,	selectOnFocus: true
 });
 var terminatedByStore = new Ext.data.ArrayStore({
		fields: ['value','platfrom']
	,	data: [
				['\\r\\n' ,'Windows (\\r\\n)']
			,	['\\n','UNIX(Linux, Mac OS X) (\\n)']
			,	['\\r','Classic Mac OS (\\r)']
		]
 })
 var comboTerminatedBy = new Ext.form.ComboBox({
			fieldLabel: 'comboTerminatedBy'
		,	name: 'comboTerminatedBy'
		,	allowBlank: false
		,	displayField: 'platfrom'
		,	valueField: 'value'
		,	store: terminatedByStore //['\\r\\n', '\\n', '\\r']
		,	typeAhead: true
		,	mode: 'local'
		,	triggerAction: 'all'
		,	emptyText:'-- Select Type--'
		,	selectOnFocus: true
 });

 var comboFieldDelimiter = new Ext.form.ComboBox({
			fieldLabel: 'comboFieldDelimiter'
		,	name: 'comboFieldDelimiter'
		,	allowBlank: false
		,	store: ['\\t', ',', ';', '|', ']']
		,	typeAhead: true
		,	mode: 'local'
		,	triggerAction: 'all'
		,	emptyText:'-- Select Type--'
		,	selectOnFocus: true
 });

 var comboEnclosedBy = new Ext.form.ComboBox({
			fieldLabel: 'comboEnclosedBy'
		,	name: 'comboEnclosedBy'
		,	allowBlank: false
		,	store: ['(none)', '"', "'"]
		,	typeAhead: true
		,	mode: 'local'
		,	triggerAction: 'all'
		,	emptyText:'-- Select Type--'
		,	selectOnFocus: true
 });

	Ext.apply(this, config, {
			source: {
					'File Encoding': 'UTF-8'
				,	'Field Delimiter': '\\t'
				,	'Fields enclosed by': '\"'
				,	'Line ending': '\\r\\n'
				,	'Ignore header row': true
			}
		,	listeners: {
				beforeedit: function (e) {
					return( this.editable );

					switch (e.record.id) {
						default:
							return true;
					}
				}
			}			
		,	customEditors: {
					'File Encoding': new Ext.grid.GridEditor(comboEncoding)
				,	'Line ending': new Ext.grid.GridEditor(comboTerminatedBy)
				,	'Line ending': new Ext.grid.GridEditor(comboTerminatedBy)
				,	'Field Delimiter': new Ext.grid.GridEditor(comboFieldDelimiter)
				,	'Fields enclosed by': new Ext.grid.GridEditor(comboEnclosedBy)				
			}
	});

	GBIF.MetaMaker.Properties.superclass.constructor.call(this, config);

}	

Ext.extend(GBIF.MetaMaker.Properties, Ext.grid.PropertyGrid, {

		setCSV: function() {
				
			this.setSource({
					'File Encoding': 'UTF-8'
				,	'Field Delimiter': ','
				,	'Fields enclosed by': '\"'
				,	'Line ending': '\\r\\n'
				,	'Ignore header row': true
			});
			
//			this.editable = false;
			this.editable = true;
		}

	,	setTAB: function() {
			this.setSource({
					'File Encoding': 'UTF-8'
				,	'Field Delimiter': '\\t'
				,	'Fields enclosed by': ''
				,	'Line ending': '\\r\\n'
				,	'Ignore header row': true
			});

//			this.editable = false;
			this.editable = true;
		}

	,	setCustom: function() {
			this.setSource({
					'File Encoding': 'UTF-8'
				,	'Field Delimiter': ''
				,	'Fields enclosed by': ''
				,	'Line ending': ''
				,	'Ignore header row': true
			});

			this.editable = true;
		}


});