Ext.namespace('GBIF');

GBIF.MetaMakerCenterTab = function(config){
	
	this.vernacularNames=new GBIF.VernacularNames();
	this.metaTab=new GBIF.MetaTab();
	this.editorGridTab=new GBIF.EditorGridTab();
	
	Ext.apply(this, config, {
			width: 400
        ,	height: 400
		,	activeTab: 1
		,	items:[this.vernacularNames,this.metaTab,this.editorGridTab]
		
	})
	GBIF.MetaMakerCenterTab.superclass.constructor.call(this, config);
}	
Ext.extend(GBIF.MetaMakerCenterTab,Ext.TabPanel,  {
	
});