Ext.namespace('GBIF');

GBIF.MetaTab = function(config){

	Ext.apply(this, config, {
			title: 'meta.xml'
		,	iconCls: 'icon-text'
		,	html: 'xml data goes here...'
		,	padding: 10	
 		,	tbar: {
                        xtype: 'toolbar',
                        items: [
                            {
                                xtype: 'button',
                                text: 'Save as...',
                                iconCls: 'icon-save'
                            },
                            {
                                xtype: 'tbfill'
                            },
                            {
                                xtype: 'button',
                                text: 'Validate',
                                iconCls: 'icon-validate'
                            }
                        ]
                   }
		
	})
	GBIF.MetaTab.superclass.constructor.call(this, config);
}	
Ext.extend(GBIF.MetaTab,Ext.Panel,  {
	
});


                                  