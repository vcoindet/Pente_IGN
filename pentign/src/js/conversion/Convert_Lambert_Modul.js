'use strict';

const log4js = require('log4js');

// Création du LOGGER
var LOGGER = log4js.getLogger("Conversion");

module.exports = {

  /**
  *
  * @function
  * @name Conversion_lat_to_Lambert
  * @description Fonction utilisée pour éteindre le serveur. Elle permet aux logs d'être écrits avant d'arrêter le processus.
  * @param {integer} error - Signal de retour du process
  *
  */

 
  PM_to_Lambert : function(latitude,longitude) {
    
    LOGGER.info("Conversion des coordonnées latitude/longitude en Lambert 93")


    const a = 6378137; //demi grand axe de l'ellipsoide
    const e = 0.08181919106; //première excentricité de l'ellipsoide
    const lc = (3/180)*Math.PI; 
    const phi0 = (46.5/180)*Math.PI; //latitude d'origine en radian
    const phi1 = (44/180)* Math.PI; // 1er parallèle automécoïque
    const phi2 = (49/180)*Math.PI; //2eme parallele automécoïque
    const x0 = 700000; //coordonnees à l'origine
    const y0 = 6600000; //coordonnées à l'origine

    let phi = (latitude/180)* Math.PI;
    let l = (longitude/180)* Math.PI;


    //calculs des grandes normales
    var gN1 = a/Math.sqrt(1-e*e*Math.sin(phi1)*Math.sin(phi1));
    var gN2 = a/Math.sqrt(1-e*e*Math.sin(phi2)*Math.sin(phi2));

    //calculs des latitudes isométriques
    var gl1=Math.log(Math.tan(Math.PI/4+phi1/2) * Math.pow((1-e*Math.sin(phi1))/(1+e*Math.sin(phi1)),e/2));
    var gl2=Math.log(Math.tan(Math.PI/4+phi2/2) * Math.pow((1-e*Math.sin(phi2))/(1+e*Math.sin(phi2)),e/2));
    var gl0=Math.log(Math.tan(Math.PI/4+phi0/2) * Math.pow((1-e*Math.sin(phi0))/(1+e*Math.sin(phi0)),e/2));
    var gl=Math.log(Math.tan(Math.PI/4+phi/2) * Math.pow((1-e*Math.sin(phi))/(1+e*Math.sin(phi)),e/2));

    //calcul de l'exposant de la projection 
    var n = (Math.log((gN2*Math.cos(phi2))/(gN1*Math.cos(phi1))))/(gl1-gl2);

    //calcul de la constante de projection
    var c = ((gN1*Math.cos(phi1))/n)*Math.exp(n*gl1);

    //calcul des coordonnées
    var ys = y0+c*Math.exp(-1*n*gl0);

    //calcul coordonnées Lambert 93 
    var x93 = x0+c*Math.exp(-1*n*gl)*Math.sin(n*(l-lc));
    var y93 = ys-c*Math.exp(-1*n*gl)*Math.cos(n*(l-lc)); 
    let response = {
        x93, y93
    };


    return response ;
     
    }

  }; 

  module.exports = {

    /**
    *
    * @function
    * @name Conversion_Lambert_to_lat
    * @description Fonction utilisée pour convertir des coordonnées Lambert 93 en Latitude/Longitude
    * @param {integer} error - Signal de retour du process
    *
    */
  
   
    Lambert_to_pm : function(x,y) {
      
      LOGGER.info("Conversion des coordonnées Lambert 93 en WGS84 (latitude/longitude)")
      
        let b8 = 1 / 298.257222101;
        let b10 = Math.sqrt(2 * b8 - b8 * b8);
        let b16 = 0.7256077650532670;
        x = x- 700000;
        y = y-  12655612.0499;
        let gamma = Math.atan(-x / y);
      let latiso = Math.log(11754255.426096 / Math.sqrt((x * x) + (y * y))) / b16;
      let sinphiit = Math.tanh(latiso + b10 * Math.atanh(b10 * Math.sin(1)));
    
      for (i = 0; i != 6 ; i++) {
        sinphiit = Math.tanh(latiso + b10 * Math.atanh(b10 * sinphiit));
        }
        
        let longitude = (gamma / b16 + 3 / 180 * Math.PI) / Math.PI * 180;
        let latitude = Math.asin(sinphiit) / Math.PI * 180;
        let response = {
          longitude, latitude
      };
  
  
      return response ;
    
    
    
    }

  }
