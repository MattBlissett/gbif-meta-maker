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
		,	tbar: ["Filename:", this.filename, {
					text: "Save File"
				, handler: function() {
//						console.log("Savefile");
				 	}
			}]
		,	tpl: new Ext.XTemplate(
					'<pre><div class="meta">&lt;?xml version="1.0"?&gt;<br/>'
				,	'&lt;archive xmlns="http://rs.tdwg.org/dwc/text/"&gt;<br/>'

				,	'<tpl for="core">'
				,	'\t&lt;core encoding="{[values.fileSettings["File Encoding"]]}" linesTerminatedBy="{[values.fileSettings["Line ending"]]}" fieldsTerminatedBy="{[values.fileSettings["Filed Delimiter"]]}" fieldsEnclosedBy="{fieldsEnclosedBy}" ignoreHeaderLines="{[values.fileSettings["Ignore header row"]]}" rowType="???"&gt;<br/>'
				,		'\t\t&lt;files&gt;<br/>'
				,			'\t\t\t&lt;location>{filename}&lt;/location&gt;<br/>'
				,		'\t\t&lt;/files&gt;<br/>'
				,		'<tpl for="fields">'
				,			'<tpl if="xindex == 1">'
				,				'\t\t&lt;coreid index="{#}"/&gt;<br/>'
				,			'</tpl>'

				,			'<tpl if="xindex &gt; 1">'
				,				'\t\t&lt;field index="{#}" term="{term}"/&gt;<br/>'
				,			'</tpl>'
				,		'</tpl>'
				,	'\t&lt;/core&gt;<br/>'
				,	'</tpl>'



				,	'<tpl for="extensions">'
				,	'\t&lt;extension encoding="{[values.fileSettings["File Encoding"]]}" linesTerminatedBy="{[values.fileSettings["Line ending"]]}" fieldsTerminatedBy="{[values.fileSettings["Filed Delimiter"]]}" fieldsEnclosedBy="{fieldsEnclosedBy}" ignoreHeaderLines="{[values.fileSettings["Ignore header row"]]}" rowType="???"&gt;<br/>'
				,		'\t\t&lt;files&gt;<br/>'
				,			'\t\t\t&lt;location>{filename}&lt;/location&gt;<br/>'
				,		'\t\t&lt;/files&gt;<br/>'

				,		'\t\t&lt;coreid index="0"/&gt;<br/>'

				,		'<tpl for="fields">'
				,			'<tpl if="term != \'Spacer\'">'
				,					'\t\t&lt;field index="{#}" term="{term}"/&gt;<br/>'
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
		this.tpl.overwrite(this.body, this.metaData);
	}

});