<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.4.0/dist/leaflet.css"
   integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="
   crossorigin=""/>
   <link rel="stylesheet" href="Control.OSMGeocoder.css" />
   <link rel="stylesheet" href="demo.css">
   <script src="https://unpkg.com/leaflet@1.4.0/dist/leaflet.js"
   integrity="sha512-QVftwZFqvtRNi0ZyCtsznlKSWOStnDORoefr1enyq5mVL4tmKB3S/EnC3rRJcxCPavG10IcrVGSmPh6Qw5lwrg=="
   crossorigin=""></script>
   <script src="GpPluginLeaflet.js"></script>
<link rel="stylesheet" href="GpPluginLeaflet.css" />
<link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet">
   <script data-key="keal590caiyuc4ei9ilrc0qd" src="GpPluginLeaflet.js"></script>
   <script src="Control.OSMGeocoder.js" type="text/javascript"></script>
   
      
    <title>Pent'IGN</title>
</head>
<body>
    <h1><strong>Pent'IGN</strong><h1>
        <div id= 'image'><img src= 'logo.png'></div>
        
   <h2><em>Bienvenue !</em><h2> 

  <div id="mapid">
  <script>
  var mymap = L.map('mapid').setView([48.8455901,2.4230108], 13);
var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
}).addTo(mymap);

window.onload= function() {
 L.tileLayer(
            'https://wxs.ign.fr/keal590caiyuc4ei9ilrc0qd/geoportail/wms?service=WMS&request=GetTile&version=1.0.0&tilematrixset=PM&tilematrix={z}&tilecol={x}&tilerow={y}&layer=ORTHOIMAGERY.ORTHOPHOTOS&format=image/jpeg&style=normal',
            {
                minZoom : 0,
                maxZoom : 18,
                tileSize : 256,
                attribution : "IGN-F/Géoportail"
            }).addTo(mymap)
    }
// Permet de choisir quels couches de données à afficher
var baseMaps = {
"Géoportail" : L.tileLayer(
            'https://wxs.ign.fr/keal590caiyuc4ei9ilrc0qd/geoportail/wmts?service=WMTS&request=GetTile&version=1.0.0&tilematrixset=PM&tilematrix={z}&tilecol={x}&tilerow={y}&layer=ORTHOIMAGERY.ORTHOPHOTOS&format=image/jpeg&style=normal',
            {
                minZoom : 0,
                maxZoom : 18,
                tileSize : 256,
                attribution : "IGN-F/Géoportail"
            }).addTo(mymap)
}
 //Bouton à cocher qui permet de cocher et décocher les cartes que l'on veut afficher ou non 
var overlayMaps = {
    "OpenStreetMap" : osm  }
L.control.layers(baseMaps,overlayMaps).addTo(mymap);
var osmGeocoder = new L.Control.OSMGeocoder();
mymap.addControl(osmGeocoder);

var theMarker = {};




mymap.on('click',function(e){
 var lat = e.latlng.lat;
var lon = e.latlng.lng;



      if (theMarker != undefined) {
            mymap.removeLayer(theMarker);
      };

  //Add a marker to show where you clicked.
   theMarker = L.marker([lat,lon]).addTo(mymap);  
   theMarker.bindPopup('' + theMarker.getLatLng()).openPopup();
});

      if (theMarker != undefined) {
            mymap.removeLayer(theMarker);
      };

  //Add a marker to show where you clicked.
   theMarker = L.marker([lat,lon]).addTo(map);  
 
var url = "www.penteign/point/?coord=" + newMarker.getLatLng();



</script>
</div>
<div id = "footer"> 
    <h5> Projet de développement : Joachim BOCAZ-COEFFE, Hadrien SINEY, Stéphane WILHELM<h5>
<img id = 'ola' src= 'https://www.u-pem.fr/charte-graphique/fileadmin/public/UPEMLV/charte-graphique/download/logos/upem/UPEM_LOGO_SIGNALETIQUE_300DPI.png'>
<img id = 'ola'src='http://www.ensg.eu/-MEP0-/apv/logo_ensg_rwd.png'>
<img id = 'ola' src = 'https://static.data.gouv.fr/avatars/1b/e4985396724faf9f6e1122baa7b65c.gif'>
</body>
</html>