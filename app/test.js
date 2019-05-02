var express = require('express');
var app = express();

var myRouter = express.Router();
var url_mnt = "https://..."

var fs = require('fs');
var GeoTIFF = require('geotiff');


myRouter.route('/')

.get(function(req,res){
    res.json({
        message : "Bienvenue dans l'application PentIGN, Complêtez l'url pour accéder aux fonctionnalités",
        mnt : url_mnt,
        method : req.method
    });
});

myRouter.route('/point')

.get(function(req,res){

    var algo = 'Choisissez un algoritme';
    if(req.query.algo == 1){
        algo = "Algoritme de Zevenbergen & Thorne"
        //Algo de Zevenbergen & Thorne...
    }
    else if(req.query.algo == 2){
        algo = "Algoritme de Horn"
        //Algo de Horn...
    }

    var unite = ''
    if(req.query.unit == "prc"){
        unite = 'prc'
    }
    else{
        unite = 'deg'
    }

    res.json({
        message : "On demande de les coordonnées d'un point",
        mnt : url_mnt,
        latitude : req.query.lat,
        longitude : req.query.lng,
        algoritme : algo,
        unite : unite,
        projection : req.query.proj,
        method : req.method
    });
})

myRouter.route('/ligne')

.get(function(req,res){

    var algo = 'Choisissez un algoritme';
    if(req.query.algo == 1){
        algo = "Algoritme de Zevenbergen & Thorne"
        //Algo de Zevenbergen & Thorne...
    }
    else if(req.query.algo == 2){
        algo = "Algoritme de Horn"
        //Algo de Horn...
    }

    var unite = 'deg';
    if(req.query.unit == "prc"){
        unite = 'prc';
    }

    res.json({
        message : "On demande une liste de points",
        mnt : url_mnt,
        listepoints : [
            [
                parseFloat(req.query.lat),
                parseFloat(req.query.lng),
                parseFloat(req.query.z)
            ]
            ,[
                48,
                7,
                102
            ]
        ],

        algoritme : algo,
        unite : unite,
        projection : req.query.proj,
        method : req.method
        
    });
})

app.use(myRouter)

//on rentre un paramètre sous forme JSON ou GEOJSON dans l'url
//exemple :my_json = {"type":"LinesString","coordinates":[[0,0],[10,10],[10,20]]}

//on peut utiliser l'encodage URI exemple: "{" : %20 dans l'url pour la compatibilité
app.get("/ligne/:my_json",function (req,res){

    var geometrie = JSON.parse(req.params.my_json);
    var properties = {
        "algoritme" : req.query.algo,
        "unite" : req.query.unit,
        "projection" : req.query.proj
    };
    console.log(geometrie);

    res.json({
        message : "On génère un json avec les paramètres de la lineString",
        mnt : url_mnt,
        geometrie,
        properties,
        method:req.method
    });

})



app.get("/fichier",function(req,res){
    var imagePath = "C:/Users/User/Documents/PROJET MASTER CALCUL PENTE/penteign/template/RGEALTI_PYR_LAMB93/IMAGE/7/00/17/AD.tif";

    (async function(i,j, imagePath) {
        //lecture image raster à partir d'un URL
        const tiff = await GeoTIFF.fromFile(imagePath);

        //obtention des attribut raster

        const image = await tiff.getImage();
        //metadonnees
        // console.log(image.getWidth());
        // console.log(image);
        // ...
        // const width = image.getWidth();
        // const height = image.getHeight();
        // const tileWidth = image.getTileWidth();
        // const tileHeight = image.getTileHeight();
        // const samplesPerPixel = image.getSamplesPerPixel();

        // ne marche pas : Error: the image does not have an affine transformation
        // const origin = image.getOrigin();
        // const resolution = image.getResolution();
        // const bbox = image.getBoundingBox();

        // image lue en entier
        // const data = await image.readRasters();
        // const { width, height } = data;
        // lecture d'une image rgb
        // const [red, green, blue] = await image.readRasters();
        // lecture des bandes d'une image
        // const [r0, g0, b0, r1, g1, b1, ...] = await image.readRasters({ interleave: true });


        // lecture d'une image dans une fenêtre limité par les coordonnées image
        // au dela des bords : utiliser fillValue: value
        // const data2 = await image.readRasters({ window: [2048, 0, 4096, 4096] });
        // lecture d'un echantillon
        // const [red] = await image.readRasters({ samples: [0] });
        // console.log(red)
        
        //extraction d'une image 40 x 40 
        const data = await image.readRasters({ width: 256, height: 256});

        //lecture du pixel coord x = 0 , y = 19
        var x = 0
        var y = 18

        console.log(data[0][y + 40 * x + 1])

        //lecture du pixel coord x = 1 , y = 19
        x = 1
        y = 18

        console.log(data[0][y + 40 * x + 1])
        console.log(data[0])

        var value_test =  data[0][y + 40 * x + 1]

        res.json({
            result:value_test,
            method:req.method

        })



      })()
    
    // res.send(tiff);
    // fs.readFile(url, function(err, data) {
        // if (err) throw err; // Fail if the file can't be read.
        // res.send('<html><body><img src="data:image/tiff;base64,');
        // const tiff = GeoTIFF.fromFile(url);
        // const image = tiff.getImage();
        // const width = image.getWidth();

        
        // var width;
        // (async function() {
        //     const tiff = await GeoTIFF.fromFile(url);
        //     const image = await tiff.getImage();
        //     width = image.getWidth();
            
            // const arrayBuffer = await response.arrayBuffer();
            // const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
            // const tiff = await GeoTIFF.;
        // })()

        
        

    // })

    // res.send("Hello");


    // (async function() {
        
        // const arrayBuffer = await response.arrayBuffer();
        // const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
        // const tiff = await GeoTIFF.filesystem(url);
    // })()
    // GeoTIFF.fromURL(url);
    

//     GeoTIFF.fromUrl(url)
//   .then(tiff => {
    // const response =  fetch(url);
    // const arrayBuffer =  response.arrayBuffer();
    // const tiff =  GeoTIFF.fromArrayBuffer(arrayBuffer);
    // const image =  tiff.getImage();

    // const width = image.getWidth();
    // const height = image.getHeight();
    // const tileWidth = image.getTileWidth();
    // const tileHeight = image.getTileHeight();
    // const samplesPerPixel = image.getSamplesPerPixel();
    // console.log(width);


    // });
})

.listen(8080,function(){
    console.log('Listening on port 8080')
});

//test
var geojson = {
    "type":"LineString",
    "coordinates":[
        [
            0,
            0
        ],
        [
            10,
            10
        ]
    ]
};


//url a taper pour utiliser le geojson :http://localhost:8080/ligne/%7B%22type%22%3A%22LineString%22%2C%22coordinates%22%3A%5B%5B0%2C0%5D%2C%5B10%2C10%5D%5D%7D
//%7B = "{" ; %22 = """ ; %3A = ":" ; %2C : "," ; %5B = "[" ; %5D = "]" %7D = "}";
console.log(encodeURIComponent(JSON.stringify(geojson)));
// console.log(JSON.parse(JSON.stringify(geojson)));

