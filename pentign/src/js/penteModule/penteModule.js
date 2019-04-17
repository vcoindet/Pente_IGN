'use strict';

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

  computeSlope: function(x, y) {

    return 1;

  },

  computeAspect : function(x,y){
      return 2;
  }



}
