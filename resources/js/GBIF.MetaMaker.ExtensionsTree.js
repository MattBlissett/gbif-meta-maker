
Ext.namespace('GBIF');
Ext.namespace('GBIF.MetaMaker');

GBIF.MetaMaker.ExtensionsTree = function(config){

	Ext.apply(this, config, {
			root: new Ext.tree.AsyncTreeNode({
					text: 'Root Node'
				,	draggable: false
				,	expanded: true
				,	type: 'root'
				,	children: [{
							text: 'Core'
						,	type: 'root'
						,	expanded: true
						,	iconCls: 'iconBook'
						,	children: [{
									text: 'Specimens'
								,	id: 'specimens'
								,	leaf: false
								,	checked: true
								,	type: 'core'
								,	url: 'http://rs.gbif.org/core/dwc_taxon.xml'
							}, {
									text: 'Occurrences'
								,	id: 'occurrences'
								,	leaf: false
								,	checked: false
								,	type: 'core'
								,	url: 'http://rs.gbif.org/core/dwc_occurrence.xml'
							}]
					}, {
							text: 'Extensions'
						,	type: 'root'
						,	expanded: true
						,	iconCls: 'iconBook'
					}]
			})
		,	useArrows: true
		,	rootVisible: false
		,	autoScroll: true
		,	loader: new Ext.tree.TreeLoader({
					dataUrl: 'resources/api/proxy.php?url=http://gbrds.gbif.org/registry/ipt/extensions.json&type=json'
				,	listeners: {
							beforeload: this.testNodeUri
						,	scope: this
					}
				, processResponse: this.extensionsResponse
			})
	});

	GBIF.MetaMaker.ExtensionsTree.superclass.constructor.call(this, config);
}	

Ext.extend(GBIF.MetaMaker.ExtensionsTree, Ext.tree.TreePanel, {

		testNodeUri: function( loader, node ) {
			switch (node.attributes.type) {
				case 'root':
					break;
				case 'core':
				case 'extension':
					loader.dataUrl = 'resources/api/proxy.php?url=' + node.attributes.url;
					loader.processResponse = this.extensionResponse;
					break;
			}
		}

	,	toggleCore: function(id) {
			var old = "";
			this.suspendEvents();
			if ( id == 'specimens' ) {
				this.getNodeById('occurrences').getUI().toggleCheck();
				old = "occurrences";
			} else {
				this.getNodeById('specimens').getUI().toggleCheck();
				old = "specimens";
			}
			this.resumeEvents();
			return(old);
		}

	,	extensionsResponse: function(response, node, callback){
			var json = response.responseText;
			try {
				var o = eval("(" + json + ")");
				o = o.extensions;
				node.beginUpdate();
				for (var i = 0, len = o.length; i < len; i++) {
					var n = this.createNode(o[i]);
					n.text = o[i].title;
					n.leaf = false;
					n.attributes.type = 'extension';
					n.attributes.checked = false;
					n.iconCls = 'iconText';
					if (n) {
						node.appendChild(n);
					}
				}
				node.endUpdate();
				if (typeof callback == "function") {
					callback(this, node);
				}
			} catch (e) {
				alert('Error', "Load Exception Please Try Again.");
			}
		}

	,	extensionResponse: function(response, node, callback){
			var xml = response.responseXML;
			
			var root = xml.documentElement;
			var q = Ext.DomQuery;
			Ext.each( q.select("property", root), function( record ) {
				node.beginUpdate();
				var n = this.createNode({});
				n.text = record.getAttribute("name");
				n.leaf = true;
				n.attributes.type = 'attribute';
				n.attributes.term = record.getAttribute("name");
				n.attributes.namespace = record.getAttribute("namespace");
				n.attributes.qualName = record.getAttribute("qualName");
				n.attributes.thesaurus = record.getAttribute("thesaurus");
				n.attributes.checked = false;
				n.iconCls = 'iconText';
				if (n) {
					node.appendChild(n);
				}
				node.endUpdate();
				if (typeof callback == "function") {
					callback(this, node);
				}

			}, this);
		}
});