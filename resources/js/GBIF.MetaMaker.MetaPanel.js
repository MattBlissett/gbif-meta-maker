Ext.namespace('GBIF');
Ext.namespace('GBIF.MetaMaker');

GBIF.MetaMaker.MetaPanel = function(config){

	this.data = {
			encoding: "UTF-8"
		,	linesTerminatedBy: "\\r\\n"
		,	fieldsTerminatedBy: "\\t"
		,	fieldsEnclosedBy: ""
		,	ignoreHeaderLines: 1
	};

	Ext.apply(this, config, {
			height: 200
		,	title: 'meta.xml'
		,	iconCls: 'iconPageWhiteCode'
		,	padding: 10
		,	border: false
		,	tpl: new Ext.XTemplate(
					'<div class="meta">&lt;?xml version="1.0"?&gt;<br/>'
				,	'\t&lt;archive xmlns="http://rs.tdwg.org/dwc/text/"&gt;<br/>'
				,	'\t\t&lt;core encoding="{encoding}" linesTerminatedBy="{linesTerminatedBy}" fieldsTerminatedBy="{fieldsTerminatedBy}" fieldsEnclosedBy="{fieldsEnclosedBy}" ignoreHeaderLines="{ignoreHeaderLines}" rowType="{rowType}"&gt;'
				,	'</div>'
			)
		,	listeners: {
				activate: this.generateXML
			}
	})

	GBIF.MetaMaker.MetaPanel.superclass.constructor.call(this, config);
}	

Ext.extend(GBIF.MetaMaker.MetaPanel, Ext.Panel, {

	generateXML: function() {
		this.tpl.overwrite(this.body, this.data);
	}

});