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

  zevenbergenAndThorneSlopeComputing: function(x, y) {
    return {'valeur':1,'orientation':2};
  },

  hornSlopeComputing : function(x,y){
    return {'valeur':1,'orientation':2};
  },

  computeSlope : function(x,y){
    return 1;
  },

  computeAspect : function(x,y){
    return 2;
  },

}
