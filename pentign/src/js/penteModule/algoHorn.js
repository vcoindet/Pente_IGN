
/**
 * @function
 * @name horn_algoritm
 * @description utilise l'algoritme de Horn pour calculer la pente et l'orientation d'un point au milieu d'une matrice de pixel 9 x 9
 * @param {Array(Float)} image matrice de 9 x 9 valeurs de pixel
 * @param {int} taille_pixel résolution en mètre d'un pixel
 * @returns {"slope":float,"aspect":float} valeur de pente et d'orientation
 */

function horn_algoritm(mat, taille_pixel){
	let orientation;

	/**
	 * on a la matrice de la forme:
	 * A,B,C
	 * D,E,F
	 * G,H,I
	 */
	
	let A = mat[0]; //i + 1, j - 1
	let B = mat[1]; //i + 1, j
	let C = mat[2]; //i + 1, j + 1
	let D = mat[3]; //i, j - 1
	let F = mat[5]; //i, j + 1
	let G = mat[6]; //i - 1, j - 1
	let H = mat[7]; //i - 1, j
	let I = mat[8]; //i - 1, j + 1

	let E_W = ((C + (2 * F) + I) - (A + (2 * D) + G)) / (8 * taille_pixel);
	let N_S = ((C + (2 * B) + A) - (I+ (2 * H) + G)) / (8 * taille_pixel);
	
	let pente =  Math.atan(Math.sqrt(E_W ** 2 + N_S ** 2))  * (180 / Math.PI);
	
	if(N_S != 0){
		orientation = Math.atan(E_W / N_S) * (180 / Math.PI);
		if(orientation < 0){
			orientation = 90.0 - orientation;
		}
		else if(orientation > 90.0){
			orientation = 360.0 - orientation + 90.0;
		}
		else{
			orientation = 90.0 - orientation;
		}
	}
	else{
		orientation = -1;
	}
	
	// return [pente, orientation];
	return {
		"slope":pente,
		"aspect":orientation
	}
}

module.exports = {
	//export de la fonction de calcul de pente
	compute : function(matrix,pixelSize){
		return horn_algoritm(matrix,pixelSize);
	}
}
