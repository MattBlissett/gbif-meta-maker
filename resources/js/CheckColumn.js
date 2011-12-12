Ext.ns('Ext.ux.grid');

Ext.ux.grid.GlobalCheckColumn = Ext.extend(Ext.grid.Column, {

    /**
     * @private
     * Process and refire events routed from the GridView's processEvent method.
     */
    processEvent : function(name, e, grid, rowIndex, colIndex){
        if (name == 'dblclick') {
					var record = grid.store.getAt(rowIndex);
					if ((record.data.term == "Spacer")
					|| (record.data.term == "ID")
					|| (record.data.term == "Core ID")) {
						// 
					} else {
						record.set(this.dataIndex, !record.data[this.dataIndex]);
						grid.store.commitChanges();
						grid.reindex();
					}
					return false; // Cancel row selection.
        } else {
					return Ext.grid.ActionColumn.superclass.processEvent.apply(this, arguments);
        }
    },

    renderer : function(v, p, record){
			if ((record.data.term == "Spacer")
			|| (record.data.term == "ID")
			|| (record.data.term == "Core ID")) {
				return('<div>&#160</div>');
			} else {
				p.css += ' x-grid3-check-col-td'; 
				return String.format('<div class="x-grid3-check-col{0}">&#160;</div>', v ? '-on' : '');
			}
    },

    // Deprecate use as a plugin. Remove in 4.0
    init: Ext.emptyFn
});

// register ptype. Deprecate. Remove in 4.0
Ext.preg('globalcheckcolumn', Ext.ux.grid.GlobalCheckColumn);

// backwards compat. Remove in 4.0
Ext.grid.GlobalCheckColumn = Ext.ux.grid.GlobalCheckColumn;

// register Column xtype
Ext.grid.Column.types.globalcheckcolumn = Ext.ux.grid.GlobalCheckColumn;