var express = require('express');
var app = express();

var myRouter = express.Router();
var url_mnt = "https://..."


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


.listen(8080,function(){
    console.log('Listening on port 8080')
});

//test
var geojson = {
    "type":"LineString",
    "coordinates":[
        [
            0,
            0,
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

