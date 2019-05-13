
var fs = require('fs');
var zlib = require('zlib');

/** 
 * @param imagePath : répertoire de l'image tif
 * @param fd : lecture du fichier tiff
 * 
 * @param N : 
 * @param initTileOffset : 
 * @param iniTileByteCounts : 
 * @param initTile : 
 * 
*/
module.exports = {

    /**
     * @function
     * @name readTile
     * @description recherche dans un mnt de 4096 x 4096, une tuile de 256 x 256 récupérée selon la coordonnée en entrée
     * @param {String} filePath répertoire de rangement du mnt
     * @param {int} tileIndice indice de la tuile
     * @returns {Buffer} Tuile de valeurs alti sous forme de buffer (taille 256 x 256 x 4)  
     */

    readTile : function (filePath,tileIndice) {

        // ouverture et lecture du fichier renseigné
        var fd = fs.openSync(filePath,"r");
        // nombre de tuiles dans un fichier tif
        var N = 256;
        // adresse de début des valeurs du fichier tif
        var tileHeader = 2048;
        // adresse de début des valeurs de taille
        var tileOffset = tileHeader + tileIndice * 4;
        // adresse de début des tuiles
        var tileByteCount = tileHeader + N * 4 + tileIndice * 4;

        // buffer sur 4 octets qui va stocker les valeurs de position et de taille de tuile 
        var buffer = new Buffer.alloc(4);

        // on obtient la position de la tuile 
        fs.readSync(fd,buffer,0,4,tileOffset);
        var pos_tuile = buffer.readInt32LE(0);

        // on obtient la taille de la tuile
        fs.readSync(fd,buffer,0,4,tileByteCount);
        var taille_tuile = buffer.readInt32LE(0);

        //buffer qui va stocker la taille de la tuile
        var buffer3 = new Buffer.alloc(256*256*4);

        //lecture de la tuile
        fs.readSync(fd,buffer3,0,taille_tuile,pos_tuile);

        //décompression et obtention des valeurs z
        return new Promise ( (resolve, reject) => {
                zlib.inflate(buffer3, (err, buffer) => {
                if(err){
                    reject(err);
                }else{
                    resolve(buffer);
                }

            });

        });
        
    
    }

}




// //buffer de 4 octets
// var buffer = new Buffer.alloc(4);

// // path linux
// // var imagePath = "/home/formation/Bureau/pyramide/IMAGE/8/01/60/CW.tif";
// // path windows
// // var imagePath = "C:/Users/User/Documents/PROJET_MASTER_CALCUL_PENTE/penteign/GW.tif";
// var imagePath = "C:/Users/User/Documents/PROJET_MASTER_CALCUL_PENTE/penteign/7Y.tif";


// var fd = fs.openSync(imagePath,"r");

// var N = 256;
// // var initTileOffset = 2048;
// //ex lire 5e tuile
// var nTuile = 14;
// var tileHeader = 2048;
// var tileOffset = tileHeader + nTuile * 4;
// var tileByteCount = tileHeader + N * 4 + nTuile * 4;

// // console.log("TileOffset position: " + tileOffset);
// // console.log("TileByteCount position: " + tileByteCount);

// //ex lire 2 eme tuile
// // var addTuile2 = initTileOffset + buffer.readInt32LE(0) + 4;
// // var taille = iniTileByteCounts + buffer.readInt32LE(0) + 4;
// // var tuile = initTile + buffer.readInt32LE(0) + 4;

// // var bufferHeader = new Buffer.alloc(2048);
// // var ArrayHeader = new Uint8Array(134);
// // var bufferHeader2 = new Buffer.alloc(134);


// // Ajout Header pour export en tiff
// // ArrayHeader = [<
// //         73,73,  42,0,   8 ,0,   0, 0,                  // 0  | tiff header 'II' (Little endian) + magick number (42) + offset de la IFD (16)
// //         10, 0,                                         // 8  | nombre de tags sur 16 bits (10)
// //         // ..                                                | TIFFTAG              | DATA TYPE | NUMBER | VALUE
// //         0, 1,   4, 0,   1, 0, 0, 0,   0, 1, 0, 0,      // 10 | IMAGEWIDTH      (256)| LONG  (4) | 1      | 256
// //         1, 1,   4, 0,   1, 0, 0, 0,   0, 1, 0, 0,      // 22 | IMAGELENGTH     (257)| LONG  (4) | 1      | 256
// //         2, 1,   3, 0,   1, 0, 0, 0,   8, 0, 0, 0,      // 34 | BITSPERSAMPLE   (258)| SHORT (3) | 1      | pointeur vers un bloc mémoire 8
// //         3, 1,   3, 0,   1, 0, 0, 0,   1, 0, 0, 0,      // 46 | COMPRESSION     (259)| SHORT (3) | 1      | 1 (pas de compression)
// //         6, 1,   3, 0,   1, 0, 0, 0,   1, 0, 0, 0,      // 58 | PHOTOMETRIC     (262)| SHORT (3) | 1      | 1 (black is zero)
// //         17,1,   4, 0,   1 ,0, 0, 0,   134,0,0, 0,      // 70 | STRIPOFFSETS    (273)| LONG  (4) | 16     | 134
// //         21,1,   3, 0,   1, 0, 0, 0,   1, 0, 0, 0,      // 82 | SAMPLESPERPIXEL (277)| SHORT (3) | 1      | 1
// //         22,1,   4, 0,   1, 0, 0, 0,   255,255,255,255, // 94 | ROWSPERSTRIP    (278)| LONG  (4) | 1      | 2^32-1 = single strip tiff
// //         23,1,   4, 0,   1, 0, 0, 0,   0, 0, 3, 0,      // 106| STRIPBYTECOUNTS (279)| LONG  (4) | 1      | 256 * 256 * 3
// //         83,1,   3, 0,   1, 0, 0, 0,   1, 0, 0, 0,      // 118| SAMPLEFORMAT    (339)| SHORT (3) |        | 1 (Int8)
// //         0, 0, 0, 0                                     // 130| fin de l'IFD
// // ];                         // 134
// //                                                     // 146";

// // for(let i = 0; i < bufferHeader2.length; i++){
// //     bufferHeader2[i] = ArrayHeader[i];
// // }

// // console.log("Buffer Header : "+bufferHeader2.toString());

// // fs.readSync(fd,bufferHeader,0,2048,0);
// // console.log(bufferHeader.readInt32LE(0));

// //on obtient l'adresse de la tuile 5
// fs.readSync(fd,buffer,0,4,tileOffset);
// // console.log(buffer);

// // console.log("N° Tuile :" + nTuile);
// var pos_tuile = buffer.readInt32LE(0);
// // console.log("offset : " + pos_tuile);

// //on obtient la taille de la tuile 5
// fs.readSync(fd,buffer,0,4,tileByteCount);

// //taille tuile
// var taille_tuile = buffer.readInt32LE(0);
// // console.log("taille : " + taille_tuile);

// // var buffer3 = new Buffer.alloc(taille_tuile);
// var buffer3 = new Buffer.alloc(256*256*4);
// // console.log(buffer3);

// fs.readSync(fd,buffer3,0,taille_tuile,pos_tuile);
// // var tuile = buffer3.readInt32LE(0);
// // console.log("tuile : " + tuile);

// zlib.inflate(buffer3, (err, buffer) => {
//     let i = 0;
//     while (i <= buffer.length-4) {
//         var alti = buffer.readFloatLE(i);
//         console.log("i: "+i + " alti: "+alti);
//         i=i+4;
//     }
// });

        
        
    