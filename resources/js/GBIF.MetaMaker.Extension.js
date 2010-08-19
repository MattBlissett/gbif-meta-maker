Ext.namespace('GBIF');
Ext.namespace('GBIF.MetaMaker');

GBIF.MetaMaker.Extension = function(config){

 var store = new Ext.data.ArrayStore({
		fields: [
			 	{name: 'term'}
			,	{name: 'dataType'}
			,	{name: 'required'}
			,	{name: 'static'}
			,	{name: 'description'}
			,	{name: 'qualName'}
			,	{name: 'namespace'}
			,	{name: 'relation'}
		]
	});

	this.filename = new Ext.form.TextField({
		width: 250
	});

	Ext.apply(this, config, {
			store: store
		,	columns: [
//          new Ext.grid.RowNumberer()
      		{header: 'Term', width: 160, sortable: false, dataIndex: 'term'}
//				,	{header: 'Data Type', width: 160, sortable: false, dataIndex: 'dataType'}
				,	{header: 'Required', width: 160, sortable: false, dataIndex: 'required'}
				,	{header: 'Static/Variable Mapping', width: 200,	dataIndex: 'static', editor: new Ext.form.TextField() }
			]
		,	stripeRows: true
//		,	title: 'Extension'
		,	tbar: [{
					text: 'Add Spacer'
				,	handler: this.addSpacer
				,	scope: this
			}, "->", "Filename:"
				, this.filename
			]
//    ,	ddGroup: 'testDDGroup'
    ,	enableDragDrop: true
		,	sm: new Ext.grid.RowSelectionModel({singleSelect:true})
    ,	autoScroll: true
		,	clicksToEdit: 1
		,	enableColumnHide: false
		,	enableColumnMove: false
		,	enableHdMenu: false
    ,	listeners: {
        render: function(g) {
					var ddrow = new Ext.ux.dd.GridReorderDropTarget(g, {
							copy: false
							,listeners: {
									beforerowmove: function(objThis, oldIndex, newIndex, records) {
											// code goes here
											// return false to cancel the move
									}
									,afterrowmove: function(objThis, oldIndex, newIndex, records) {
											// code goes here
									}
									,beforerowcopy: function(objThis, oldIndex, newIndex, records) {
											// code goes here
											// return false to cancel the copy
									}
									,afterrowcopy: function(objThis, oldIndex, newIndex, records) {
											// code goes here
									}
							}
					});

					// if you need scrolling, register the grid view's scroller with the scroll manager
					Ext.dd.ScrollManager.register(g.getView().getEditorParent());
        }
			,	beforedestroy: function(g) {
            // if you previously registered with the scroll manager, unregister it (if you don't it will lead to problems in IE)
            Ext.dd.ScrollManager.unregister(g.getView().getEditorParent());
        }
			,	beforeedit: function(e) {
					if (e.record.data.term == "Spacer") {
						return( false );
					}
//						console.log( this, e );					
				}
			,	rowcontextmenu: this.rightClickMenu
    }
	});

	GBIF.MetaMaker.Extension.superclass.constructor.call(this, config);

}	

Ext.extend(GBIF.MetaMaker.Extension, Ext.grid.EditorGridPanel, {

		addSpacer: function() {
			this.store.loadData([["Spacer", "", false]], true );
		}

	,	rightClickMenu: function(grid, row, e){
			grid.getSelectionModel().selectRow(row);
			var record = grid.getSelectionModel().getSelected().data;
			if (record.term != "Spacer") {
				return(false);
			}

			var items = [{
					text: 'Remove Spacer'
				,	scope: this
				,	handler: function(a, b, c) {
						grid.store.remove( grid.getSelectionModel().getSelected() );
					}
			}];
			var menu = new Ext.menu.Menu({
				items: items
			});
			var xy = e.getXY();
			menu.showAt(xy);
		}

});