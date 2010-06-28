Ext.namespace('GBIF');
Ext.namespace('GBIF.MetaMaker');

GBIF.MetaMaker.Properties = function(config){

	editable: true;

	Ext.apply(this, config, {
			source: {
					'File Encoding': 'UTF-8'
				,	'Field Delimiter': '\\t'
				,	'Fields enclosed by': '\"\"'
				,	'Line ending': '\\r\\n'
				,	'Ignore header row': true
			}
		,	listeners: {
				beforeedit: function (e) {
					return( this.editable );

					switch (e.record.id) {
						default:
//							console.log( e, e.record, e.record.id );
							return true;
					}
				}
			}			
	});

	GBIF.MetaMaker.Properties.superclass.constructor.call(this, config);

}	

Ext.extend(GBIF.MetaMaker.Properties, Ext.grid.PropertyGrid, {

		setCSV: function() {
				
			this.setSource({
					'File Encoding': 'UTF-8'
				,	'Field Delimiter': ','
				,	'Fields enclosed by': '\"\"'
				,	'Line ending': '\\n'
				,	'Ignore header row': true
			});
			
			this.editable = false;

		}

	,	setTAB: function() {
			this.setSource({
					'File Encoding': 'UTF-8'
				,	'Field Delimiter': '\\t'
				,	'Fields enclosed by': '\"\"'
				,	'Line ending': '\\r\\n'
				,	'Ignore header row': true
			});

			this.editable = false;

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