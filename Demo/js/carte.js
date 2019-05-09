var mymap = L.map('mapid').setView([45.8898586,6.128757], 13);
var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	transparent:true
}).addTo(mymap);

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
var osmGeocoder = new L.Control.OSMGeocoder();
mymap.addControl(osmGeocoder);
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






//  mymap.on('click',function Pointe(e){
//   var lat = e.latlng.lat;
//   var lon = e.latlng.lng;
//   //var pour enregister les coords du marker
//    let coord;

// //     //Add a marker to show where you clicked.
//  theMarker = L.marker([lat,lon]).addTo(mymap);  
//      theMarker.bindPopup('' + theMarker.getLatLng()).openPopup();
//      coord = theMarker.getLatLng();
//      });

// mymap.on('click',function Ligne(e){

//     var lat = e.latlng.lat;
//     var lon = e.latlng.lng;
//     //var pour enregister les coords du marker
//     let coord;

//     //Add a marker to show where you clicked.
//     theMarker = L.marker([lat,lon]).addTo(mymap);  
//     theMarker.bindPopup('' + theMarker.getLatLng()).openPopup();
//     coord = theMarker.getLatLng();
//     //valeur de marker de type :
//     //  marker = {lat : 54, lng : 65}

//     //enregistre les coords dans le tableau
//     tab_point.push([coord["lat"], coord["lng"]]);

//     console.log(tab_point);

//     if(tab_point.length > 3){
//         var polyline = L.polyline(tab_point, {color: 'red'}).addTo(mymap);
//     }    
// });


//Add a marker to show where you clicked.
// theMarker = L.marker([lat,lon]).addTo(map);  
// var lnglat = []; 
// for(let i = 0; i < 5; i++){
//     theMarker = L.marker([lat,lon]).addTo(mymap);  
//     theMarker.bindPopup('' + theMarker.getLatLng()).openPopup();
//     lnglat.push
//}


//var url = "www.penteign/point/?coord=" + newMarker.getLatLng()+"&algo=1&unit='deg'&projection=2154";
var polylines = L.layerGroup(polyline,theMarker).addTo(mymap);
