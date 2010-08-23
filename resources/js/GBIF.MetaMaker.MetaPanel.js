Ext.namespace('GBIF');
Ext.namespace('GBIF.MetaMaker');

GBIF.MetaMaker.MetaPanel = function(config){

	this.metaData = {
			core: []
		,	extensions: []
	};

	this.filename = new Ext.form.TextField({
		width: 100
	});

	Ext.apply(this, config, {
			height: 200
		,	type: 'meta'
		,	id: 'meta'
		,	title: 'meta.xml'
		,	skip: true
		,	iconCls: 'iconPageWhiteCode'
		,	padding: 10
		,	autoScroll: true
		,	border: false
		,	tbar: [{
					text: "Save File"
				,	scope: this
				, handler: function() {
						window.location = "resources/api/savefile.php?data=" + encodeURI(this.body.dom.textContent);
				 	}
			}]
		,	tpl: new Ext.XTemplate(
					'<pre><div class="meta">&lt;?xml version="1.0"?&gt;\r\n'
				,	'&lt;archive xmlns="http://rs.tdwg.org/dwc/text/"&gt;\r\n'

				,	'<tpl for="core">'
				,	'\t&lt;core encoding="{[this.addSlashes(values.fileSettings["File Encoding"])]}" linesTerminatedBy="{[this.addSlashes(values.fileSettings["Line ending"])]}" fieldsTerminatedBy="{[this.addSlashes(values.fileSettings["Field Delimiter"])]}" fieldsEnclosedBy="{[this.addSlashes(values.fileSettings["Fields enclosed by"])]}" ignoreHeaderLines="{[this.addSlashes(values.fileSettings["Ignore header row"])]}" rowType="{rowType}"&gt;\r\n'
				,		'\t\t&lt;files&gt;\r\n'
				,			'\t\t\t&lt;location>{filename}&lt;/location&gt;\r\n'
				,		'\t\t&lt;/files&gt;\r\n'
				,		'\t\t&lt;coreid index="0"/&gt;\r\n'
				,		'<tpl for="fields">'
				,			'<tpl if="xindex &gt; 0">'
				,				'<tpl if="term != \'Spacer\'">'
				,						'\t\t&lt;field index="{#}" '
				,						'term="{qualName}"/&gt;\r\n'
				,				'</tpl>'
				,			'</tpl>'
				,		'</tpl>'
				,	'\t&lt;/core&gt;\r\n'
				,	'</tpl>'

				,	'<tpl for="extensions">'
				,	'\t&lt;extension encoding="{[this.addSlashes(values.fileSettings["File Encoding"])]}" linesTerminatedBy="{[this.addSlashes(values.fileSettings["Line ending"])]}" fieldsTerminatedBy="{[this.addSlashes(values.fileSettings["Field Delimiter"])]}" fieldsEnclosedBy="{[this.addSlashes(values.fileSettings["Fields enclosed by"])]}" ignoreHeaderLines="{[this.addSlashes(values.fileSettings["Ignore header row"])]}" rowType="{rowType}"&gt;\r\n'
				,		'\t\t&lt;files&gt;\r\n'
				,			'\t\t\t&lt;location>{filename}&lt;/location&gt;\r\n'
				,		'\t\t&lt;/files&gt;\r\n'

				,		'\t\t&lt;coreid index="0"/&gt;\r\n'

				,		'<tpl for="fields">'
				,			'<tpl if="term != \'Spacer\'">'
				,					'\t\t&lt;field index="{#}" '
				,						'<tpl if="static != \'\'">'
				,							' default="{static}" '
				,						'</tpl>'
				,					'term="{qualName}"/&gt;\r\n'
				,			'</tpl>'
				,		'</tpl>'

				,	'\t&lt;/extension&gt;\r\n'
				,	'</tpl>'

				,	'&lt;/archive&gt;<br/>'
				,	'</div>'
				,	{
							exists: function(o){
								return typeof o != 'undefined' && o != null && o!='';
							}
						,	addSlashes: function(o){		
								if (typeof o == "boolean") {
									return (o) ? 1 : 0;
								}
								
								if (typeof o != 'undefined') {
									return( o.replace(/\"/g, "\\\"") );
								} else {
									return("");
								}
							}
					}
					
			)
	})

	GBIF.MetaMaker.MetaPanel.superclass.constructor.call(this, config);
}	

Ext.extend(GBIF.MetaMaker.MetaPanel, Ext.Panel, {

	generateXML: function() {
		this.tpl.overwrite(this.body, this.metaData);
	}

});