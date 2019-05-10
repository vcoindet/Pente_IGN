var checkbox = document.getElementById('checke');
var radio = document.getElementById('pointe');
var elem_map = document.getElementById('mapid');
var effacer = document.getElementById('erase');
var algor1 = document.getElementById('alg1');
var algor2 = document.getElementById('alg2');
var unite1 = document.getElementById('uni1');
var unite2 = document.getElementById('uni2');
var projection1 = document.getElementById('prj1');
var projection2 = document.getElementById('prj2');



var polyline = new L.Polyline([]).addTo(mymap);
//console.log(elem_map.offsetLeft);
//console.log(elem_map.offsetTop);    

var theMarker ={};
/**
  * @function
  * @name create_point
  * @description Créé un marqueur à chaque click sur la carte et 
	* renvoie sous forme de Popup la latitude et la longitude
	* @param  e - 
  */
function create_point(){
	mymap.on('click',function (e){
		var lat = e.latlng.lat;
		var lon = e.latlng.lng;
		//var pour enregister les coords du marker
		let coord;
		let donnee;
		let pente;
		//Efface un marqueur lorsque celui existe déjà
		if (theMarker != undefined) {     
			mymap.removeLayer(theMarker);
		}

		//Ajoute un marqueur à chaque click
		theMarker = L.marker([lat,lon]).addTo(mymap);  
		
		coord = theMarker.getLatLng();

		//Appelle le web service 
		donnee = web_service(coord["lat"], coord["lng"]);
		console.log(donnee);		
		theMarker.bindPopup('' + coord + "<br>" + "pente = ").openPopup();
	});
}
/**
  * @function
  * @name create_ligne
  * @description Créé des lignes entre plusieurs marqueurs et renvoie
	*  pour chaque marqueur sous forme de Popup la latitude et la longitude
	* @param  e - Event de leaflet
  */
function create_ligne(){
	mymap.on('click',function (e){
		var lat = e.latlng.lat;
		var lon = e.latlng.lng;

		if (theMarker != undefined) {     
			mymap.removeLayer(theMarker);
		}

		//Ajoute un marqueur à chaque click
		theMarker = L.marker([lat,lon]).addTo(mymap);  
		theMarker.bindPopup('' + theMarker.getLatLng()).openPopup();
		polyline.addLatLng(e.latlng);
	});
}
/**
  * @function
  * @name chose_geom
  * @description Choisit quelle fonction doit être utiliser 
	* en fonction du bouton coché 
  */
function chose_geom(){
	if(checkbox.checked){
		create_ligne();
	}

	if(radio.checked){
		create_point();
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

elem_map.addEventListener("click", chose_geom);
effacer.addEventListener("click",clear);
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
		@return {string} -JSON du calcul de pente 
  */
function web_service(lat, lng){
	let data = "lat=" + lat + "&lon=" + lng + "&algo="+algo()+"&unit="+uni()+"&proj="+project();
	let ajax = new XMLHttpRequest();
	ajax.open('GET','http://localhost:8080/point');
	ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	ajax.responseType = "json";
	ajax.send(data);
	console.log(data);
	console.log(ajax.response);
	
	return ajax.response;
}		

