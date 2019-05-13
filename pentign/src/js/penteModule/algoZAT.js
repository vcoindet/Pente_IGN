
/**
 * @function
 * @name zat_algoritm
 * @description utilise l'algoritme de Zevenbergen and Thorne pour calculer la pente et l'orientation d'un point au milieu d'une matrice de pixel 9 x 9
 * @param {Array(Float)} image matrice de 9 x 9 valeurs de pixel
 * @param {int} taille_pixel résolution en mètre d'un pixel
 * @returns {"slope":float,"aspect":float} valeur de pente et d'orientation
 */

function zat_algoritm(image,taille_pixel){
    let i = 1
    let j = 1

    // on a la matrice de la forme:
    /**
     * Z1,Z2,Z3
     * Z4,Z5,Z6
     * Z7,Z8,Z9
     */

    let Z2 = image[1];
    let Z4 = image[3];
    let Z6 = image[5];
    let Z8 = image[7];

    let G = (-Z4 + Z6) / (2 * taille_pixel);
    let H = (Z2 - Z8) / (2 * taille_pixel);

    let slope = Math.sqrt(G**2 + H**2)
    //pente en degré
    let slope_angle = Math.atan(slope) * 180 / Math.PI;
    
    let aspect = Math.atan(H/G) * 180 / Math.PI;
	
	if(aspect < 0){
			aspect = 90.0 - aspect;
		}
	else if(aspect > 90.0){
		aspect = 360.0 - aspect + 90.0;
	}
	else{
		aspect = 90.0 - aspect;
    }
    
	// return [pente, orientation];
    return {
        "slope":slope_angle,
        "aspect":aspect
    };

}

module.exports = {
    //export de la fonction de calcul de pente
    compute : function(matrix,pixelSize){
        return zat_algoritm(matrix,pixelSize);
    }
}
