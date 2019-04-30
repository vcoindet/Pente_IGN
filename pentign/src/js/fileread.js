
const express = require('express')
const penteModule = require('./penteModule/penteModule.js');
var GeoTIFF = require('geotiff');
var fs = require('fs');
var FileReader = require('filereader')

const app = express();
var GeoTIFF = require('geotiff');

(async function(i,j){
        // var imagePath = "/home/formation/Bureau/pyramide/IMAGE/8/01/60/BZ.tif";
        let imagePath = "/home/formation/Bureau/pyramide/IMAGE/8/01/60/BZ.tif";


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
        fs.writeFileSync("Bureau",buffer_2);
        
        
        const tiff = await GeoTIFF.fromArrayBuffer(buffer_2);
        console.log(tiff);
    })()





// readTile(i,j)



// (async function(){    
//     const tiff = await GeoTIFF.fromArrayBuffer(buffer_2);
//     const image = await tiff.getImage();
//     console.log(image);
// })()




// app.get('/', function (req, res) {
//     let x = req.query.x;
//     let y = req.query.y;
//     fs.readFile("/home/formation/Bureau/BDALTIV2_2-0_75M_ASC_LAMB93-IGN69_FRANCE_2018-01-15/BDALTIV2/1_DONNEES_LIVRAISON_2018-01-00245/BDALTIV2_MNT_75M_ASC_LAMB93_IGN69_FRANCE/BDALTIV2_75M_FXX_0375_6300_MNT_LAMB93_IGN69.asc",
//     function (err, data) {
//         if (err) throw err;
//         // console.log(data.toString());
//         // console.log(data.toString()[100])
//         // let pos = str.indexOf("ncols");
//         // let ncols = data.toString()[]
//         // enleve espaces
//         let str = str.replace(/\s/g, '');

//         res.json({
//             //   "pente":pente,
//             //   "orientation":orient,
//               "msg":"Bonjour",
//               "method":req.method,
//               "file":data.toString(),
//               "ncols":data.toString().lastIndexOf('nrows')
//             });
//     });
//     // let pente = penteModule.computeSlope(x,y);
//     // let orient = penteModule.computeAspect(x,y);
// })

app.get('/',function(req,res){
    let x = req.query.x;
    let y = req.query.y;

})

.listen(8080, function () {
    console.log('Listening on port 8080!');
    });


// let imagePath = "/home/formation/Bureau/pyramide/IMAGE/8/01/60/BZ.tif";
// let imagePath = "/home/formation/Bureau/pente_ign/test.txt";
// let fileReader = new FileReader();
// let fd = fileReader.readAsArrayBuffer(imagePath);

// let fd = fs.readFileSync(imagePath)
// console.log(fd.toString());
// var buffer = new Buffer.alloc(4);

// function printFile(file) {
//     var reader = new FileReader();
//     reader.onload = function(evt) {
//       console.log(evt.target.result);
//     };
//     reader.readAsArrayBuffer(file);
//   }

// printFile(imagePath);
