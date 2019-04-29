var express = require('express');
var app = express();

var myRouter = express.Router();
var url_mnt = "https://..."

var fs = require('fs');
var GeoTIFF = require('geotiff.js/src/geotiff.js');

app.get(function(req,res){


    (async function() {
        const response = await fetch(someUrl);
        const arrayBuffer = await response.arrayBuffer();
        const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
    })()
});

app.listen(8080,function(){
    console.log('Listening on port 8080')
});