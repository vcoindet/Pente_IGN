
const express = require('express')
// const penteModule = require('./penteModule/penteModule.js');
const algoZAT = require('./penteModule/algoZAT.js');
var GeoTIFF = require('geotiff');
var fs = require('fs');

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

        const app = express();
        ////// liste de points obtenues par un JSON
        app.get("/polyligne/:my_json",function (req,res){

            var geometrie = JSON.parse(req.params.my_json);
            var properties = {
                "algoritme" : req.query.algo,
                "unite" : req.query.unit,
                "projection" : req.query.proj
            };
            
            console.log(geometrie);
        
            res.json({
                message : "On génère un json avec les paramètres de la lineString",
                geometrie,
                properties,
                method:req.method
            });
        
        })

        app.get('/polyligne', function (req, res) {
            //query
            let x = parseFloat(req.query.x);
            let y = parseFloat(req.query.y);

            let listepoint = req.query.listepoint;
            // let listepoint = req.params.liste;
            let nb_point = req.query.nb_point;
            let typecoord = req.query.typecoord;
            //let lst_x = [];
            //let lst_y = [];
            
            let lst_pente = [];
            let lst_orien = [];
            
            //erreur
            // reconstruit la liste de point
            if(listepoint.length > nb_point){
				let point_pas = listepoint / nb_point;//on prend un point tout les x point_pas
				let new_list_point = [];
				for(let j = 0; j < listepoint; j + point_pas){
					new_list_point.push(listepoint[j]);
				}
				listepoint = new_list_point;
			}
			
            for(let i = 0; i < listepoint.length; i++){
				//lst_x.push(listepoint[i][0]);
				//lst_y.push(listepoint[i][1]);
				lst_pente.push(penteModule.computeSlope(listepoint[i][0],listepoint[i][1]));
				lst_orien.push(penteModule.computeAspect(listepoint[i][0],listepoint[i][1]));
			}

            let pente = penteModule.computeSlope(x,y);
            let orient = penteModule.computeAspect(x,y);
            for (let i = 0; i < nb_point; i++){
            res[i].json({
                  "lat" : x[i],
                  "long" : y[i],
                  "alti": "",
                  "geometrie":listepoint
                  
                });
			}
           
          })

        .get('/',function(req,res){
            res.json({
                message : "Bienvenue dans l'application PentIGN, Complêtez l'url pour accéder aux fonctionnalités",
                method : req.method
            });
        }) 


        .get('/point',function(req,res){

            // var imagePath = "C:/Users/User/Documents/PROJET MASTER CALCUL PENTE/penteign/template/RGEALTI_PYR_LAMB93/IMAGE/7/00/17/AD.tif";
            
            //query

            var geometrie = JSON.parse(req.params.my_json);
            
            

            let x = parseFloat(req.query.x);
            let y = parseFloat(req.query.y);

            // let x = parseFloat(req.params.x);
            // let y = parseFloat(req.params.y);

            // var pente = penteModule.zevenbergenAndThorneSlopeComputing(1,2,3);
            let i = x;
            let j = y;
            (async function(){
                // const response = await GeoTIFF.fromFile(imagePath);
                // const arrayBuffer = await response.arrayBuffer();
                // const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
                // const image = await tiff.getImage();

                const imageWidth = 40;
                const imageHeight = 40;

                // const geometry = [x,y];

                // const data = await image.readRasters({
                //     // top:0,
                //     // left:3000,
                //     // right:3100,
                //     // bottom:1 
                //     width: imageWidth,
                //     height: imageHeight
                //     // ,pool
                // });

                //fonction du choix de l'unité et de l'algoritme
                function valProperties(valQuery,valeurInseree,valeurDefaut){
                    if(valQuery == valeurInseree){
                        return valeurInseree;
                    }else{
                        return valeurDefaut;
                    }
                }

                let unite = valProperties(req.query.unit,'prc','deg');
                let algo = valProperties(req.query.algo,'Horn','Zevenbergen and Thorne');             

                var properties = {
                    "algoritme" : algo,
                    "unite" : unite,
                    "projection" : req.query.proj
                };

                // var pixel_value = data[0][i + imageWidth * j];
                let pente = 1;
                res.json({
                    "i image":i,
                    "j image":j,
                    "geometrie":geometrie,
                    "pente":0,
                    "properties":properties                
                    // "image":response
                })
            
            })()
        })

        .get('/surface',function(req,res){
          res.json({
            "listepoint":"listepoint",
            "algo":"algo",
            "unité":"unit",
            "projection":"proj"
          })
        })
          
        .listen(8080, function () {
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
