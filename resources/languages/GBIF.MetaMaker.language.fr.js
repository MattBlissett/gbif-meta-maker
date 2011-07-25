Ext.namespace('GBIF');
Ext.namespace('GBIF.MetaMaker');

if (GBIF.MetaMaker.CenterTab) {
	Ext.apply(GBIF.MetaMaker.CenterTab.prototype, {
			aboutTitle: 'Aide'
		,	taxonTitle: 'Taxon'
		,	OccurrencesTitle: 'événements'
	});
}
if (GBIF.MetaMaker.Center) {
	Ext.apply(GBIF.MetaMaker.Center.prototype, {
			txtResetAssistant: 'Réinitialiser adjoint'
		,	txtSortFields: 'Champs de tri'	
		,	msgConfirmTitle: 'Confirmer'
		,	msgResetAssistant: 'Etes-vous assistante réinitialiser sûr?'
	});
}

if (GBIF.MetaMaker.Details) {
	Ext.apply(GBIF.MetaMaker.Details.prototype, {
			title: 'Détails'
	});
}

if (GBIF.MetaMaker.Extension) {
	Ext.apply(GBIF.MetaMaker.Extension.prototype, {
			txtEmptyFileName: '{votre nom ici} Ex: myfile.csv'
		,	txtAddSpacer: 'Ajouter Spacer'
		,	txtRemoveSpacer: 'Retirer Spacer'
		,	txtFileName: "Nom de fichier:"
		,	columnTerm: 'Terme'
		,	columnRequired: 'Obligatoires'
		,	columnDefaultValue: 'Valeur par défaut'
		,	columnGlobal: 'Mondial'
		,	columnVocabulary: 'Vocabulaire'
	});
}

if (GBIF.MetaMaker.LoadWindow) {
	Ext.apply(GBIF.MetaMaker.LoadWindow.prototype, {
			title: 'Charger un fichier'
		,	txtLoadInstruction: 'S\'il vous plaît coller votre texte dans la zone meta.xml ci-dessous et cliquez sur "Charge".'
		,	btnLoad: 'Charge'
		,	btnCancel: 'Annuler'
	});
}

if (GBIF.MetaMaker.MetaPanel) {
	Ext.apply(GBIF.MetaMaker.MetaPanel.prototype, {
			title: 'meta.xml'
		,	txtEmptyMetaData: 'document de métadonnées ensemble de données, par exemple eml.xml'
		,	txtSaveFile: 'Enregistrer le fichier'
		,	txtLoadFile: 'Charger un fichier'
		,	txtValidate: 'Valider'
		,	txtMetaDataset: 'Fichier de métadonnées décrivant dataset:'
	});
}