#Service pente_ign
Web service de calcul de pente
IL s'agit d'une API qui renvoie un JSON constitué des coordonnées, de la pente, l'orientation et l'altitude. 
Renvoie également une matrice d'altitudes et de coordonnées des 8 points autour de celui renseigné
Ces 8 points sont ceux utilisés par les algorithmes de calcul de pente

#Exemple d'utilisation
- Webmapping:
Lors d'un clic sur une image de fond de carte: on peut afficher les coordonnées, la pente, l'altitude et l'orientation dans un popup ou directement sur l'interface du site
On peut créer des formulaires qui renplissent automatiquement l'url pour le calcul (choix de l'algoritme, projection...)

#Installation
l'accès à notre web service se fait à partir d'une url disponible sur un serveur. Complétez l'url pour accéder aux fonctionnalités présentées ci-dessous : 

#Calcul de pente sur des points 

#Attributs à renseigner:

lat  -> float			Latitude	Obligatoire

lng -> float			Longitude	Obligatoire

algo -> string			Facultatif	
	Algorithme de calcul utilisé pour calculer la pente et l'orientation Facultatif
	Au choix : "Horn" ou "Zevenbergen_Thorne"
	Facultatif, 
	Si le paramètre n'est pas inséré, l'algorithme de Zevenbergen and Thorne sera utilisé par défaut
	
unit -> string 			Facultatif,	
	unité de la pente
	"deg" (degré) ou "prc" (pourcentage)
	Si le paramètre n'est pas inséré, l'unité en degré sera utilisé

proj -> string				Facultatif
	code EPSG de la projection des coordonnées géographiques insérées
	4326 = Pseudo Mercator WGS84
	2154 = Lambert 93 
	Si le paramètre n'est pas inséré, la projection WGS84 (4326) sera prise en compte
	
Renvoie un JSON constitué des coordonnées voulues en sortie
http://localhost:8080/point?lon=940169.63&lat=6538433.65&proj=2154

JSON renvoyé: 
{
	message: "Calcul de pente d'un point - PentIGN",
	properties: {
		algoritm: "Zevenbergen and Thorne",
		unit: "deg",
		projection: "2154"
	},
	geometry: {
		inner_point: [
			940169.63,
			6538433.65
		],
		calculation_point: [
			940170,
			6538435
		],
		topography: {
			elevation: 473.44000244140625,
			slope: 5.631706858789314,
			aspect: 120.46959059665085
		},
		calculation_matrix: {
			altitudes: [
				473.3900146484375,
				473.3800048828125,
				473.5400085449219,
				473.3500061035156,
				473.44000244140625,
				473.5199890136719,
				473.4800109863281,
				473.4800109863281,
				473.57000732421875
			],
			coordinates: [
				[
					940169,
					6538436
				],
				[
					940170,
					6538436
				],
				[
					940171,
					6538436
				],
				[
					940169,
					6538435
				],
				[
					940170,
					6538435
				],
				[
					940171,
					6538435
				],
				[
					940169,
					6538434
				],
				[
					940170,
					6538434
				],
				[
					940171,
					6538434
				]
			]
		}
	}
}

properties -> propriétés renseignés par l'utilisateur
	algoritm -> algorithme choisi par l'utilisateur (Zevenbergen and Thorne ou Horn),
	unit -> unité de la pente à renvoyer (degré ou pourcentage),
	projection -> projection des points rentré par l'utilisateur
	
geometry -> propriétés géométriques par rapport aux points renseignés
	inner_point -> point renseigné par l'utilisateur dans la projection d'origine [longitude, latitude]
	calculation_point -> point le plus proche du 'inner_point" où l'altitude est définie puis utilisée dans le calcul de pente [longitude, latitude]
	topography -> propriétés topographiques trouvées à partir du point:
		elevation -> altitude extraite du MNT
		slope -> pente calculée affichée selon l'unité choisie (degré ou pourcentage)
		aspect -> orientation sur 360° à partir de l'axe x dans le sens inverse des aiguilles d'une montre
	calculation_matrix -> matrices des 8 points autour du point renseigné par l'utilisateur qui ont permis de calculer la pente
		altitude -> altitude de ces 8 points
		coordonnates -> coordonnées de ces 8 points [longitude,latitude]

#Calcul de pente sur une liste de points (ligne)
A la place des paramètres lat et lon pour renseigner une latitude et une longitude, l'utilisateur doit renseigner l'attribut "geom" avec une liste de points dont:
 - la latitude et la longitude sont séparés par une virgule ","
 - les différents points sont séparés par un pipe "|"
 
Exemple:
geom=6.5044,45.9|6.505,45.9003|6.5059,45.8998

qui contient la liste de points:
1: lon = 6.5004,45 ; lat = 45.9
2: lon = 6.505 ; lat = 45.9003
3: lon = 6.5059 ; lat = 45.8998

ce qui donne une url ressemblant à:
http://localhost:8080/polyligne?geom=6.5044,45.9|6.505,45.9003|6.5059,45.8998

le principe et le JSON renvoyé est en principe le même que pour le point, deux listes de points sont affichées:
	 - les points renseignés par l'utilisateur des extrémités des lignes
	 - les points calculés automatiquement à l'intérieur des lignes par interpolation


L'attribut  "inner_point" et "calculate_point" renvoient une liste de points
Les attributs "calculation_matrix" renvoient les attributs des matrices pour chaque point de la liste

Le JSON renvoyé fait un nombre conséquent de lignes pour renseigner les attributs de chaque point
il ressemble à celui du point mais avec les géométries contituées en deux fois:

line_points -> les points de toute la polyligne obtenus automatiquement par interpolation
edge_points -> les points des extrémités des lignes de la polyligne (ceux renseignés par l'utilisateur)
			ce dernier permet de connaître la pente sur chaque point renseigné dans la liste

On ajoute un nouveau paramètre des propriétés dans l'url:

precis -> integer	Facultatif
					Précision qui indique le nombre maximum de points à calculer à l'intérieur de chaque ligne de la polyligne
					La valeur ne doit pas dépasser 40 pour des raisons de mémoire
					Par défaut, si le paramètre n'est pas renseigné dans l'url, la valeur sera 10
			
Nous avons également des attributs en plus par rapport au point:
	-	line_length -> longueur de la polyligne en mètre
	-	number_of_line -> nombre de lignes qui constituent la polyligne
	-	dans line_points et line_edge:
		-	number of points : nombre de points où la pente est calculée

dans la partie du paramètre "topography" nous obtenons la liste des altitudes, des pentes et des orientations attribués à chaque point à calculer
la position d'un élément de chaque liste correspond à la position du point, par exemple, la première pente de la liste "pente" (pente[0]) correspond à celui du premier point de "calculation_point" (calculation_point[0])



