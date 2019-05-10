
const express = require('express');
// const cors = require('cors'); //util pour les autorisation

// const penteModule = require('./penteModule/penteModule.js');
const algoZAT = require('./penteModule/algoZAT.js');
const algoHorn = require('./penteModule/algoHorn.js');
var GeoTIFF = require('geotiff');
var fs = require('fs');
// var mnt_simul = require('./mnt_simul.js');
var search_coord = require('./search_coord.js');
var fileRead = require('./fileread.js');
var apiProperties = require('./utils/apiProperties.js');
var WGS84_to_L93 = require('./utils/WGS84_to_L93.js');
var L93_to_WGS84 = require('./utils/L93_to_WGS84');

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

        // ################################ POLYLIGNE #####################################
        app.get("/polyligne",function (req,res){

            let geometry = req.query.geom.split('|');
            //on récupère la liste de points
            for(let i = 0 ; i < geometry.length ; i++){
                geometry[i] = geometry[i].split(',');
                geometry[i][0] = parseFloat(geometry[i][0]);
                geometry[i][1] = parseFloat(geometry[i][1]);
            }

            if(geometry == undefined ){
                res.send("erreur: rentrer des coordonnées valides")
            }

            //la polyligne doit comporter au moins deux points
            if(geometry.length <= 2){
                res.send("erreur: rentrer au moins 2 points")
            }

            console.log(geometry);
            

            let nb_point;
            //nombre de points pour la division de la ligne
            if(req.query.nb_point == undefined){
                nb_point = 1;
            }
            else{
                nb_point = req.query.nb_point;
            }

            if(geometry.length <= 1){
                res.send('erreur, veuillez rentrer une liste de plus de deux points');
            }
            // console.log("liste de points : " + geometry);
            // console.log(geometry[0]);

            let length_list = geometry.length;
            let length_polyline = 0;

            //calcul du nombre de points et la longueur de la polyligne
            // for(let i = 0; i < length_list-1 ;i++){
            //     let l = (geometry['coord'][i+1][0] - geometry['coord'][i][0])**2;
            //     let h = (geometry['coord'][i+1][1] - geometry['coord'][i][1])**2;
            //     length_polyline += Math.sqrt(l+h);
            // }

            
            // on détecte si le nombre de point par rapport à celui inséré est dépassé

            //ajout dans le resultat JSON


            let unite = apiProperties.valProperties(req.query.unit,'prc','deg');
            let algo = apiProperties.valProperties(req.query.algo,'Horn','Zevenbergen and Thorne');    

            var properties = {
                "algoritm" : algo,
                "unit" : unite,
                "projection" : req.query.proj
            };


            // reconstruit la liste de point (expérimental)
            // if(length_list > nb_point){
            //     let point_pas = Math.ceil(length_list / nb_point);// on prend un point tout les x point_pas
            //     console.log(point_pas);
			// 	let new_list_point = [];
			// 	for(let j = 0; j < length_list; j++){
            //         if(j % point_pas == 0){
            //             new_list_point.push(geometry['coord'][j]);
            //         }			
			// 	}
            //     listepoint = new_list_point;
            //     console.log(new_list_point);
            // }


            // on donne la liste des pentes et des orientations calculées

            let liste_pts_pente = [];
            let lst_pente = [];
            let lst_orien = [];
            // if (algo == 'Zevenbergen and Thorne') {
            //     for(let i = 0; i < length_list; i++){
            //         lst_pente.push(algoZAT.compute(matrix,10)['slope']);
            //         lst_orien.push(algoZAT.compute(matrix,10)['aspect']);
            //         liste_pts_pente['slope'] = algoZAT.compute(matrix,10)['slope'];
            //         liste_pts_pente['aspect'] = algoZAT.compute(matrix,10)['aspect'];

            //         let json = {
            //             "slope":algoZAT.compute(matrix,10)['slope'],
            //             "aspect":algoZAT.compute(matrix,10)['aspect']
            //         }

            //         liste_pts_pente.push(json);


            //     }
            // }
            // else if (algo == 'Horn'){
            //     for(let i = 0; i < length_list; i++){
            //         lst_pente.push(algoZAT.compute(matrix,10)['slope']);
            //         lst_orien.push(algoZAT.compute(matrix,10)['aspect']);
            //     }
            // }

            // console.log(lst_pente);
            // console.log(lst_orien);
            // console.log("nb_point : "+nb_point);
            // console.log("pente du premier point" + liste_pts_pente[0]['slope']);
            
            
            res.json({
                message : "On génère un json avec les paramètres de la lineString",
                geometry,
                "number of points":length_list,
                "polyline length":length_polyline,
                properties,
                "liste_points_slopes":liste_pts_pente,
                method:req.method
            });

        });

        // ############################## POLYLIGNE (OLD) #############################
        // app.get('/polyligne', function (req, res) {
        //     //query
        //     let x = parseFloat(req.query.x);
        //     let y = parseFloat(req.query.y);

        //     let listepoint = req.query.listepoint;
        //     // let listepoint = req.params.liste;
        //     let nb_point = req.query.nb_point;
        //     //let lst_x = [];
        //     //let lst_y = [];
            
        //     let lst_pente = [];
        //     let lst_orien = [];
            
        //     //erreur
        //     // reconstruit la liste de point
        //     if(listepoint.length > nb_point){
		// 		let point_pas = Math.ceil(listepoint / nb_point);//on prend un point tout les x point_pas
		// 		let new_list_point = [];
		// 		for(let j = 0; j < listepoint; j + point_pas){
		// 			new_list_point.push(listepoint[j]);
		// 		}
		// 		listepoint = new_list_point;
		// 	}
			
        //     for(let i = 0; i < listepoint.length; i++){
		// 		//lst_x.push(listepoint[i][0]);
		// 		//lst_y.push(listepoint[i][1]);
		// 		lst_pente.push(penteModule.computeSlope(listepoint[i][0],listepoint[i][1]));
		// 		lst_orien.push(penteModule.computeAspect(listepoint[i][0],listepoint[i][1]));
		// 	}

        //     let pente = penteModule.computeSlope(x,y);
        //     let orient = penteModule.computeAspect(x,y);
        //     for (let i = 0; i < nb_point; i++){
        //     res[i].json({
        //           "lat" : x[i],
        //           "long" : y[i],
        //           "alti": "",
        //           "geometry":listepoint
                  
        //         });
		// 	}
           
        //   });

        app.get('/',function(req,res){
            res.json({
                message : "Bienvenue dans l'application PentIGN, Complêtez l'url pour accéder aux fonctionnalités",
                method : req.method
            });
        });


        // ################################ POINT ############################################

        app.get('/point',async function(req,res){

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
                filePath = "C:/Users/User/Documents/PROJET_MASTER_CALCUL_PENTE/penteign/" + filePath;

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
                        console.log(lon);
                        console.log(lat);

                        calculate_geometry_matrix[i] = L93_to_WGS84.transform(lon,lat);
                    }
                } else{
                }
                
                //algoritmes de pente
            if (algo == 'Zevenbergen and Thorne') {
                slope = algoZAT.compute(matrixAlti,10)['slope'];
                aspect = algoZAT.compute(matrixAlti,10)['aspect'];
            }
            else if (algo == 'Horn'){
                slope = algoHorn.compute(matrixAlti,10)['slope'];
                aspect = algoHorn.compute(matrixAlti,10)['aspect'];
            }

            // conversion degré pourcent
            if(unite == 'prc'){
                slope = slope * 100 / 45;
            }

            res.json({
                //coordonnée du point choisi
                "geometry_input":{
                    "latitude":U_Latitude,
                    "longitude":U_Longitude
                },

                "geometry_calculate":{
                    "latitude":calculate_geometry[1],
                    "longitude":calculate_geometry[0]
                },

                "altitude" : matrixAlti[4],
                //ajout coordonnée point final
                "properties":{
                    "algoritm" : algo,
                    "unit" : unite,
                    "projection" : proj
                },
                "slope" : slope,
                "aspect" : aspect,
                "matrix_calculate":matrixAlti,
                "matrix_calculate_geometry":calculate_geometry_matrix
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
				liste_point[i][0] = parseInt(liste_point[i][0], 10);
				liste_point[i][1] = parseInt(liste_point[i][1], 10);
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
          
        app.listen(8080, function () {
            console.log('Listening on port 8080!');
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
