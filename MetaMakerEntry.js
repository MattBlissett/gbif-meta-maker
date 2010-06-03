Ext.namespace('GBIF');
Ext.onReady(function() {

this.metaMakerNorth=new GBIF.MetaMakerNorth({region: 'north'});
this.metaMakerCenter=new GBIF.MetaMakerCenter({region: 'center'});
this.metaMakerSouth=new GBIF.MetaMakerSouth({region: 'south'});
	
var mainEntry=new Ext.Viewport({
			layout:'border'
        ,	items:[
				this.metaMakerNorth,this.metaMakerCenter,this.metaMakerSouth
        	]
});

	
});


