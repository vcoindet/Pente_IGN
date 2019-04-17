
const express = require('express')
const penteModule = require('./penteModule/penteModule.js');
var GeoTIFF = require('geotiff');
var fs = require('fs');

const app = express();
var GeoTIFF = require('geotiff');







(async function(i,j){
        var imagePath = "C:/Users/User/Documents/PROJET MASTER CALCUL PENTE/penteign/template/RGEALTI_PYR_LAMB93/IMAGE/7/00/17/AD.tif";


        var i = 1;
        var j = 2;

        var fd = fs.openSync(imagePath,"r");
        var buffer = new Buffer.alloc(4);

        var N = i + j * 16;
        var position = 2048 + 4 * N;
        var position2 = 2048 + 4 * 256 + 4 * N;
        fs.readSync(fd,buffer,0,4,position);
        var pos_tuile = buffer.readInt32LE(0);

        console.log("position = " + buffer.readInt32LE(0));
        var taille_tuile = buffer.readInt32LE(0)
        fs.readSync(fd,buffer,0,4,position2);
        console.log("taille = " + buffer.readInt32LE(0));

        var buffer_2 = new Buffer.alloc(taille_tuile);
        fs.readSync(fd,buffer_2,0,taille_tuile,pos_tuile);
        var tuile = buffer_2.readInt32LE(0);
        console.log("tuile = " + tuile);
        fs.writeFileSync("C:/Users/User/Documents/PROJET MASTER CALCUL PENTE/penteign/pente_ign/pentign/src/js/result.tif",buffer_2);
        
        
        const tiff = await GeoTIFF.fromArrayBuffer(buffer_2);
        console.log(tiff);
    })()





// readTile(i,j)



// (async function(){    
//     const tiff = await GeoTIFF.fromArrayBuffer(buffer_2);
//     const image = await tiff.getImage();
//     console.log(image);
// })()




app.get('/', function (req, res) {
    let x = req.query.x;
    let y = req.query.y;
    let pente = penteModule.computeSlope(x,y);
    let orient = penteModule.computeAspect(x,y);
    res.json({
      "pente":pente,
      "orientation":orient
    });
})

.listen(8080, function () {
    console.log('Listening on port 8080!');
    });