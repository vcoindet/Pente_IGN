let mat_tmp = [[10,20,25],[22,5,25],[20,24,18]];

function horn_algorith_compute(mat, taille_pixel){
	let A = mat[0][0]; //i + 1, j - 1
	let B = mat[0][1]; //i + 1, j
	let C = mat[0][2]; //i + 1, j + 1
	let D = mat[1][0]; //i, j - 1
	let F = mat[1][2]; //i, j + 1
	let G = mat[2][0]; //i - 1, j - 1
	let H = mat[2][1]; //i - 1, j
	let I = mat[2][2]; //i - 1, j + 1

	let E_W = ((C + (2 * F) + I) - (A + (2 * D) + G)) / (8 * taille_pixel);
	let N_S = ((C + (2 * B) + A) - (I+ (2 * H) + G)) / (8 * taille_pixel);
	
	console.log(E_W);
	console.log(N_S);

	let pente =  (Math.sqrt(E_W ** 2 + N_S ** 2) * (180 / Math.PI));
	

	let orientation = (Math.atan(E_W / N_S) * (180 / Math.PI)) + 180;
	
	
	// return [pente, orientation];
	return {"slope":pente,"aspect":orientation}
}

let a = horn_algorith_compute(mat_tmp, 10);

console.log(a['slope']);
