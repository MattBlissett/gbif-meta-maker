Ext.namespace('GBIF');
Ext.namespace('GBIF.MetaMaker');

if (GBIF.MetaMaker.CenterTab) {
	Ext.apply(GBIF.MetaMaker.CenterTab.prototype, {
			aboutTitle: 'Ayuda'
		,	taxonTitle: 'Taxón'
		,	OccurrencesTitle: 'Ocurrencias'
	});
}
if (GBIF.MetaMaker.Center) {
	Ext.apply(GBIF.MetaMaker.Center.prototype, {
			txtResetAssistant: 'Restablecer Asistente'
		,	txtSortFields: 'Los campos tipo'	
		,	msgConfirmTitle: 'Confirmar'
		,	msgResetAssistant: '¿Está usted seguro de restablecer asistente?'
	});
}

if (GBIF.MetaMaker.Details) {
	Ext.apply(GBIF.MetaMaker.Details.prototype, {
			title: 'Detalles'
	});
}

if (GBIF.MetaMaker.Extension) {
	Ext.apply(GBIF.MetaMaker.Extension.prototype, {
			txtEmptyFileName: '{el nombre del archivo aquí} Ejemplo: myfile.csv'
		,	txtAddSpacer: 'Añadir Spacer'
		,	txtRemoveSpacer: 'Retire el espaciador'
		,	txtFileName: "Nombre del fichero:"
		,	columnTerm: 'Plazo'
		,	columnRequired: 'Necesario'
		,	columnDefaultValue: 'Valor predeterminado'
		,	columnGlobal: 'Global'
		,	columnVocabulary: 'Vocabulario'
	});
}

if (GBIF.MetaMaker.LoadWindow) {
	Ext.apply(GBIF.MetaMaker.LoadWindow.prototype, {
			title: 'Cargar archivo'
		,	txtLoadInstruction: 'Por favor, pegue el texto meta.xml en la zona de abajo y haga clic en "Carga".'
		,	btnLoad: 'Carga'
		,	btnCancel: 'Cancelar'
	});
}

if (GBIF.MetaMaker.MetaPanel) {
	Ext.apply(GBIF.MetaMaker.MetaPanel.prototype, {
			title: 'meta.xml'
		,	txtEmptyMetaData: 'conjunto de datos de documentos de metadatos, por ejemplo, eml.xml'
		,	txtSaveFile: 'Guardar archivo'
		,	txtLoadFile: 'Cargar archivo'
		,	txtValidate: 'Validar'
		,	txtMetaDataset: 'Archivo de metadatos que describen datos:'
	});
}