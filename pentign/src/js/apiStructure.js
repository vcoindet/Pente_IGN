
const express = require('express');
const cors = require('cors'); //util pour les autorisation
const nconf = require('nconf');

// const penteModule = require('./penteModule/penteModule.js');
const algoZAT = require('./penteModule/algoZAT.js');
const algoHorn = require('./penteModule/algoHorn.js');
// var mnt_simul = require('./mnt_simul.js');
var search_coord = require('./search_coord.js');
var fileRead = require('./fileread.js');
var apiProperties = require('./utils/apiProperties.js');
var WGS84_to_L93 = require('./utils/WGS84_to_L93.js');
var L93_to_WGS84 = require('./utils/L93_to_WGS84');
var interpolation = require('./utils/interpolation.js');


//chemin du mnt
const chemin_mnt = nconf.get("chemin_mnt");



module.exports = {

    /**
     * 
     * @function
     * @name launch
     * @description lance le module express pour générer notre api 
     * avec les paramètres à enregistrer dans une url
     * 
     */

    launch : function(){

        const app = express();// instanciation de l'application express
        app.use(cors());

        //chemin du mnt
        const chemin_mnt = nconf.get("chemin_mnt");

        //choix du port
        const port = nconf.get("port");

        app.get('/',function(req,res){
            res.json({
                message : "Bienvenue dans l'application PentIGN, Complêtez l'url pour accéder aux fonctionnalités (lire README pour lire les instructions",
                method : req.method
            });
        });

        // ################################ POLYLIGNE #####################################

        app.get("/polyligne",async function (req,res){

            //l'insersion de coordonnées est obligatoire
            if(req.query.geom == undefined ){
                res.send("erreur: insérer des coordonnées valides de latitude et longitude (exemple : geom=6.5044,45.9|6.505,45.9003)");
            }

            //la polyligne doit comporter au moins deux points
            if(req.query.geom.length <= 1){
                res.send("erreur: rentrer au moins 2 points");
            }

            //on récupère la liste de points renseignés par l'utilisateur
            let line_edge_list = req.query.geom.split('|');
            for(let i = 0 ; i < line_edge_list.length ; i++){
                line_edge_list[i] = line_edge_list[i].split(',');
                line_edge_list[i][0] = parseFloat(line_edge_list[i][0]);
                line_edge_list[i][1] = parseFloat(line_edge_list[i][1]);
            }

            //valeurs numériques obligatoires pour chaque coordonnée de la liste de point
            for (let i = 0; i < line_edge_list.length; i++) {
                for (let j = 0; j < line_edge_list[i].length; j++) {
                    if(isNaN(line_edge_list[i][j])){
                        res.send("erreur, les coordonnées doivent être de forme numérique");
                    }
                }
            }

            // propriétés
            let unite = apiProperties.valProperties(req.query.unit,'prc','deg');
            let algo = apiProperties.valProperties(req.query.algo,'Horn','Zevenbergen and Thorne');    
            let proj = apiProperties.valProperties(req.query.proj,'2154','4326');

            // projection originale gardée en copie si changement de projection
            let line_edge_list_origin_coord = line_edge_list.slice();

            // projection des points insérés en entrée
            if(proj == "4326"){
                for(let i = 0 ; i < line_edge_list.length ; i++){
                    line_edge_list[i] = WGS84_to_L93.transform(line_edge_list[i][0],line_edge_list[i][1]);
                }
            } else{

            }

            // longueur en unité de mesure de la liste de points
            let line_length = apiProperties.lineLength(line_edge_list);

            //nouvelle liste de points créant de nouveaux points à l'intérieur de la ligne où calculer la pente
            let ligne_interpol = [];
            let calcul_point_list = [];

            //calcul des coordonnées des points à l'interieur des lignes par interpolation
            for(let i = 0 ; i < line_edge_list.length - 1 ; i++){
                ligne_interpol.push(interpolation.liste_point(line_edge_list[i][0],line_edge_list[i][1],line_edge_list[i+1][0],line_edge_list[i+1][1],6));
            }

            //on extrait les résultats : on transforme les listes de liste de point en une liste de points simple
            for(let i = 0 ; i < ligne_interpol.length ; i++){
                for (let j = 0; j < ligne_interpol[i].length; j++) {
                    calcul_point_list.push(ligne_interpol[i][j]);
                }
            }
            
            // points des extrémités
            // nombre de points
            let line_edge_list_length = line_edge_list.length;

            //initialisation de la liste des altitudes
            let line_edge_list_alti = [];

            //initialisation de la liste des pentes
            let line_edge_list_slope = [];

            //initialisation de la liste des orientations
            let line_edge_list_aspect = [];

            //points ou le calcul des pente a été effectué (les points dont l'alti est connu le plus proche du point renseigné)
            let line_edge_list_z_points = [];

            //matrices de calcul avec alti
            let line_edge_list_matrix_alti = [];

            //matrice de calcul avec coordonnées
            let line_edge_list_matrix_coord = [];

            //point de la ligne
            //nombre de points
            let calcul_point_list_length = calcul_point_list.length

            //initialisation de la liste des altitudes
            let calcul_point_list_alti = [];

            //initialisation de la liste des pentes
            let calcul_point_list_slope = [];

            //initialisation de la liste des orientations
            let calcul_point_list_aspect = [];

            //points ou le calcul des pente a été effectué (les points dont l'alti est connu le plus proche du point renseigné)
            let calcul_point_list_z_points = [];

            //matrices de calcul avec alti
            let calcul_point_list_matrix_alti = [];

            //matrice de calcul avec coordonnées
            let calcul_point_list_matrix_coord = [];

            try {
                // récupère la dalle à partir des coordonnées insérées dans l'url
                console.log(line_edge_list);

                //points des extrtémités 
                for(let i = 0 ; i < line_edge_list.length ; i++){
                    //on récupère les coordonnée
                    let i_lon = line_edge_list[i][0];
                    let i_lat =  line_edge_list[i][1];

                    //on indique quelle dalle utilisée à partir des coordonnées ainsi que le répertoire de rangement
                    let filePath = search_coord.coordToindice(i_lon, i_lat, "8", "tif");
                    console.log(chemin_mnt);
                    
                    filePath = chemin_mnt + filePath;

                    //numero de la tuile ou récupérer la valeur de pente est récupéré
                    let numTuile = search_coord.numTuile(i_lon, i_lat);
                    //lecture de la tuile et récupération du buffer contenant les valeurs alti
                    let buffer = await fileRead.readTile(filePath,numTuile);
                    //matrice des indice des points de la ligne
                    let matrixIndice = apiProperties.coordToPointMatrix(i_lon, i_lat);
                    //matrice des alti des points de la ligne
                    let matrixAlti = apiProperties.indiceToAlti(matrixIndice,buffer);
                    
                    //récupération des valeurs de la matrice
                    line_edge_list_matrix_alti.push(matrixAlti);
                    //altitude des points
                    line_edge_list_alti.push(matrixAlti[4]);

                    //coordonnées ou l'altitude est calculée (point dont l'altitude est connue le plus proche du point renseigné par l'utilisateur)
                    let calculate_geometry = search_coord.indiceCoord(i_lon,i_lat)['coord_point'];

                    //création de la matrice de coordonnées où la pente a été calculée
                    let calculate_geometry_matrix = apiProperties.coordinateMatrix(i_lon,i_lat);                    

                    //reconversion des coordonnées en WGS83 pour l'affichage
                    if(proj == "4326"){
                        calculate_geometry = L93_to_WGS84.transform(calculate_geometry[0],calculate_geometry[1]);
                        for(let j = 0 ; j < calculate_geometry_matrix.length ; j++){
                            let lon = calculate_geometry_matrix[j][0];
                            let lat = calculate_geometry_matrix[j][1];
                            calculate_geometry_matrix[j] = L93_to_WGS84.transform(lon,lat);
                        }

                    } else{
                    }

                    //insersion des résultats dans le json
                    line_edge_list_z_points.push(calculate_geometry);
                    line_edge_list_matrix_coord.push(calculate_geometry_matrix);


                    //algoritmes de pente
                    if (algo == 'Zevenbergen and Thorne') {
                        line_edge_list_slope.push(algoZAT.compute(matrixAlti,1)['slope']);
                        line_edge_list_aspect.push(algoZAT.compute(matrixAlti,1)['aspect']);
                    }
                    else if (algo == 'Horn'){
                        line_edge_list_slope.push(algoHorn.compute(matrixAlti,1)['slope']);
                        line_edge_list_aspect.push(algoHorn.compute(matrixAlti,1)['aspect']);
                    }

                    // conversion degré pourcent
                    if(unite == 'prc'){
                        line_edge_list_slope[i] = line_edge_list_slope[i] * 100 / 45;
                    }
                }

                //points de la ligne
                for(let i = 0 ; i < calcul_point_list.length ; i++){
                    let i_lon = calcul_point_list[i][0];
                    let i_lat =  calcul_point_list[i][1];

                    //on indique quelle dalle utilisée à partir des coordonnées ainsi que le répertoire de rangement
                    let filePath = search_coord.coordToindice(i_lon, i_lat, "8", "tif");
                    filePath = chemin_mnt + filePath;
                    // numero de la tuile ou récupérer la valeur de pente
                    let numTuile = search_coord.numTuile(i_lon, i_lat);


                    //lecture de la tuile et récupération du buffer contenant les valeurs alti
                    let buffer = await fileRead.readTile(filePath,numTuile);
                    //matrice des indice des points de la ligne
                    let matrixIndice = apiProperties.coordToPointMatrix(i_lon, i_lat);
                    //matrice des alti des points de la ligne
                    let matrixAlti = apiProperties.indiceToAlti(matrixIndice,buffer);

                    //récupération des valeurs de la matrice
                    calcul_point_list_matrix_alti.push(matrixAlti);
                    //altitude des points
                    calcul_point_list_alti.push(matrixAlti[4]);
                    
                    //coordonnées ou l'altitude est calculée (point dont l'altitude est connue le plus proche du point renseigné par l'utilisateur)
                    let calculate_geometry = search_coord.indiceCoord(i_lon,i_lat)['coord_point'];
                    //création de la matrice de coordonnées où la pente a été calculée
                    let calculate_geometry_matrix = apiProperties.coordinateMatrix(i_lon,i_lat);

                    //reconversion des coordonnées en WGS83 pour l'affichage
                    if(proj == "4326"){
                        calculate_geometry = L93_to_WGS84.transform(calculate_geometry[0],calculate_geometry[1]);
                        for(let j = 0 ; j < calculate_geometry_matrix.length ; j++){
                            let lon = calculate_geometry_matrix[j][0];
                            let lat = calculate_geometry_matrix[j][1];
                            calculate_geometry_matrix[j] = L93_to_WGS84.transform(lon,lat);
                        }
                    } else{
                    }

                    //insersion des résultats dans le json
                    calcul_point_list_z_points.push(calculate_geometry);
                    calcul_point_list_matrix_coord.push(calculate_geometry_matrix);

                    //algoritmes de pente
                    if (algo == 'Zevenbergen and Thorne') {
                        calcul_point_list_slope.push(algoZAT.compute(matrixAlti,1)['slope']);
                        calcul_point_list_aspect.push(algoZAT.compute(matrixAlti,1)['aspect']);
                    }
                    else if (algo == 'Horn'){
                        calcul_point_list_slope.push(algoHorn.compute(matrixAlti,1)['slope']);
                        calcul_point_list_aspect.push(algoHorn.compute(matrixAlti,1)['aspect']);
                    }

                    // conversion degré pourcent
                    if(unite == 'prc'){
                        calcul_point_list_slope[i] = calcul_point_list_slope[i] * 100 / 45;
                    }

                }

                //retour des coordonnées des points dans la ligne aux coordonnées d'origine
                let calcul_point_list_origin_coord = calcul_point_list.slice();
                if(proj == "4326"){
                    for(let j = 0 ; j < calcul_point_list_origin_coord.length ; j++){
                        let lon = calcul_point_list_origin_coord[j][0];
                        let lat = calcul_point_list_origin_coord[j][1];
                        calcul_point_list_origin_coord[j] = L93_to_WGS84.transform(lon,lat);
                    }
                } else{
                }
                
                res.json({
                    message : "Calcul des pentes sur une polyligne - PentIGN",
                    "properties":{
                        "algoritm" : algo,
                        "unit" : unite,
                        "projection" : proj
                    },

                    method:req.method,
                    // attributs géométriques
                    "geometry":{
                        "line_length":line_length, // longueur de la polyligne en unité de mesure métrique
                        "number_of_line":line_edge_list_length - 1, // nombre de lignes
                        // travail sur les points des lignes
                        "line_points":{ //points de l'intérieur de la ligne
                            "number_of_point":calcul_point_list_length,
                            "inner_points":calcul_point_list_origin_coord,
                            "calculation_points":calcul_point_list_z_points, //points extraits de la ligne,
                            "topography":{ // informations topographique des points
                                "elevation":calcul_point_list_alti, // altitude des points
                                "slope":calcul_point_list_slope, //pente calculée des points
                                "aspect":calcul_point_list_aspect //orientation calculée des points
                            },
                            "calculation matrix":{
                                "elevation":calcul_point_list_matrix_alti, //matrice des altitudes qui ont permis de calculer la pente
                                "coordinates":calcul_point_list_matrix_coord //coordonnées des points de la matrice des altitudes qui ont permis de calculer la pente
                            }
                        },
                        
                        // travail sur les points des extrémités
                        "edge_points":{ //points des extrémités
                            "number_of_point":line_edge_list_length,
                            "inner_points":line_edge_list_origin_coord, //points rentrés par l'utilisateur
                            "calculation_points":line_edge_list_z_points, // points dont la pente est calculée
                            "topography":{ // informations topographique des points
                                "altitude":line_edge_list_alti, // altitude des points
                                "slope":line_edge_list_slope, //pente calculée des points
                                "aspect":line_edge_list_aspect //orientation calculée des points
                            },
                            "calculation matrix":{
                                "elevations":line_edge_list_matrix_alti,
                                "coordinates":line_edge_list_matrix_coord
                            }
                        }
                    }
                });
                
                
            } catch (error) {
                console.log(error); // renvoie un message d'erreur
                res.send(error);
            }
          
        });




        // ################################ POINT ############################################

        app.get('/point',async function(req,res){

            //l'insersion de coordonnées est obligatoire
            if(req.query.lon == undefined || req.query.lat == undefined){
                res.send("erreur: insérer des coordonnées valides de latitude et longitude (exemple : geom=6.5044,45.9|6.505,45.9003)");
            }

            //les coordonnées doivent être en valeur numérique
            if(isNaN(req.query.lon) || isNaN(req.query.lat)){
                res.send("erreur: insérer des valeurs numériques comme coordonnées");
            }
            
            //query
            let U_Longitude = parseFloat(req.query.lon);
            let U_Latitude = parseFloat(req.query.lat);

            //propriétés rentrés par l'utilisateur
            let unite = apiProperties.valProperties(req.query.unit,'prc','deg');
            let algo = apiProperties.valProperties(req.query.algo,'Horn','Zevenbergen and Thorne');
            let proj = apiProperties.valProperties(req.query.proj,'2154','4326');   

            //conversion des coordonnées dans la bonne projection
            let coord_l93 = new Array();
            if(proj == "4326"){
                coord_l93 = WGS84_to_L93.transform(U_Longitude,U_Latitude);
                inLongitude = coord_l93[0];
                inLatitude = coord_l93[1];
            } else {
                inLongitude = U_Longitude;
                inLatitude = U_Latitude;
            }

            //initialisation des valeurs de pente et d'orientation
            let slope = 0;
            let aspect = 0;

            try {
                // récupère la dalle à partir des coordonnées insérées dans l'url
                let filePath = search_coord.coordToindice(inLongitude, inLatitude, "8", "tif");
                filePath = chemin_mnt + filePath;

                // numero de la tuile ou récupérer la valeur de pente
                let numTuile = search_coord.numTuile(inLongitude,inLatitude);         
                
                // TEST DE LA FONCTION READTILE
                const buffer = await fileRead.readTile(filePath,numTuile);
                let matrixIndice = apiProperties.coordToPointMatrix(inLongitude, inLatitude);
                let matrixAlti = apiProperties.indiceToAlti(matrixIndice,buffer);

                //coordonnées ou l'altitude est calculée (point le plus proche du point renseigné)
                let calculate_geometry = search_coord.indiceCoord(inLongitude,inLatitude)['coord_point'];

                console.log(calculate_geometry);

                //création de la matrice de coordonnées où la pente a été calculée
                let calculate_geometry_matrix = apiProperties.coordinateMatrix(inLongitude,inLatitude);
                
                //reconversion des coordonnées en WGS83
                if(proj == "4326"){
                    calculate_geometry = L93_to_WGS84.transform(calculate_geometry[0],calculate_geometry[1]);

                    for(let i = 0 ; i < calculate_geometry_matrix.length ; i++){
                        let lon = calculate_geometry_matrix[i][0];
                        let lat = calculate_geometry_matrix[i][1];
                        calculate_geometry_matrix[i] = L93_to_WGS84.transform(lon,lat);
                    }
                    
                } else{
                }
                
                //algoritmes de pente
            if (algo == 'Zevenbergen and Thorne') {
                slope = algoZAT.compute(matrixAlti,1)['slope'];
                aspect = algoZAT.compute(matrixAlti,1)['aspect'];
            }
            else if (algo == 'Horn'){
                slope = algoHorn.compute(matrixAlti,1)['slope'];
                aspect = algoHorn.compute(matrixAlti,1)['aspect'];
            }

            // conversion degré pourcent
            if(unite == 'prc'){
                slope = slope * 100 / 45;
            }

            res.json({
                //coordonnée du point choisi
                "message":"Calcul de pente d'un point - PentIGN",
                "properties":{
                    "algoritm" : algo, //algoritme choisi par l'utilisateur (Zevenbergen and Thorne ou Horn),
                    "unit" : unite, //unité de la pente a renvoyer (degré ou pourcentage),
                    "projection" : proj //projection des points rentrés par l'utilisateur
                },

                "geometry":{  //propriétés géométriques par rapport au points renseigné
                    "inner_point":[ //point renseigné par l'utilisateur dans la projection d'origine [longitude, latitude]
                        U_Longitude,
                        U_Latitude  
                    ],

                    "calculation_point":[ //point le plus proche du 'inner_point" où l'altitude est définie puis utilisé dans le calcul de pente [longitude, latitude]
                        calculate_geometry[0],
                        calculate_geometry[1]
                    ],

                    "topography":{ //propriétés topographiques trouvées à partir du point:
                        "elevation":matrixAlti[4], //altitude extraite du MNT
                        "slope" : slope, //pente calculée affichée selon l'unité choisie (degré ou pourcentage)
                        "aspect" : aspect, //orientation sur 360° à partir de l'axe x dans le sens inverse des aiguilles d'une montre
                    },

                    "calculation_matrix":{ //matrices des 8 points autour du point renseigné par l'utilisateur qui ont permis le calcul de pente
                        "altitudes":matrixAlti, //altitude de ces 8 points
                        "coordinates":calculate_geometry_matrix //coordonnées de ces 8 points
                    }

                },
                // "geometry_input":{
                //     "latitude":U_Latitude,
                //     "longitude":U_Longitude
                // },

                // "altitude" : matrixAlti[4],
                //ajout coordonnée point final



                //coordonnée du point ou la pente est calculée (le plus proche du point choisi)
                // "geometry_calculate":{
                //     "latitude":calculate_geometry[1],
                //     "longitude":calculate_geometry[0]
                // },

                //matrice des 8 altitude autout du points qui ont servi à calculer la pente
                // "matrix_calculate":matrixAlti,

                // "matrix_calculate_geometry":calculate_geometry_matrix
            });

            } catch (error) {
                console.log(error);
                res.send('error');
            }
            
        })

        .get('/surface',function(req,res){

            let geometry = JSON.parse(req.query.geom);

            // console.log(geometry['coord']);
            
            // pour la surface, il faut avoir un point identique à la fin pour "fermer"
            if(geometry == undefined){
                res.send("Renvoyer des coordonnées valides!");
            }

            // il faut au moins 3 points pour former un polygone
            if(geometry['coord'].length <= 3){
                res.send("Renvoyer au moins 3 points différents");
            }

            let length_polyline = 0;
            //calcul du nombre de points et la longueur de la polyligne
            for(let i = 0; i < geometry['coord'].length-1 ;i++){
                let l = (geometry['coord'][i+1][0] - geometry['coord'][i][0])**2;
                let h = (geometry['coord'][i+1][1] - geometry['coord'][i][1])**2;
                length_polyline += Math.sqrt(l+h);
            }
            
            let first_pt = geometry['coord'][0];
            let last_pt = geometry['coord'][geometry['coord'].length-1];

            // le premier point doit être le même que le dernier
            if(first_pt[0] != last_pt[0] || first_pt[1] != last_pt[1]){
                res.send("Le premier point doit être le même que le dernier");
                // console.log('hello');
            }

            let properties = {
                "algoritm":"algo",
                "unit":"unit",
                "projection":"proj",
            };

            res.json({
                geometry,
                "number of point":geometry['coord'].length,
                "perimeter": length_polyline,
                properties
            })
        })
        
        .get('/bunding', function(){
			//bunding?coord='1,2|3,4|5,6|7,8'

			let liste_point = req.query.coord;

			liste_point = liste_point.split("|");

			for(let i = 0; i < liste_point.length; i++){
				liste_point[i] = liste_point[i].split(",");
				liste_point[i][0] = parseFloat(liste_point[i][0], 10);
				liste_point[i][1] = parseFloat(liste_point[i][1], 10);
			}

			//liste_point = [[1,2], [3, 3]]

			/*
			function coordStringToInt(coord){
				let coordInt = coord.split(",");
				coordInt[0] = parseInt(coordInt[0], 10);
				coordInt[1] = parseInt(coordInt[1], 10);
				return coordInt;
			}
			*/
			
			//coord hg de l'utilisateur
			let x1 = liste_point[0][0];
			let y1 = liste_point[0][1];
			
			
			//coord bd de l'utilisateur
			let x2 = liste_point[1][0];
			let y2 = liste_point[1][1];

			let indice = search_coord.indiceCoord(x,y);

			let bonding_box = [];
			
			/*bonding_box = [
							[[1,2], [2,2],[3,2]],
							[[1,3], [2,3],[3,3]], 
							[[1,4], [2,4],[3,4]]
							]
			
			*/
			let largeur = x2 - x1;
			let longeur = y2 - y1;

			for(let i = 0; i < largeur; i++){
				for(let j = 0; j < longeur; i++){
					bonding_box.push([])
					bonding_box[i][j] = [x1 + j, y1 + i];
				}
			}
		});
          
        app.listen(port, function () {
            console.log('Listening on port ' + port.toString() +'!');
            });
    }
}

// let app = express();
// const conversion = require ('./conversion/Convert_Lambert_Modul.js');

// app.get('/', function (req, res) {
//   let x = req.query.x;
//   let y = req.query.y;
//   let pente = penteModule.Horn_algo(mat,taille_pixel);// données en entrées à modifier
//   let orient = penteModule.Zar_algo(image); // données en entrées à modifier
//   res.json({
//     "pente":pente,
//     "orientation":orient
//   });
// });
// app.get('/conversion', function (req, res) {
//   let latitude = req.query.latitude;
//   let longitude = req.query.longitude;
//   let result = conversion.PM_to_Lambert(latitude,longitude);
//   res.json(result); 
    

// });
// app.get('/conversion', function (req, res) {
//   let x = req.query.x;
//   let y = req.query.y;
//   let result2 = conversion.Lambert_to_pm(x,y);
//   res.json(result2); 
    

// });

// app.listen(8080, function () {
//     console.log('Example app listening on port 8080!');
//   });
// >>>>>>> b0952c70073ec1a7e1b638ece036073f3cbefdaa
