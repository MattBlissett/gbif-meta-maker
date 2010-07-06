Ext.namespace('GBIF');
Ext.namespace('GBIF.MetaMaker');

GBIF.MetaMaker.CenterTab = function(config){

	this.metaPanel = new GBIF.MetaMaker.MetaPanel();
	this.coreSpecimensPanel = new GBIF.MetaMaker.ExtensionPanel({
			id: 'core-specimens'
		,	title: 'Specimens'
		,	type: 'core'
		,	skip: false
	});

	this.coreObservationsPanel = new GBIF.MetaMaker.ExtensionPanel({
			id: 'core-observations'
		,	title: 'Observations'
		,	type: 'core'
		,	skip: true
	});
	
	Ext.apply(this, config, {
			width: 400
		,	height: 400
		,	activeTab: 0
		,	items: [
					this.metaPanel
				,	this.coreSpecimensPanel
				,	this.coreObservationsPanel
			]
		,	listeners: {
					tabchange: this.checkTab
				,	render: function() {
						this.hideTabStripItem("core-observations");
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
									,	filename: tab.extension.filename.getValue()
									,	fileSettings: tab.fileSettings.prop.getSource()
									,	fields: []
								}
								tab.extension.store.each(function(rec) {
									tmpRec.fields.push({
										term: rec.data.term
									});
								});
								panel.metaData.extensions.push(tmpRec);
								delete(tmpRec);
								panel.generateXML();
							}
	
							if (tab.type == 'core') {
								var tmpProp = tab.fileSettings.prop.getSource();
//								console.log(tmpProp);
								if (Ext.isEmpty(tmpProp)) {
									tmpProp = {
										foo: "bar",
										"Field Delimiter": "\\t"
									}
								}
/*								
								var prop = {
									fieldTerminatedBy: tmpProp.FieldDelimiter || null
								}
								console.log(prop);
*/								
//console.log(tab.fileSettings.prop.getSource() );
								var tmpRec = {
										name: tab.title
									,	filename: tab.extension.filename.getValue()
//									,	fileSettings: prop
									,	fileSettings: tmpProp
									,	fields: []
								}
								
								tab.extension.store.each(function(rec) {
									tmpRec.fields.push({
										term: rec.data.term
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