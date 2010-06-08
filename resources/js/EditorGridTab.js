Ext.namespace('GBIF');

GBIF.EditorGridTab = function(config){

	Ext.apply(this, config, {
			title: 'My Editor Grid'
		,	columns: [
                        {
                            xtype: 'gridcolumn',
                            header: 'Column',
                            sortable: true,
                            resizable: true,
                            width: 100,
                            dataIndex: 'string',
                            editor: {
                                xtype: 'displayfield',
                                fieldLabel: 'Label',
                                value: 'Display Field'
                            }
                        },
                        {
                            xtype: 'gridcolumn',
                            header: 'Column',
                            sortable: true,
                            resizable: true,
                            width: 100,
                            dataIndex: 'string',
                            editor: {
                                xtype: 'textfield',
                                fieldLabel: 'Label',
                                readOnly: true
                            }
                        },
                        {
                            xtype: 'gridcolumn',
                            header: 'Column',
                            sortable: true,
                            resizable: true,
                            width: 100,
                            dataIndex: 'string',
                            editor: {
                                xtype: 'textfield',
                                fieldLabel: 'Label'
                            }
                        }
                    ]
		
	})
	GBIF.EditorGridTab.superclass.constructor.call(this, config);
}	
Ext.extend(GBIF.EditorGridTab,Ext.grid.EditorGridPanel,  {
	
});
