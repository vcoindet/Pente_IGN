

const express = require('express')
// const penteModule = require('./penteModule/penteModule.js');
const algoZAT = require('./penteModule/algoZAT.js');
const GeoTIFF = require('geotiff');
const fs = require('fs');
const tiff = require('decode-tiff');


// module.exports = {
//     getMatrix : function(point_coord_ij,imagePath){
//         let imagePath = "/home/formation/Bureau/pyramide/IMAGE/8/01/60/BZ.tif";

//         (async function(){
//             const tiff = await GeoTIFF.fromFile(imagePath);
//             const image = await tiff.getImage();
//         })
    
//         let point_coord_ij = [183,44]; // exemple point de coordonnée i j pour l'image
//         let pti = point_coord_ij[0];  
//         let ptj = point_coord_ij[1];
    
//         let n_tuile = 200; // n de tuile
//         let ind_i_tuile = Math.floor(n_tuile / 16); // indice i pour trouver la tuile
//         let ind_j_tuile = (n_tuile - ind_i_tuile * 16) - 1; // indice j pour trouver la tuile

//         let left = 256 * ind_j_tuile;
//         let top = 256 * ind_i_tuile;
//         let bottom = top + 256;
//         let right = left + 256;
    
//         const data = image.readRasters({ window: [left,top,right,bottom] });

//         return data;

//     }
// }
let imagePath = "/home/formation/Bureau/pyramide/IMAGE/8/01/60/BZ.tif";// répertoire de l'image


async function readMNTTile(imagePath,left,top,tailleImage){
    const tiff = await GeoTIFF.fromFile(imagePath);
    const image = await tiff.getImage();
    // const data = await image.readRasters({ window: [left, top, right, bottom] });
    const data = await image.readRasters({ window: [left, top, left + tailleImage, top + tailleImage] });
    // return data;
    return data;
}


// let imagePath = "/home/formation/Bureau/pyramide/IMAGE/8/01/60/BZ.tif";// répertoire de l'image
let tailleImage = 256 ;// taille en pixels d'une tuille
let n_tuile = 1; // numero de tuile
let ind_i_tuile = Math.floor(n_tuile / 16); // indice i pour trouver la tuile
let ind_j_tuile = (n_tuile - ind_i_tuile * 16) - 1; // indice j pour trouver la tuile

let left = tailleImage * ind_j_tuile; // coordonnée image à gauche
let top = tailleImage * ind_i_tuile; // coordonnée image en haut

// readMNTTile(imagePath,left,top,tailleImage).then(function(message){dataFile = message}); //tuille issue de la fonction assynchrone
// console.log(" Raster Tile : " + tileData);
// console.log(readMNTTile(imagePath,left,top,tailleImage).resolve());
// let dataFile = readMNTTile(imagePath,left,top,tailleImage);

// readMNTTile(imagePath,left,top,tailleImage).then((message) => console.log(message));

readMNTTile(imagePath,left,top,tailleImage).then(function(data){
    // console.log(data[0]);

    let mon_mnt = data[0];

    let point_coord_ij = [183,44]; // exemple point de coordonnée i j pour l'image
    let pti = point_coord_ij[0];  
    let ptj = point_coord_ij[1];

    let A = pti * 256 + ptj - 256 - 1;
    let B = pti * 256 + ptj - 256;
    let C = pti * 256 + ptj - 256 + 1;

    let D = pti * 256 + ptj - 1;
    let E = pti * 256 + ptj;
    let F = pti * 256 + ptj + 1;

    let G = pti * 256 + ptj + 256 - 1;
    let H = pti * 256 + ptj + 256;
    let I = pti * 256 + ptj + 256 + 1;

    let matrice_coord = {"image":[[0,0,0],[0,0,0],[0,0,0]]};

    if(A >=0 && C <= 65536 && D >= 0 && F <= 65536 && G >= 0 && I <= 65536){
        matrice_coord = {
            "image":[
                [mon_mnt[A],mon_mnt[B],mon_mnt[C]],
                [mon_mnt[D],mon_mnt[E],mon_mnt[F]],
                [mon_mnt[G],mon_mnt[H],mon_mnt[I]]
            ]
        };
    } else {
        throw console.error("impossible en dehors des limites");
    }

    // console.log(matrice_coord);

});



// console.log("sdfdsfsd" + dataFile.then((message) => {message}));

// console.log(dataFile);


(async function(){

    // var imagePath = "/home/formation/Bureau/BZ.tif";
    // let imagePath = "/home/formation/Bureau/pyramide/IMAGE/8/01/60/BZ.tif";

    const tiff = await GeoTIFF.fromFile(imagePath);

    // const arrayBuffer = await response.arrayBuffer();
    // const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);

    const image = await tiff.getImage();

    let point_coord_ij = [183,44]; // exemple point de coordonnée i j pour l'image
    let pti = point_coord_ij[0];  
    let ptj = point_coord_ij[1];

    let n_tuile = 200; // n de tuile
    let ind_i_tuile = Math.floor(n_tuile / 16); // indice i pour trouver la tuile
    let ind_j_tuile = (n_tuile - ind_i_tuile * 16) - 1; // indice j pour trouver la tuile

    // console.log(ind_i_tuile);
    // console.log(ind_j_tuile);
    // const data = await image.readRasters({ window: [left, top, right, bottom] });

    let left = 256 * ind_j_tuile;
    let top = 256 * ind_i_tuile;
    let bottom = top + 256;
    let right = left + 256;

    const data = await image.readRasters({ window: [left,top,right,bottom] });



    // console.log(data); 
    // [ 183, 44 ]
    //indice image = 44 * 256 + 183

    let mon_mnt = data[0];
    // let mon_point = data[0][44 * 256 + 183]// récupère la valeur du point dans la tuile

    // creation d'une matrice 9 x 9

    // [ A , B , C ];
    // [ D , E , F ];
    // [ G , H , I ];

    let A = pti * 256 + ptj - 256 - 1;
    let B = pti * 256 + ptj - 256;
    let C = pti * 256 + ptj - 256 + 1;

    let D = pti * 256 + ptj - 1;
    let E = pti * 256 + ptj;
    let F = pti * 256 + ptj + 1;

    let G = pti * 256 + ptj + 256 - 1;
    let H = pti * 256 + ptj + 256;
    let I = pti * 256 + ptj + 256 + 1;

    let matrice_coord = {"image":[[0,0,0],[0,0,0],[0,0,0]]};

    if(A >=0 && C <= 65536 && D >= 0 && F <= 65536 && G >= 0 && I <= 65536){
        matrice_coord = {
            "image":[
                [mon_mnt[A],mon_mnt[B],mon_mnt[C]],
                [mon_mnt[D],mon_mnt[E],mon_mnt[F]],
                [mon_mnt[G],mon_mnt[H],mon_mnt[I]]
            ]
        };
    } else {
        throw console.error("impossible en dehors des limites");
    }  

    // console.log(mon_mnt);
    // console.log(matrice_coord);

})();


//valeurs interdites pour C F I
var tab = [];

for(let i = 1;i<255;i++){
    tab.push(256*i);
}

// console.log(tab);




