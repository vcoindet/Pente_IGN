

const express = require('express')
// const penteModule = require('./penteModule/penteModule.js');
const algoZAT = require('./penteModule/algoZAT.js');
const GeoTIFF = require('geotiff');
const fs = require('fs');


(async function(){

    // var imagePath = "/home/formation/Bureau/BZ.tif";
    let imagePath = "/home/formation/Bureau/pyramide/IMAGE/8/01/60/BZ.tif";
    const tiff = await GeoTIFF.fromFile(imagePath);
    // const arrayBuffer = await response.arrayBuffer();
    // const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
    const image = await tiff.getImage();


    let n_tuile = 25;
    let ind_i_tuile = Math.floor(n_tuile / 16);
    let ind_j_tuile = (n_tuile - ind_i_tuile * 16) - 1;

    console.log(ind_i_tuile);
    console.log(ind_j_tuile);

    const data = await image.readRasters({ window: [256*(ind_j_tuile-1), 256*(ind_i_tuile-1), 256*ind_i_tuile, 256*ind_j_tuile] });

    // console.log(image); 
    // [ 183, 44 ]
    //indice image = 44 * 256 + 183

    // let mon_mnt = data[0]
    let mon_point = data[0][44 * 256 + 183]
    let matrice_coord = {'image':[
                                    [0,0,0],
                                    [0,0,0],
                                    [0,0,0]
                                ]
                            };


    // console.log(mon_mnt);
    console.log(data[0][44 * 256 + 183]);

})();

