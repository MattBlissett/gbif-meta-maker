Ext.namespace('GBIF');

Ext.onReady(function() {

	// Disable browser right click
	Ext.fly(document.body).on('contextmenu', function(e, target) {
		e.preventDefault();
	});	
			
	Ext.QuickTips.init();

	Ext.getUrlParam = function(param) {
		var params = Ext.urlDecode(location.search.substring(1));
		return param ? params[param] : params;	
	}; 

	this.header = {
			height: 95
		,	cls: 'glossary-header'		
		,	region: 'north'
		,	xtype: 'box'
		,	border: false
		,	margins: '0 0 5 0'					
		,	html: '<div class="header">'+
				 '<a href="http://www.gbif.org/" target="_blank" class="gbif">'+
					 '<img src="resources/images/gbif.jpg" alt="GBif" width="104" height="90" border="0" /></a>'+
				 '<div class="header-text">'+
					 '<h1>MetaMaker v1.0</h1>'+
					 '<p><i>GBIF metafile creation and validation tool</i></p>'+
				 '</div></div>'
	}
			
	this.center = new GBIF.MetaMaker.Center({
			region: 'center'
	});

	this.details = new GBIF.MetaMaker.Details({
			region: 'south'
	});
		
	var mainEntry=new Ext.Viewport({
			layout: 'border'
		,	items:[
					this.header
				,	this.center
//				,	this.details
			]
	});

	Ext.get('loading').remove();
	Ext.get('loading-mask').fadeOut({remove:true});

});