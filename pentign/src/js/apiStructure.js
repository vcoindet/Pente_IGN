
const express = require('express')
const penteModule = require('./penteModule/penteModule.js');
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
        
        
        .get('/',function(req,res){
            res.json({
                message : "Bienvenue dans l'application PentIGN, Complêtez l'url pour accéder aux fonctionnalités",
                method : req.method
            });
        }) 


        .get('/point',function(req,res){

            var imagePath = "C:/Users/User/Documents/PROJET MASTER CALCUL PENTE/penteign/template/RGEALTI_PYR_LAMB93/IMAGE/7/00/17/AD.tif";

            let x = parseFloat(req.query.x);
            let y = parseFloat(req.query.y);

            // var pente = penteModule.zevenbergenAndThorneSlopeComputing(1,2,3);

            let i = x;
            let j = y;
            
            (async function(){


                // const pool = new GeoTIFF.Pool();
                // lecture image raster à partir d'un URL
                // const tiff = await GeoTIFF.fromFile(imagePath);
                // const image = await tiff.getImage();
                // const response = image.arrayBuffer();

                const response = await GeoTIFF.fromFile(imagePath);
                const arrayBuffer = await response.arrayBuffer();
                const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
                const image = await tiff.getImage();
                // console.log(image);

                const imageWidth = 40;
                const imageHeight = 40;

                const data = await image.readRasters({
                    // top:0,
                    // left:3000,
                    // right:3100,
                    // bottom:1 
                    width: imageWidth,
                    height: imageHeight
                    // ,pool
                });

                var pixel_value = data[0][i + imageWidth * j];


                // var image = {
                //     "image":[
                //         [,,],
                //         [,pixel_value,],
                //         [,,]
                //     ]
                // }

                // console.log(j);
                // console.log(i + imageWidth * j + 1);
                // console.log(pixel_value);
                res.json({
                    "i image":i,
                    "j image":j,
                    "valeur de pixel":pixel_value,
                    "pente":pente,
                    "image":response
                })
            

            })()
        })
        
        app.get('/polyligne', function (req, res) {
            let x = req.query.x;
            let y = req.query.y;
            let listepoint = req.query.listepoint;
            let nb_point = req.query.nb_point;
            let typecoord = req.query.typecoord;
            //let lst_x = [];
            //let lst_y = [];
            
            let lst_pente = [];
            let lst_orien = [];
            let lst_pente_trie;
			let min_pente;
			let max_pente;
			let moy_pente;
            let somme_pente;
            
            //reconstruit la liste de point
            if(listepoint.length > nb_point){
				let point_pas = Math.floor(listepoint / nb_point);//on prend un point tout les x point_pas
				let new_list_point = [];
				for(let j = 0; j < listepoint; j + point_pas){
					new_list_point.push(listepoint[j]);
				}
				listepoint = new_list_point;
			}
			
			//calcule pour chaque point la pente et l'orientation
            for(let i = 0; i < listepoint.length; i++){
				lst_pente.push(penteModule.computeSlope(listepoint[i][0],listepoint[i][1]));
				lst_orien.push(penteModule.computeAspect(listepoint[i][0],listepoint[i][1]));
			}
			
			lst_pente_trie = lst_pente.sort();
			
			min_pente = lst_pente_trie[0];
			max_pente = lst_pente_trie[lst_pente_trie.length - 1];
			
			somme_pente = lst_pente.reduce((a,b)=> a + b, 0); //additionne toute les valeurs du tableau
			moy_pente = somme_pente / lst_pente.length;
            
            for (let i = 0; i < nb_point; i++){
				res[i].json({
					"lat utilisateur" = x[i];
					"long utilisateur" = y[i]; 
					"alti" = 0;
					"pente" = lst_pente[i];
					"orientation" = lst_orien[i];
					"lat reel" = 0;
					"long reel" = 0;
				});
			}
          })
          
        .listen(8080, function () {
            console.log('Listening on port 8080!');
            });

        
    }

}

<<<<<<< HEAD
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
=======
=======
const conversion = require ('./conversion/Convert_Lambert_Modul.js');

app.get('/', function (req, res) {
  let x = req.query.x;
  let y = req.query.y;
  let pente = penteModule.Horn_algo(mat,taille_pixel);// données en entrées à modifier
  let orient = penteModule.Zar_algo(image); // données en entrées à modifier
  res.json({
    "pente":pente,
    "orientation":orient
  });
});
//Conversion Pseudo Mercator en Lambert 93
app.get('/conversion/pm2l93', function (req, res) {
  let latitude = req.query.latitude;
  let longitude = req.query.longitude;
  let result = conversion.PM_to_Lambert(latitude,longitude);
  res.json(result); 
    

});
// Conversion Lambert 93 en Pseudo Mercator 
app.get('/conversion/l932pm', function (req, res) {
  let x = req.query.x;
  let y = req.query.y;
  let result2 = conversion.Lambert_to_pm(x,y);
  res.json(result2); 
>>>>>>> f5773e7c5913aff791a54f49eaaca5ad74fb87aa
    

// });

// app.listen(8080, function () {
//     console.log('Example app listening on port 8080!');
//   });
// >>>>>>> b0952c70073ec1a7e1b638ece036073f3cbefdaa
