
const express = require('express')
// const penteModule = require('./penteModule/penteModule.js');
// var GeoTIFF = require('geotiff');
var fs = require('fs');
// var FileReader = require('filereader')

const app = express();
// var GeoTIFF = require('geotiff');

(async function(i,j){

//buffer de 4 octets
        var buffer = new Buffer.alloc(4);
        // var buffer = new Uint8Array(4);
        // var buffer2 = new Buffer.alloc(4);

        /** 
         * @param imagePath : répertoire de l'image tif
         * @param fd : lecture du fichier tiff
         * 
         * @param N : nombre de tuiles dans un fichier tif
         * @param initTileOffset : adresse de début des valeurs du fichier tif
         * @param iniTileByteCounts : adresse de début des valeurs de taille
         * @param initTile : adresse de début des tuiles
         * 
        */

        // path linux
        var imagePath = "/home/formation/Bureau/pyramide/IMAGE/8/01/60/CW.tif";
        // path windows
        // var imagePath = "C:/Users/User/Documents/PROJET_MASTER_CALCUL_PENTE/penteign/GW.tif";

        var fd = fs.openSync(imagePath,"r");

        var N = 256;
        // var initTileOffset = 2048;
        //ex lire 5e tuile
        var nTuile = 125;
        var tileHeader = 2048;
        var tileOffset = tileHeader + nTuile * 4;
        var tileByteCount = tileHeader + N * 4 + nTuile * 4;
        
        console.log("TileOffset position: " + tileOffset);
        console.log("TileByteCount position: " + tileByteCount);
        
        //ex lire 2 eme tuile
        // var addTuile2 = initTileOffset + buffer.readInt32LE(0) + 4;
        // var taille = iniTileByteCounts + buffer.readInt32LE(0) + 4;
        // var tuile = initTile + buffer.readInt32LE(0) + 4;
        
        var bufferHeader = new Buffer.alloc(2048);
        var ArrayHeader = new Uint8Array(134);
        var bufferHeader2 = new Buffer.alloc(134);

        ArrayHeader = [
                73,73,  42,0,   8 ,0,   0, 0,                  // 0  | tiff header 'II' (Little endian) + magick number (42) + offset de la IFD (16)
                10, 0,                                         // 8  | nombre de tags sur 16 bits (10)
                // ..                                                | TIFFTAG              | DATA TYPE | NUMBER | VALUE
                0, 1,   4, 0,   1, 0, 0, 0,   0, 1, 0, 0,      // 10 | IMAGEWIDTH      (256)| LONG  (4) | 1      | 256
                1, 1,   4, 0,   1, 0, 0, 0,   0, 1, 0, 0,      // 22 | IMAGELENGTH     (257)| LONG  (4) | 1      | 256
                2, 1,   3, 0,   1, 0, 0, 0,   8, 0, 0, 0,      // 34 | BITSPERSAMPLE   (258)| SHORT (3) | 1      | pointeur vers un bloc mémoire 8
                3, 1,   3, 0,   1, 0, 0, 0,   1, 0, 0, 0,      // 46 | COMPRESSION     (259)| SHORT (3) | 1      | 1 (pas de compression)
                6, 1,   3, 0,   1, 0, 0, 0,   1, 0, 0, 0,      // 58 | PHOTOMETRIC     (262)| SHORT (3) | 1      | 1 (black is zero)
                17,1,   4, 0,   1 ,0, 0, 0,   134,0,0, 0,      // 70 | STRIPOFFSETS    (273)| LONG  (4) | 16     | 134
                21,1,   3, 0,   1, 0, 0, 0,   1, 0, 0, 0,      // 82 | SAMPLESPERPIXEL (277)| SHORT (3) | 1      | 1
                22,1,   4, 0,   1, 0, 0, 0,   255,255,255,255, // 94 | ROWSPERSTRIP    (278)| LONG  (4) | 1      | 2^32-1 = single strip tiff
                23,1,   4, 0,   1, 0, 0, 0,   0, 0, 3, 0,      // 106| STRIPBYTECOUNTS (279)| LONG  (4) | 1      | 256 * 256 * 3
                83,1,   3, 0,   1, 0, 0, 0,   1, 0, 0, 0,      // 118| SAMPLEFORMAT    (339)| SHORT (3) |        | 1 (Int8)
                0, 0, 0, 0                                     // 130| fin de l'IFD
        ];                         // 134
                                                         // 146";

        for(let i = 0; i < bufferHeader2.length; i++){
            bufferHeader2[i] = ArrayHeader[i];
        }

        console.log("Buffer Header : "+bufferHeader2.toString());
        
        fs.readSync(fd,bufferHeader,0,2048,0);
        console.log(bufferHeader.readInt32LE(0));

        //on obtient l'adresse de la tuile 5
        fs.readSync(fd,buffer,0,4,tileOffset);
        console.log(buffer);

        console.log("N° Tuile :" + nTuile);
        var pos_tuile = buffer.readInt32LE(0);
        console.log("offset : " + pos_tuile);
        //adresse de la tuile : 92736

        //on obtient la taille de la tuile 5
        fs.readSync(fd,buffer,0,4,tileByteCount);
        
        //taille tuile
        var taille_tuile = buffer.readInt32LE(0);
        console.log("taille : " + taille_tuile);

        var buffer3 = new Buffer.alloc(taille_tuile);
        console.log(buffer3);
        
        fs.readSync(fd,buffer3,0,taille_tuile,pos_tuile);
        var tuile = buffer3.readInt32LE(0);
        console.log("tuile : " + tuile);
        
        // fs.writeFileSync("/home/formation/Bureau/datafile.tif",buffer3)
        var buf = Buffer.concat([bufferHeader2,buffer3],134+taille_tuile);
        console.log(buf);
        
        // write path linux
        fs.writeFileSync("/home/formation/Bureau/datafile.tif",buf);
        
        //write path Windows
        // fs.writeFileSync("C:/Users/User/Documents/PROJET_MASTER_CALCUL_PENTE/penteign/datafile.tif",buf)
        fs.closeSync(fd);
        // var taille_tuile = buffer.readInt32LE(0);
        // console.log("taille de la tuile : " + taille_tuile);
        //taille de la tuile : 1651107247
        
        //nouveau buffer qui prend en compte la taille de la tuile
        // var buffer_2 = new Buffer.alloc(taille_tuile);
        
        //récupération de la tuile à partir des résultat obtenus précédement
        // fs.readSync(fd,buffer_2,0,taille_tuile,pos_tuile);
        // var tuile = buffer_2.readInt32LE(0);
        // console.log("tuile : " + tuile);
        //tuile : -576938888
        
        //écriture du fichier tif de la tuile obtenue
        // fs.writeFileSync("/home/formation/Bureau/datafile.tif",buffer_2)
        
        // lecture d'une tuile avec geotiff.js 
        // const tiff = await GeoTIFF.fromArrayBuffer(buffer3);
        // console.log(tiff);
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

// app.get('/',function(req,res){
//     let x = req.query.x;
//     let y = req.query.y;

// })

// .listen(8080, function () {
//     console.log('Listening on port 8080!');
//     });


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
