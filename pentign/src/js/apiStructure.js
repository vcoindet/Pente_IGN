
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
        
        app.get('/test', function (req, res) {
            let x = req.query.x;
            let y = req.query.y;
            let pente = penteModule.computeSlope(x,y);
            let orient = penteModule.computeAspect(x,y);
            res.json({
              "pente":pente,
              "orientation":orient
            });
          })

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

            var pente = penteModule.zevenbergenAndThorneSlopeComputing(1,2,3);

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
          
        .listen(8080, function () {
            console.log('Listening on port 8080!');
            });

        
    }

}

