Ext.namespace('GBIF');
Ext.namespace('GBIF.MetaMaker');

if (GBIF.MetaMaker.CenterTab) {
	Ext.apply(GBIF.MetaMaker.CenterTab.prototype, {
			aboutTitle: 'Help'
		,	taxonTitle: 'Taxon'
		,	OccurrencesTitle: 'Occurrences'
	});
}
if (GBIF.MetaMaker.Center) {
	Ext.apply(GBIF.MetaMaker.Center.prototype, {
			txtResetAssistant: 'Reset Assistant'
		,	txtSortFields: 'Sort Fields'	
		,	msgConfirmTitle: 'Confirm'
		,	msgResetAssistant: 'Are you sure reset assistant?'
	});
}

if (GBIF.MetaMaker.Details) {
	Ext.apply(GBIF.MetaMaker.Details.prototype, {
			title: 'Details'
	});
}

if (GBIF.MetaMaker.Extension) {
	Ext.apply(GBIF.MetaMaker.Extension.prototype, {
			txtEmptyFileName: '{your filename here} Ex: myfile.csv'
		,	txtAddSpacer: 'Add Spacer'
		,	txtRemoveSpacer: 'Remove Spacer'
		,	txtFileName: "Filename:"
		,	columnTerm: 'Term'
		,	columnRequired: 'Required'
		,	columnDefaultValue: 'Default Value'
		,	columnGlobal: 'Global'
		,	columnVocabulary: 'Vocabulary'
	});
}

if (GBIF.MetaMaker.LoadWindow) {
	Ext.apply(GBIF.MetaMaker.LoadWindow.prototype, {
			title: 'Load File'
		,	txtLoadInstruction: 'Please paste your meta.xml text into the area below and click "Load".'
		,	btnLoad: 'Load'
		,	btnCancel: 'Cancel'
	});
}

if (GBIF.MetaMaker.MetaPanel) {
	Ext.apply(GBIF.MetaMaker.MetaPanel.prototype, {
			title: 'meta.xml'
		,	txtEmptyMetaData: 'dataset metadata document, e.g.  eml.xml'
		,	txtSaveFile: 'Save File'
		,	txtLoadFile: 'Load File'
		,	txtValidate: 'Validate'
		,	txtMetaDataset: 'Metadata file describing dataset:'
	});
}