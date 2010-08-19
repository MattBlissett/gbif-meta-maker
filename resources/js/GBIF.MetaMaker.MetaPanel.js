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
						window.location = "resources/api/savefile.php?data=" + this.body.dom.textContent;
				 	}
			}]
		,	tpl: new Ext.XTemplate(
					'<pre><div class="meta">&lt;?xml version="1.0"?&gt;<br/>'
				,	'&lt;archive xmlns="http://rs.tdwg.org/dwc/text/"&gt;<br/>'

				,	'<tpl for="core">'
				,	'\t&lt;core encoding="{[values.fileSettings["File Encoding"]]}" linesTerminatedBy="{[values.fileSettings["Line ending"]]}" fieldsTerminatedBy="{[values.fileSettings["Field Delimiter"]]}" fieldsEnclosedBy="{[values.fileSettings["Fields enclosed by"]]}" ignoreHeaderLines="{[values.fileSettings["Ignore header row"]]}" rowType="{rowType}"&gt;<br/>'
				,		'\t\t&lt;files&gt;<br/>'
				,			'\t\t\t&lt;location>{filename}&lt;/location&gt;<br/>'
				,		'\t\t&lt;/files&gt;<br/>'
				,		'<tpl for="fields">'
				,			'<tpl if="xindex == 0">'
				,				'\t\t&lt;coreid index="{#}"/&gt;<br/>'
				,			'</tpl>'

				,			'<tpl if="xindex &gt; 0">'
				,				'<tpl if="term != \'Spacer\'">'
				,						'\t\t&lt;field index="{#}" '
//				,							'<tpl if="static != \'\'">'
//				,								' default="{static}" '
//				,							'</tpl>'
				,						'term="{qualName}"/&gt;<br/>'
				,				'</tpl>'
//				,				'\t\t&lt;field index="{#}" term="{term}"/&gt;<br/>'
				,			'</tpl>'
				,		'</tpl>'
				,	'\t&lt;/core&gt;<br/>'
				,	'</tpl>'



				,	'<tpl for="extensions">'
				,	'\t&lt;extension encoding="{[values.fileSettings["File Encoding"]]}" linesTerminatedBy="{[values.fileSettings["Line ending"]]}" fieldsTerminatedBy="{[values.fileSettings["Field Delimiter"]]}" fieldsEnclosedBy="{[values.fileSettings["Fields enclosed by"]]}" ignoreHeaderLines="{[values.fileSettings["Ignore header row"]]}" rowType="{rowType}"&gt;<br/>'
				,		'\t\t&lt;files&gt;<br/>'
				,			'\t\t\t&lt;location>{filename}&lt;/location&gt;<br/>'
				,		'\t\t&lt;/files&gt;<br/>'

				,		'\t\t&lt;coreid index="0"/&gt;<br/>'

				,		'<tpl for="fields">'
				,			'<tpl if="term != \'Spacer\'">'
				,					'\t\t&lt;field index="{#}" '
				,						'<tpl if="static != \'\'">'
				,							' default="{static}" '
				,						'</tpl>'
				,					'term="{qualName}"/&gt;<br/>'
				,			'</tpl>'
				,		'</tpl>'

				,	'\t&lt;/extension&gt;<br/>'
				,	'</tpl>'



				,	'&lt;/archive&gt;<br/>'
				,	'</div>'
				,	{
						exists: function(o){
//console.log(o);
								return typeof o != 'undefined' && o != null && o!='';
						}
					}
			)
		,	listeners: {
//				activate: this.generateXML
			}
	})

	GBIF.MetaMaker.MetaPanel.superclass.constructor.call(this, config);
}	

Ext.extend(GBIF.MetaMaker.MetaPanel, Ext.Panel, {

	generateXML: function() {
//console.log(this.metaData);		
		this.tpl.overwrite(this.body, this.metaData);
	}

});