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
				,	{name: 'global'}
				,	{name: 'rIndex'}
			]
		,	listeners: {
					load: this.reindex
				,	remove: {	
							fn: this.reindex
						,	delay: 50
					}
				,	scope: this
			}
	});

	this.offset = 0;

	this.filename = new Ext.form.TextField({
			width: 250
		,	emptyText: "{your filename here} Ex: myfile.csv"
	});

	Ext.apply(this, config, {
			store: store
		,	columns: [
      		{header: '&nbsp;', width: 25, sortable: false, dataIndex: '', renderer: this.renderReorder}
      	,	{header: '&nbsp;', width: 25, sortable: false, dataIndex: 'rIndex', renderer: this.renderIndex, scope: this, tooltip: 'Related column index based on your file.'}
      	,	{header: 'Term', width: 160, sortable: false, dataIndex: 'term'}
				,	{header: 'Required', width: 60, sortable: false, dataIndex: 'required', renderer: this.renderCheckbox}
				,	{header: 'Default Value', width: 200,	dataIndex: 'static', editor: new Ext.form.TextField(), tooltip: 'Click row cell to add default value.' }
				,	{header: 'Global', width: 44,	dataIndex: 'global', editor: new Ext.form.Checkbox(), tooltip: 'Check row cell to provide default without column index.', renderer: this.renderCheckbox }
			]
		,	stripeRows: true
		,	tbar: [{
					text: 'Add Spacer'
				,	handler: this.addSpacer
				,	iconCls: 'iconSpacer'
				,	scope: this
			}, "->", "Filename:"
				, this.filename
			]
    ,	enableDragDrop: true
		,	sm: new Ext.grid.RowSelectionModel({singleSelect:true})
    ,	autoScroll: true
		,	clicksToEdit: 1
		,	enableColumnHide: false
		,	enableColumnMove: false
		,	enableHdMenu: false
    ,	listeners: {
        render: function(g) {
					if (this.ownerCt.type == "ext") {
						this.store.loadData([["Core ID", "", true]], true );
					} else {
						this.store.loadData([["ID", "", true]], true );
					}
					
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
					}, this);

					// if you need scrolling, register the grid view's scroller with the scroll manager
					Ext.dd.ScrollManager.register(g.getView().getEditorParent());
        }
			,	beforedestroy: function(g) {
            // if you previously registered with the scroll manager, unregister it (if you don't it will lead to problems in IE)
            Ext.dd.ScrollManager.unregister(g.getView().getEditorParent());
        }
			,	beforeedit: function(e) {
					if ((e.record.data.term == "Spacer")
					|| (e.record.data.term == "ID")
					|| (e.record.data.term == "Core ID")) {
						return( false );
					}
				}
			,	afteredit: function(e) {
					e.grid.reindex();
				}
			,	rowcontextmenu: this.rightClickMenu
    }

		,	view: new Ext.grid.GridView({
				getRowClass : function(record, index){
					var cls = '';
					if (record.data.required == "true") {
						cls = 'row-required';
					}
					if ((record.data.term == 'ID')
					|| (record.data.term == 'Core ID')) {
						cls = 'row-required';
					}
					if (record.data.term == 'Spacer') {
						cls = 'row-spacer';
					}
					return cls;
				}
			})
	});

	GBIF.MetaMaker.Extension.superclass.constructor.call(this, config);

}	

Ext.extend(GBIF.MetaMaker.Extension, Ext.grid.EditorGridPanel, {

		addSpacer: function() {
			this.store.loadData([["Spacer", "", false]], true );
		}

	,	renderReorder: function(value) {
			var html = '<img qtip="Click and drag row to reorder." src="resources/images/icons/vert.png">';
			return(html);
		}

	,	renderCheckbox: function(value) {
			return (value == true || value == "true") ? "<img src=\"resources/images/icons/accept.png\">" : "";
		}

	,	renderIndex: function(value, e, record, index) {
//console.log("update view", record.data.rIndex, value, e, record, index );
			if (record.data.rIndex != -1) {			
				return(record.data.rIndex);
			} else {
				return('');
			}
		}

	,	reindex: function() {
//			console.log("reindex", this, this.store, this.store.data, this.store.data.items );
			var i = 0;
			this.offset = 1;
			this.store.data.each(function() {
				if (!this.data.global) {
					this.data.rIndex = i;
					i++;
				} else {
					this.offset++;
					this.data.rIndex = -1;
				}
			});
			
			this.getView().refresh();
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