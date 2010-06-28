Ext.namespace('GBIF');
Ext.namespace('GBIF.MetaMaker');

GBIF.MetaMaker.CenterTab = function(config){

	this.metaPanel = new GBIF.MetaMaker.MetaPanel();
	this.coreSpecimensPanel = new GBIF.MetaMaker.ExtensionPanel({
			id: 'core-specimens'
		,	title: 'Specimens'
		,	type: 'core'
	});

	this.coreObservationsPanel = new GBIF.MetaMaker.ExtensionPanel({
			id: 'core-observations'
		,	title: 'Observations'
		,	type: 'core'
		,	hidden: true
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
						
						if (tab.type == 'ext') {
							var tmpRec = {
									name: tab.title
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
							var tmpRec = {
									name: tab.title
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

					});
					break;
	
				default:
					break;
			}
		}
	}

});