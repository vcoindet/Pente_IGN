//Instancie la carte et la vue
var mymap = L.map('mapid').setView([45.8898586,6.128757], 13);
var checkbox = document.getElementById('checke');
var radio = document.getElementById('pointe');
var elem_map = document.getElementById('mapid');
var effacer = document.getElementById('erase');
var polyline = new L.Polyline([]).addTo(mymap);   
var theMarker = {};
//Permet d'appeler un flux WMS et afficher la carte des orthophotos du Géoportail de l'IGN 
window.onload= function() {

    

    //Permet d'afficher la carte Open Street Map 
    var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        transparent:true
    }).addTo(mymap);

    L.tileLayer(
            'https://wxs.ign.fr/keal590caiyuc4ei9ilrc0qd/geoportail/wms?service=WMS&request=GetTile&version=1.0.0&tilematrixset=PM&tilematrix={z}&tilecol={x}&tilerow={y}&layer=ORTHOIMAGERY.ORTHOPHOTOS&format=image/jpeg&style=normal',
            {
                minZoom : 0,
                maxZoom : 18,
                tileSize : 256,
				attribution : "IGN-F/Géoportail",
				transparent: true
				
            }).addTo(mymap);


    // Permet de choisir quels couches de données à afficher
    var baseMaps = {
        "Géoportail" : L.tileLayer(
                'https://wxs.ign.fr/keal590caiyuc4ei9ilrc0qd/geoportail/wmts?service=WMTS&request=GetTile&version=1.0.0&tilematrixset=PM&tilematrix={z}&tilecol={x}&tilerow={y}&layer=ORTHOIMAGERY.ORTHOPHOTOS&format=image/jpeg&style=normal',
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
    
    var mousePosition = L.geoportalControl.MousePosition({
        displayCoordinate : false,
        altitude : {
                triggerDelay : 500
        } 
    });
		mymap.addControl(mousePosition);
		
		var ep = L.geoportalControl.ElevationPath({
		});
		mymap.addControl(ep);
    mymap.on('click',function (e){
        chose_geom(e);
    });
    effacer.addEventListener("click",clear);

}

/**
  * @function
  * @name create_point
  * @description Créé un marqueur à chaque click sur la carte et 
	* renvoie sous forme de Popup la latitude et la longitude
	* @param  e - 
  */
 function create_point(e){

		var lat = e.latlng.lat;
		var lon = e.latlng.lng;
		//var pour enregister les coords du marker
		let coord;

		//Efface un marqueur lorsque celui existe déjà
		if (theMarker != undefined) {     
			mymap.removeLayer(theMarker);
		}

		//Ajoute un marqueur à chaque click
		theMarker = L.marker([lat,lon]).addTo(mymap);  
		
		coord = theMarker.getLatLng();

		//Appelle le web service 

		web_service(theMarker, coord, coord["lat"], coord["lng"]);
		
}
/**
  * @function
  * @name create_ligne
  * @description Créé des lignes entre plusieurs marqueurs et renvoie
	*  pour chaque marqueur sous forme de Popup la latitude et la longitude
	* @param  e - Event de leaflet
  */
function create_ligne(e){
	
		var lat = e.latlng.lat;
		var lon = e.latlng.lng;

		if (theMarker != undefined) {     
			mymap.removeLayer(theMarker);
		}

		//Ajoute un marqueur à chaque click
		theMarker = L.marker([lat,lon]).addTo(mymap);  
		theMarker.bindPopup('' + theMarker.getLatLng()).openPopup();
		polyline.addLatLng(e.latlng);

}
/**
  * @function
  * @name chose_geom
  * @description Choisit quelle fonction doit être utiliser 
	* en fonction du bouton coché 
  */
function chose_geom(e){
	if(checkbox.checked){
		create_ligne(e);
	}

	if(radio.checked){
		create_point(e);
	}
}
/**
  * @function
  * @name clear
  * @description A chaque click du bouton submit 'Supprimer élément de la 
	* carte', supprime les lignes et les marqueurs présents sur la carte
  */
function clear (){
	mymap.removeLayer(theMarker);
	polyline.setLatLngs([]); 
}


/**
  * @function
  * @name algo
  * @description Récupère la valeur du bouton radio coché 
	* pour le choix de l'algorithme de calcul de pente
  * @return {string} algs - renvoie la valeur en fonction du bouton coché 
  */
function algo(){
	let algs;
	if (document.getElementById('alg1').checked) {
		algs = document.getElementById('alg1').value;
    }

	else {
		algs = document.getElementById('alg2').value;
	}
	return algs;
}
/**
  * @function
  * @name uni
  * @description Récupère la valeur du bouton radio coché
	*  pour le choix de l'unité voulu du calcul de pente
		@return {string} united- renvoie la valeur en fonction du bouton coché 
  */
function uni(){
	let united;
	if (document.getElementById('uni1').checked) {
		united = document.getElementById('uni1').value;
	}
 
	else{
		united = document.getElementById('uni2').value;
	}
	return united
}
/**
  * @function
  * @name project
  * @description Récupère la valeur du bouton radio coché
	*  pour le choix de la projection 
	@return {string} proj - renvoie la valeur en fonction du bouton coché 

  */
function project(){
	let proj;
	if (document.getElementById('prj1').checked) {
		proj = document.getElementById('prj1').value;
    }
  
 	else{
		proj = document.getElementById('prj2').value;
	}
	
	return proj;
}
/**
  * @function
  * @name web_service
  * @description Appelle le service web de calcul de pente Pent'IGN pour un point 
	* et renvoie sous forme de JSON le calcul de pente 
		@param  lat - latitude du point de la	carte
		@param  lng - longitude du point de la carte
		@param  theMarker - marqueur de la carte qui apparait à chaque click 
		@param  coord - Coordonnées du point 
		@return {string} -JSON du calcul de pente 
  */
function web_service(theMarker, coord, lat, lng){
	let res;
	let data = "lat=" + lat + "&lon=" + lng + '&algo='+algo() + '&unit='+ uni() + '&proj=' + project();
	let ajax = new XMLHttpRequest();
	ajax.open('GET','http://localhost:8080/point?' + data);
	ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	ajax.responseType = "json";

	ajax.addEventListener('load',  function () {
		console.log(ajax.response);
		res = ajax.response;
		//console.log(res["geometry"]["topography"]["elevation"]);
		let elev = res["geometry"]["topography"]["elevation"].toFixed(2).toString();
		let lati = res["geometry"]["inner_point"]["1"].toString();
		let longi = res["geometry"]["inner_point"]["0"].toString();
		theMarker.bindPopup("<p id ='windows_mark'>" +'Latitude = '+ lati + '</p>' + "<p id ='windows_mark'>" +'Longitude = '+ longi + '</p>'+"<p id='altitude'>"+'Altitude = '+ elev + "</p>"+"<p id='pente'>" + "Pente = " + res["geometry"]["topography"]["slope"].toFixed(2).toString() + "</p>"+"<p id='orientation'>" + "Orientation = " + res["geometry"]["topography"]["aspect"].toFixed(2).toString() + "</p>").openPopup();

		return res;
	});

	ajax.send();
	//console.log(data);
	//console.log(ajax.response);
	
	//return ajax.response;
}		





