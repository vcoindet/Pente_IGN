// let mat_tmp = [[10,20,25],[22,5,25],[20,24,18]];

function horn_algoritm(mat, taille_pixel){
	let orientation;
	
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
	
	// console.log(E_W);
	// console.log(N_S);

	let pente =  (Math.sqrt(E_W ** 2 + N_S ** 2) * (180 / Math.PI));
	
	if(N_S != 0){
		orientation = (Math.atan(E_W / N_S) * (180 / Math.PI)) + 180;
	}
	else{
		orientation = -1;
	}
	
	
	// return [pente, orientation];
	return {"slope":pente,"aspect":orientation}
}

// let a = horn_algorith(mat_tmp, 10);

// console.log(a['slope']);


module.exports = {
	compute : function(matrix,pixelSize){
		return horn_algoritm(matrix,pixelSize);
	}
}
