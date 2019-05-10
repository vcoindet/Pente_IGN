//Instancie la carte et la vue
var mymap = L.map('mapid').setView([45.8898586,6.128757], 13);
//Peremet d'afficher la carte Open Street Map 
var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	transparent:true
}).addTo(mymap);
//Permet d'appeler un flux WMS et afficher la carte des orthophotos du Géoportail de l'IGN 
window.onload= function() {
    L.tileLayer(
            'https://wxs.ign.fr/pratique/geoportail/wms?service=WMS&request=GetTile&version=1.0.0&tilematrixset=PM&tilematrix={z}&tilecol={x}&tilerow={y}&layer=ORTHOIMAGERY.ORTHOPHOTOS&format=image/jpeg&style=normal',
            {
                minZoom : 0,
                maxZoom : 18,
                tileSize : 256,
				attribution : "IGN-F/Géoportail",
				transparent: true
				
            }).addTo(mymap)
    }
// Permet de choisir quels couches de données à afficher
var baseMaps = {
    "Géoportail" : L.tileLayer(
            'https://wxs.ign.fr/pratique/geoportail/wmts?service=WMTS&request=GetTile&version=1.0.0&tilematrixset=PM&tilematrix={z}&tilecol={x}&tilerow={y}&layer=ORTHOIMAGERY.ORTHOPHOTOS&format=image/jpeg&style=normal',
            {
                minZoom : 0,
                maxZoom : 18,
                tileSize : 256,
				attribution : "IGN-F/Géoportail",
				transparent: true
            }).addTo(mymap)
}
//Bouton à cocher qui permet de cocher et décocher les cartes que l'on veut afficher ou non 
var overlayMaps = {
	"OpenStreetMap" : osm
	
}

L.control.layers(baseMaps,overlayMaps).addTo(mymap);
//Système de géocodage de la carte 
var osmGeocoder = new L.Control.OSMGeocoder();
mymap.addControl(osmGeocoder);
//Permet d'afficher l'échelle en bas à gauche de la carte 
L.control.scale().addTo(mymap);
//layer pour les marker
var theMarker = {};
var mousePosition = L.geoportalControl.MousePosition({
	displayCoordinate : false,
	altitude : {
			triggerDelay : 500
	} 
});
mymap.addControl(mousePosition);






