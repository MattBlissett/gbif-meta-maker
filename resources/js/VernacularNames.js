
Ext.namespace('GBIF');

GBIF.VernacularNames = function(config){
	Ext.apply(this, config, {
			title: 'GNA Vernacular Names'
		,	columns: [
                            {
                                xtype: 'gridcolumn',
                                header: 'Select',
                                sortable: true,
                                resizable: true,
                               // width: 40,
                                dataIndex: 'string'
                            },
                            {
                                xtype: 'gridcolumn',
                                header: 'Index',
                                sortable: true,
                                resizable: true,
                                //width: 40,
                                dataIndex: 'string'
                            },
                            {
                                xtype: 'gridcolumn',
                                header: 'Term',
                                sortable: true,
                                resizable: true,
                                //width: 100,
                                dataIndex: 'string'
                            },
                            {
                                xtype: 'gridcolumn',
                                header: 'Data Type',
                                sortable: true,
                                resizable: true,
                                //width: 100,
                                dataIndex: 'string'
                            },
                            {
                                xtype: 'gridcolumn',
                                header: 'Static/Variable Mapping',
                                sortable: true,
                                resizable: true,
                               // width: 150,
                                dataIndex: 'string'
                            },
                            {
                                xtype: 'gridcolumn',
                                header: 'Column',
                                sortable: true,
                                resizable: true,
                                //width: 100,
                                dataIndex: 'string'
                            }
                        ]
	})
	GBIF.VernacularNames.superclass.constructor.call(this, config);
}	
Ext.extend(GBIF.VernacularNames,Ext.grid.GridPanel,  {
	
});