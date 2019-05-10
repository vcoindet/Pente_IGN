# pente_ign
Web service de calcul de pente
#Installation
Accès à notre web service à partir d'une url disponible sur un serveur. Complétez l'url pour accéder aux fonctionnalités présentées ci-dessous : 
#Calcul de pente sur des points 
exemple d'url = "./point?lat=2&lng=48&algo='Horn'&unit='deg'&proj=2154"

lat  -> float			Latitude	Obligatoire

lng -> float			Latitude	Obligatoire

algo -> string			Facultatif	
	Algoritme de calcul utilisé pour calculer la pente et l'oriantationFacultatif
	Au choix : "Horn" ou "Zevenbergen_Thorne"
	Facultatif, 
	Si le paramètre n'est pas inséré, l'algoritme de Zevenbergen and Thorne sera utilisé par défaut
	
unit -> string 			Facultatif,	
	unité de la pente
	"deg" (degré) ou "prc" (pourcentage)
	Si le paramètre n'est pas inséré, l'unité en degré sera utilisé

proj -> int				Facultatif
	code EPSG de la projection des coordonnées géographiques insérées
	4326 = Pseudo Mercator WGS84
	2154 = Lambert 93 
	Si le paramètre n'est pas inséré, la projection WGS84 (4326) sera prise en compte
	
Renvoie un JSON constitué des coordonnées, de la pente, l'orientation et l'altitude
Exemple de JSON : 

{
    "geometry_input": {
        "latitude": 45.9,
        "longitude": 6.1
    },
    "geometry_calculate": {
        "latitude": 45.900006727023886,
        "longitude": 6.099995501098624
    },
    "altitude": 494.7200012207031,
    "properties": {
        "algoritm": "Zevenbergen and Thorne",
        "unit": "deg",
        "projection": "4326"
    },
    "slope": 3.648656795643846,
    "aspect": -65.44462088844926,
    "matrix_calculate": [
        493.9100036621094,
        493.9800109863281,
        494.19000244140625,
        494.4200134277344,
        494.7200012207031,
        494.95001220703125,
        495.1099853515625,
        495.1400146484375,
        495.1300048828125
    ],
    "matrix_calculate_geometry": [
        [
            6.099983119616252,
            45.900016078444864
        ],
        [
            6.099996007318324,
            45.90001572501105
        ],
        [
            6.1000088950202285,
            45.900015371575776
        ],
        [
            6.099982613398653,
            45.90000708045764
        ],
        [
            6.099995501098624,
            45.900006727023886
        ],
        [
            6.100008388798431,
            45.90000637358867
        ],
        [
            6.09998210718122,
            45.8999980824704
        ],
        [
            6.09999499487909,
            45.89999772903669
        ],
        [
            6.100007882576797,
            45.89999737560152
        ]
    ]
}

geometry_input -> point renseigné par l'utilisateur
geometry_calculate -> point de la matrice utilisé pour calculé la pente (le plus proche du point de "geometry_input")
altitude -> altitude du point
algoritm -> algoritm choisi par l'utilisateur
unit -> unité de pente choisie par l'utilisateur
proj -> projection du point renseigné
slope -> pente trouvée
aspect -> orientation trouvée
matrice_calculate -> altitudes des 8 point autour de "geometry_calculate" qui ont servi à calculer la pente
matrix_calculate_geometry -> coordonnées des points de "matrice_calculate"

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
