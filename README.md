# pente_ign
Web service de calcul de pente
#Installation
Accès à notre web service à partir d'une url disponible sur un serveur. Complétez l'url pour accéder aux fonctionnalités présentées ci-dessous : 
#Calcul de pente sur des points 
exemple d'url = "./point?lat=2&lng=48&algo='Horn'&unit='deg'&proj=2154"

paramètre	|	type	|	description			|	obligatoire ou facultatif	|
#################################################################################
lat			|	float	|	latitude en mètre	|	obligatoire					|
lon			|	float	|	longitude en mètre	|	obligatoire
algo		|	string	|	algoritme de calcul de pente et d'orientation

lat  -> float			Obligatoire

lng -> float			Obligatoire

algo -> string			
						Algoritme de calcul utilisé pour calculer la pente et l'oriantationFacultatif
						Facultatif, par défault Zevenbergen and Thorne
	"Horn" ou "Zevenbergen_Thorne"
	
unit -> string 			Facultatif, par défault "deg" 
	"deg" (degré) ou "prc" (pourcentage)

proj -> int 
	4326 = code EPSG de la projection Pseudo Mercator WGS84
	2154 = code EPSG de la projection Lambert 93 


Renvoie un JSON constitué des coordonnées, de la pente, l'orientation et l'altitude
Exemple de JSON : 
{
"lat_utilisateur": 2,
"lng_utilisateur": 48,
"lat_calcul" : 2,
"lng_calcul" : 49,
"pente": 30,
"alti": 500,
"orientation": "nord"
}

#Calcul de pente sur une liste de points (ligne) 
exemple d'url = ./polyligne?geom={"coord":[[2,48],[3,47],[4,48]]}&nbpoint=30&algo='Horn'&unit='deg'&proj=2154

geom -> float			Obligatoire
	Coordonnées des points de la liste


nbpoint -> int 			Obligatoire
	   Nombre de point 

algo -> string			Facultatif, par défault Zevenbergen and Thorne
	"Horn" ou "Zevenbergen_Thorne"
	
unit -> string 			Facultatif, par défault "deg" 
	"deg" (degré) ou "prc" (pourcentage)

proj -> int			Obligatoire
	3857 = code EPSG de la projection Pseudo Mercator WGS84
	2154 = code EPSG de la projection Lambert 93 

Renvoie un JSON de liste
Exemple de JSON:
{
"Point1":{
"lat":2,
"lng":48
"altitude":400
"orientation":30
}
"Point2":{
"lat":3,
"lng":47,
"altitude":400,
"orientation":30
}
"Point3":{
"lat":4,
"lng":48,
"altitude":400,
"orientation":30
}
}
