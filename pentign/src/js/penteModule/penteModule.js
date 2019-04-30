'use strict';
const zevenbergenAndThorneAlgo = require('./zat.js');

module.exports = {

  /**
  *
  * @function
  * @name computeSlope
  * @description Création d'une erreur
  * create an error with .status. we
  * can then use the property in our
  * custom error handler (Connect repects this prop as well)
  * @param {string} msg - Message d'erreur
  * @param {integer} status - Code http d'erreur
  * @return {Error} err - Erreur
  *
  */

  computeSlope: function (mat, taille_pixel){
    let A = mat[0][0]; //i + 1, j - 1
    let B = mat[0][1]; //i + 1, j
    let C = mat[0][2]; //i + 1, j + 1
    let D = mat[1][0]; //i, j - 1
    let F = mat[1][2]; //i, j + 1
    let G = mat[2][0]; //i - 1, j - 1
    let H = mat[2][1]; //i - 1, j
    let I = mat[2][2]; //i - 1, j + 1
  
    let E_W = ((C + (2 * F) + I) - (A + (2 * D) + G)) / (8 * taille_pixel);
    let N_S = ((C + (2 * B) + A) - (I + (2 * H) + G)) / (8 * taille_pixel);
    
    console.log(E_W);
    console.log(N_S);
  
    let pente =  (Math.sqrt(E_W ** 2 + N_S ** 2) * (180 / Math.PI));
    
  
    let orientation = (Math.atan(E_W / N_S) * (180 / Math.PI)) + 180;
    
    
    return [pente, orientation];
  },

  computeAspect : function(x,y){
    return 2;
  },

}
