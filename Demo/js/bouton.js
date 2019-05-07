var checkbox = document.getElementById('checke');
var elem_map = document.getElementById('mapid');
var LayerObject = L.layergoup();

//console.log(elem_map.offsetLeft);
//console.log(elem_map.offsetTop);

console.log(checkbox.checked);
function create_point(){
	mymap.on('click',function Pointe(e){
		var lat = e.latlng.lat;
		var lon = e.latlng.lng;
		//var pour enregister les coords du marker
		let coord;
	
		if (theMarker != undefined) {     
			mymap.removeLayer(theMarker);
		}

		//Add a marker to show where you clicked.
		theMarker = L.marker([lat,lon]).addTo(mymap);  
		coord = theMarker.getLatLng(); 
		theMarker.bindPopup('' + coord).openPopup();
	});
}

function create_ligne(){
	mymap.on('click',function (e){
		var lat = e.latlng.lat;
		var lon = e.latlng.lng;
		//var pour enregister les coords du marker
		let coord;
	
		//Add a marker to show where you clicked.
		theMarker = L.marker([lat,lon]).addTo(mymap);  
		theMarker.bindPopup('' + theMarker.getLatLng()).openPopup();
		coord = theMarker.getLatLng();
		//valeur de marker de type :
		//  marker = {lat : 54, lng : 65}

		//enregistre les coords dans le tableau
		tab_point.push([coord["lat"], coord["lng"]]);

		//console.log(tab_point);

		if(tab_point.length > 2){
			console.log('ligne');
			
			polyline = L.polyline([tab_point, {color: 'green'}]).addTo(LayerObject);
		}
		LayerObject.addTo(mymap)
	});
}

function chose_geom(){
	if(checkbox.checked){
		create_ligne();
	}

	else{
		create_point();
	}
}

function clear (){
	if (theMarker != undefined ) {     
		
		mymap.removeLayer(theMarker);
		
	}
	if (polyline != undefined) {
	  mymap.removeLayer(LayerObject);  
	}
}

elem_map.addEventListener("click", chose_geom);
checkbox.addEventListener("click",clear);
