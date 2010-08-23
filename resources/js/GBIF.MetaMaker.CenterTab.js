Ext.namespace('GBIF');
Ext.namespace('GBIF.MetaMaker');

GBIF.MetaMaker.CenterTab = function(config){

	this.metaPanel = new GBIF.MetaMaker.MetaPanel();
	this.aboutPanel = new Ext.Panel({
			title: 'About'
		,	autoLoad: 'resources/docs/about.html'
		,	padding: 5
		,	bodyStyle: 'font-size: 12px'
	});
	
	this.coreSpecimensPanel = new GBIF.MetaMaker.ExtensionPanel({
			id: 'core-taxon'
		,	title: 'Taxon'
		,	type: 'core'
		,	skip: false
		,	url: 'http://rs.gbif.org/core/dwc_taxon.xml'
	});

	this.coreObservationsPanel = new GBIF.MetaMaker.ExtensionPanel({
			id: 'core-occurrences'
		,	title: 'Occurrences'
		,	type: 'core'
		,	skip: true
		,	url: 'http://rs.gbif.org/core/dwc_occurrence.xml'
	});
	
	Ext.apply(this, config, {
			width: 400
		,	height: 400
		,	activeTab: 0
		,	items: [
					this.aboutPanel
				,	this.metaPanel
				,	this.coreSpecimensPanel
				,	this.coreObservationsPanel
			]
		,	listeners: {
					tabchange: this.checkTab
				,	render: function() {
						this.hideTabStripItem("core-occurrences");
					}
			}
	});
	
	GBIF.MetaMaker.CenterTab.superclass.constructor.call(this, config);
}	

Ext.extend(GBIF.MetaMaker.CenterTab,Ext.TabPanel,  {

	checkTab: function( tp, panel ) {

		if(panel) {
			switch(panel.type) {
				case 'meta':
					panel.metaData.core = [];
					panel.metaData.extensions = [];
					
					tp.items.each(function(tab){
						if (!tab.skip) {
							if (tab.type == 'ext') {
								var tmpRec = {
										name: tab.title
									,	rowType: tab.url
									,	filename: tab.extension.filename.getValue()
									,	fileSettings: tab.fileSettings.prop.getSource()
									,	fields: []
								}
								tab.extension.store.each(function(rec) {
									tmpRec.fields.push({
											term: rec.data.term
										,	dataType: rec.data.dataType
										,	required: rec.data.required
										,	static: rec.data.static
										,	qualName: rec.data.qualName
									});
								});
								panel.metaData.extensions.push(tmpRec);
								delete(tmpRec);
								panel.generateXML();
							}
	
							if (tab.type == 'core') {
								var tmpProp = tab.fileSettings.prop.getSource();
								if (Ext.isEmpty(tmpProp)) {
									tmpProp = {
											'File Encoding': 'UTF-8'
										,	'Field Delimiter': '\\t'
										,	'Fields enclosed by': '\"\"'
										,	'Line ending': '\\r\\n'
										,	'Ignore header row': true
									}
								}

								var tmpRec = {
										name: tab.title
									,	rowType: tab.url
									,	filename: tab.extension.filename.getValue()
									,	fileSettings: tmpProp
									,	fields: []
								}
								
								tab.extension.store.each(function(rec) {
									tmpRec.fields.push({
											term: rec.data.term
										,	dataType: rec.data.dataType
										,	required: rec.data.required
										,	static: rec.data.static
										,	qualName: rec.data.qualName
									});
								});
								panel.metaData.core.push(tmpRec);
								delete(tmpRec);
								panel.generateXML();
							}

						}

					});
					break;
	
				default:
					break;
			}
		}
	}

});