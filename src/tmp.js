var niveau = 8;
var resolution = 1;

var X0 = -0.5;
var Y0 = 12000000;
var TileW = 256; //taille de la tuile
var TileH = 256;
var MatrixW = 4000; //nombre de pixel en largeur
var MatrixH = 23000; // nombre de pixel largeur

/*indice de la tuile dans le tms*/
function Ituile(X){
	let tuile = ((X - X0) / resolution); // * resolution;
	return tuile;
}

function Jtuine(Y){
	
}

function indice_dalle(){
	
}

console.log(Ituile(3));
