Ext.namespace('GBIF');

GBIF.MetaSources = function(config){

	Ext.apply(this, config, {
			width: 300
        ,	height: 400
		,	layout: 'accordion'
        ,   activeItem: 1
        ,   split: true
        ,   collapsible: true
        ,   collapseMode: 'mini'
        ,	title: 'Meta Sources'
		,	defaults: {
                    border: false
            }
		,	items : [	{
	                        xtype: 'panel',
	                        title: 'Core Data File'
	                    },
	                    {
		                        xtype: 'treepanel'
		                    ,   title: 'Extension List'
							,	split: true
							,	root: new Ext.tree.AsyncTreeNode({
							        text: 'Root Node',
							        draggable:false,
							        id:'source',
							    })
							,	loader: new Ext.tree.TreeLoader({
		                            dataUrl: 'normaltree.json'
								, 	processResponse: function(response, node, callback){
										var json = response.responseText;
										try {
											var o = eval("(" + json + ")");
												o = o.extensions;
												node.beginUpdate();
												for (var i = 0, len = o.length; i < len; i++) {
													var n = this.createNode(o[i]);
													if (n) {
														node.appendChild(n);
													}
												}
												node.endUpdate();
												if (typeof callback == "function") {
													callback(this, node);
												}
										} 
										catch (e) {
											alert('Error', "Load Exception Please Try Again.");
										}
									}
	                        })
						}
					]
	})
	GBIF.MetaSources.superclass.constructor.call(this, config);
}	
Ext.extend(GBIF.MetaSources,Ext.Panel,  {
	
	
});