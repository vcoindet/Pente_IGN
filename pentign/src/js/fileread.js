
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
        
    