Ext.namespace('GBIF');
Ext.namespace('GBIF.MetaMaker');

GBIF.MetaMaker.MetaPanel = function(config){
	this.metaData = {
			core: []
		,	extensions: []
	};

	this.filename = new Ext.form.TextField({
			width: 250
		,	emptyText: "dataset metadata document, e.g.  eml.xml"
		,	listeners: {
					valid: this.generateXML
				,	scope: this
			}
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
				,	iconCls: 'iconSave'
				, handler: function() {
						window.location = "resources/api/savefile.php?data=" + encodeURIComponent(this.body.dom.textContent);
				 	}
			},{
					text: "Load File"
				,	scope: this
				,	iconCls: 'iconLoad'
				, handler: function() {
						this.loadXml = new GBIF.MetaMaker.LoadWindow();
						this.loadXml.show();
						this.loadXml.refBtnLoad.on('click', this.loadFile, this);						
				 	}
			}, ' ', {
					text: "Validate"
				,	scope: this
				,	iconCls: 'iconValidate'
				, 	handler: function() {
						window.open("http://tools.gbif.org/dwca-validator/validate.do?meta=" + encodeURIComponent(this.body.dom.textContent),'_blank');
				 	}
			}, "->", "Metadata file describing dataset:"
				, this.filename
			]
		,	tpl: new Ext.XTemplate(
					'<pre><div class="meta">&lt;?xml version="1.0"?&gt;\r\n'
				,	'&lt;archive xmlns="http://rs.tdwg.org/dwc/text/"'
				,		'<tpl if="metadata != \'\'">'
				,			' metadata="{metadata}"'
				,		'</tpl>'
				,	'&gt;\r\n'

				,	'<tpl for="core">'
				,	'\t&lt;core encoding="{[this.addSlashes(values.fileSettings["File Encoding"])]}" linesTerminatedBy="{[this.addSlashes(values.fileSettings["Line ending"])]}" fieldsTerminatedBy="{[this.addSlashes(values.fileSettings["Field Delimiter"])]}" fieldsEnclosedBy="{[this.addSlashes(values.fileSettings["Fields enclosed by"])]}" ignoreHeaderLines="{[this.addSlashes(values.fileSettings["Ignore header row"])]}" rowType="{rowType}"&gt;\r\n'
				,		'\t\t&lt;files&gt;\r\n'
				,			'\t\t\t&lt;location>{filename}&lt;/location&gt;\r\n'
				,		'\t\t&lt;/files&gt;\r\n'
				,		'<tpl for="fields">'
				,			'<tpl if="xindex &gt; 0">'
				,				'<tpl if="term != \'Spacer\'">'

				,				'<tpl if="term == \'ID\'">'
				,					'\t\t&lt;id index="{rIndex}"/&gt;\r\n'
				,				'</tpl>'

				,				'<tpl if="term != \'ID\'">'
				,					'\t\t&lt;field'
				,						'<tpl if="rIndex != -1">'
				,							' index="{rIndex}"'
				,						'</tpl>'
				,						'<tpl if="rIndex == -1 || static != \'\'">'
				,							' default="{static}"'
				,						'</tpl>'
				,						'<tpl if="vocabulary != \'\'">'
				,							' vocabulary="{vocabulary}"'
				,						'</tpl>'
				,					' term="{qualName}"/&gt;\r\n'
				,				'</tpl>'
				
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

				,		'<tpl for="fields">'
				,			'<tpl if="term != \'Spacer\'">'

				,				'<tpl if="term == \'Core ID\'">'
				,					'\t\t&lt;coreid index="{rIndex}"/&gt;\r\n'
				,				'</tpl>'
				

				,				'<tpl if="term != \'Core ID\'">'
				,					'\t\t&lt;field'
				,						'<tpl if="rIndex != -1">'
				,							' index="{rIndex}"'
				,						'</tpl>'
				,						'<tpl if="rIndex == -1 || static != \'\'">'
				,							' default="{static}"'
				,						'</tpl>'
				,						'<tpl if="vocabulary != \'\'">'
				,							' vocabulary="{vocabulary}"'
				,						'</tpl>'
				,					' term="{qualName}"/&gt;\r\n'
				,				'</tpl>'
				
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
								if(Ext.encode(o)!='{}'){
									if (typeof o == "boolean") {
										return (o) ? 1 : 0;
									}
									
									if (typeof o != 'undefined') {
										o = o.replace("(none)", "");
										return( o.replace(/\"/g, "&amp;quot;") );
									} else {
										return("");
									}
								}
							}
					}
					
			)
	})

	GBIF.MetaMaker.MetaPanel.superclass.constructor.call(this, config);
}	

Ext.extend(GBIF.MetaMaker.MetaPanel, Ext.Panel, {
	
		generateXML: function() {
			this.metaData.metadata = this.filename.getValue();
			
			Ext.each(this.metaData.extensions, function(extension) {
				var pos = -1;
				var idRec = null;
				Ext.each(extension.fields, function(field, index) {
					if (field.term == "Core ID") {
						pos = index;
						idRec = field;
					}
				});
				if (pos != -1) {
					extension.fields.splice(pos, 1);
					extension.fields.unshift(idRec);
				}
			});
	
			Ext.each(this.metaData.core, function(extension) {
				var pos = -1;
				var idRec = null;
				Ext.each(extension.fields, function(field, index) {
	
					if (field.term == "ID") {
						pos = index;
						idRec = field;
					}
				});
				if (pos != -1) {
					extension.fields.splice(pos, 1);
					extension.fields.unshift(idRec);
				}
			});
			
			this.tpl.overwrite(this.body, this.metaData);
		}
	
	,	loadFile: function(){
			if(this.loadXml.txtLoadFile.isValid()){
				var txtValue = this.loadXml.txtLoadFile.getValue();
				var reg = new RegExp("\\s{2,}", "g");
				txtValue = txtValue.replace(reg, " ");
				txtValue = txtValue.replace(/\&/g, "&amp;");
				txtValue = txtValue.replace(/\"""/g, "\"&amp;quot;\"");
				txtValue = txtValue.replace(/\"'"/g, "\"&amp;#39;\"");
				txtValue = txtValue.replace(/\","/g, "\"&amp;#44;\"");
				txtValue = txtValue.replace(/\";"/g, "\"&amp;#59;\"");
				txtValue = txtValue.replace(/\|/g, "&amp;#124;");
				txtValue = txtValue.replace(/\"]"/g, "\"&amp;#93;\"");
				txtValue = txtValue.replace(/\\t/g, "\\tabSpace");
				parser = new DOMParser();
				xmlDoc = parser.parseFromString(txtValue,"text/xml");
				var fieldArray = xmlDoc.getElementsByTagName('field');
				if(!Ext.isEmpty(fieldArray)){
					for(var i=0; i<fieldArray.length; i++){
						attr = fieldArray[i].attributes.getNamedItem('default');
						if(attr != null){
							var default_ = xmlDoc.createAttribute('default_');
							default_.nodeValue = attr.nodeValue;
							fieldArray[i].attributes.setNamedItem(default_);
							fieldArray[i].attributes.removeNamedItem('default')		
						}
					}
				}
				var newXMl = (new XMLSerializer()).serializeToString(xmlDoc);
				this.fireEvent('loadXML', xml2json.parser(newXMl));
				this.loadXml.close();
			}
		}

});