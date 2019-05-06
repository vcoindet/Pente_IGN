/*
<tileMatrix>
		<id>8</id>
		<resolution>1</resolution>
		<topLeftCornerX>-0.5</topLeftCornerX>
		<topLeftCornerY>12000000.5</topLeftCornerY>
		<tileWidth>256</tileWidth>
		<tileHeight>256</tileHeight>
		<matrixWidth>4000</matrixWidth>
		<matrixHeight>23000</matrixHeight>
	</tileMatrix>
*/

/*
<level>-104.984703
        <tileMatrix>8</tileMatrix>
        <baseDir>creation/IMAGE/8</baseDir>
        <mask>
            <baseDir>creation/MASK/8</baseDir>
            <format>TIFF_ZIP_INT8</format>
        </mask>
        <tilesPerWidth>16</tilesPerWidth>
        <tilesPerHeight>16</tilesPerHeight>
        <pathDepth>2</pathDepth>
        <nodata>
            <filePath>creation/NODATA/8/nd.tif</filePath>
        </nodata>
        <TMSLimits>
            <minTileRow>21105</minTileRow>
            <maxTileRow>21429</maxTileRow>
            <minTileCol>3578</minTileCol>
            <maxTileCol>3961</maxTileCol>
        </TMSLimits>
    </level>
*/

var niveau = 8;

var resolution = 1;
var X0 = -0.5;//Abscisse du coin supérieur gauche, origine du quadrillage
var Y0 = 12000000.5;//Ordonnée du coin supérieur gauche, origine du quadrillage
var TileW = 256; //taille de la tuile
var TileH = 256;
var MatrixW = 4000; //nombre de pixel en longeur
var MatrixH = 23000; // nombre de pixel largeur
var tilesPerWidth = 16; //nb de tuile dans la hauteur de la dalle
var tilesPerHeight = 16;
var pathDepth = 2; //profondeur arborescence

 /**
  *
  * @function
  * @name searchIndiceCoord
  * @description Renvoie les indices de dalle
  * correspondant au coord en entrée
  * @param {int} x - coord en lambert 93
  * @param {int} Y - coord en lambert 93
  * @return {lst[int]} indice - coord haut gauche de la dalle en lambert93
  */

function searchIndiceCoord(x, y){
	let realW = resolution * TileW;//largeur reelle d'une tuile
	let realH = resolution * TileH;//hauteur reelle d'une tuile

	let Ituile = Math.floor((x - X0) / realW);//indice I de la tuile dans le tms
	let Jtuile = Math.floor((Y0 - y) / realH);//indice J de la tuile dans le tms
	
	console.log(Ituile);
	console.log(Jtuile);
	
	let I_dalle = Math.floor(Ituile / tilesPerWidth);//indice I de la dalle
	let J_dalle = Math.floor(Jtuile / tilesPerHeight);//indice J de la dalle

	console.log(I_dalle);
	console.log(J_dalle); 

	let Xtuile = Ituile * realW;//coord du hg de la tuile concernée hg = haut gauche
	let Ytuile = Y0 - (Jtuile * realH);//coord du hg de la tuile concernée hg = haut gauche

	//X gauche
	let I_tms_hg = Math.floor((x - X0)) / resolution;//indice du pixel sur l'ensemble
	let X_phase_hg = I_tms_hg * resolution;//coordonnée du pixel à gauche concerné
	
	//X droite
	let I_tms_hd = Math.ceil((x - X0)) / resolution;//indice du pixel sur l'ensemble
	let X_phase_hd = I_tms_hd * resolution;//coordonnée du pixel à droite concerné
	
	//Y haut
	let J_tms_hg = Math.floor((Y0 - y)) / resolution;//indice du pixel sur l'ensemble
	let Y_phase_hg = J_tms_hg * resolution;//coordonnée du pixel en haut concerné

	//Y bas
	let J_tms_bg = Math.ceil((Y0 - y)) / resolution;//indice du pixel sur l'ensemble
	let Y_phase_bg = J_tms_bg * resolution;//coordonnée du pixel en bas concerné

	let I_phase_final = -99999;
	let J_phase_final = -99999;

	if(Math.abs(X_phase_hd - x) < Math.abs(x - X_phase_hg)){
		X_phase_final = X_phase_hd;//coord X le plus proche
		I_phase_final = I_tms_hd;
	}
	else{
		X_phase_final = X_phase_hg;//coord X le plus proche
		I_phase_final = I_tms_hg;
	}
	
	if(Math.abs(Y_phase_hg - y) < Math.abs(y - Y_phase_bg)){
		Y_phase_final = Y_phase_hg;//coord Y le plus proche
		J_phase_final = J_tms_hg;
	}
	else{
		Y_phase_final = Y_phase_bg;//coord Y le plus proche
		J_phase_final = J_tms_bg;
	}
	
	/*
	console.log(X_phase_final);
	console.log(Y_phase_final);
	*/

	let I_phase = I_phase_final % TileW;//indice I du pixel dans la tuile
	let J_phase = J_phase_final % TileH;//indice J du pixel dans la tuile
	
	/*
	console.log("##########");
	console.log(X_phase_final);
	console.log(Y_phase_final);
	console.log(I_phase);
	console.log(J_phase);
	console.log(I_dalle);
	console.log(J_dalle);
	console.log(I_phase_final);
	console.log(J_phase_final);
	console.log("##########");
	*/
	
	return [I_dalle, J_dalle];
}

function indiceCoord(x, y){
	//X gauche
	let I_tms_hg = Math.floor((x - X0)) / resolution;//indice du pixel sur l'ensemble
	let X_phase_hg = I_tms_hg * resolution;//coordonnée du pixel à gauche concerné
	
	//X droite
	let I_tms_hd = Math.ceil((x - X0)) / resolution;//indice du pixel sur l'ensemble
	let X_phase_hd = I_tms_hd * resolution;//coordonnée du pixel à droite concerné
	
	//Y haut
	let J_tms_hg = Math.floor((Y0 - y)) / resolution;//indice du pixel sur l'ensemble
	let Y_phase_hg = J_tms_hg * resolution;//coordonnée du pixel en haut concerné

	//Y bas
	let J_tms_bg = Math.ceil((Y0 - y)) / resolution;//indice du pixel sur l'ensemble
	let Y_phase_bg = J_tms_bg * resolution;//coordonnée du pixel en bas concerné


	if(Math.abs(X_phase_hd - x) < Math.abs(x - X_phase_hg)){
		X_phase_final = X_phase_hd;//coord X le plus proche
		I_phase_final = I_tms_hd;
	}
	else{
		X_phase_final = X_phase_hg;//coord X le plus proche
		I_phase_final = I_tms_hg;
	}
	
	if(Math.abs(Y_phase_hg - y) < Math.abs(y - Y_phase_bg)){
		Y_phase_final = Y_phase_hg;//coord Y le plus proche
		J_phase_final = J_tms_hg;
	}
	else{
		Y_phase_final = Y_phase_bg;//coord Y le plus proche
		J_phase_final = J_tms_bg;
	}

	let I_phase = I_phase_final % TileW;//indice I du pixel dans la tuile
	let J_phase = J_phase_final % TileH;//indice J du pixel dans la tuile

	return [I_phase, J_phase];
}

 /**
  * @function
  * @name indiceDalle
  * @description Renvoie coord HG de dalle auquel appartient
  * les coordoonées longitude altitude en paramètre
  * @param {int} X - latitude de l'utilisateur
  * @param {int} Y - longitude de l'utilisateur
  * @return {lst[int]} coordDalle - coordonées haut gauche de la dalle
  */
function indiceDalle(X, Y){
	let diff;
	let itteration;
	let Xdalle;
	let Ydalle;
	let coordDalle;
	
	//calcule de la coord X HG de la dalle
	diff = X - X0;
	itteration = Math.trunc(diff / MatrixW);
	Xdalle = X0 + (itteration * MatrixW);

	//calcule de la coord Y HG de la dalle
	diff = Y0 - Y;
	itteration = Math.trunc(diff / MatrixH);
	Ydalle = Y0 - (itteration * MatrixH);
	
	coordDalle = [Xdalle, Ydalle];
	
	console.log("coord dalle : " + coordDalle.toString());
	return coordDalle;
}

 /**
  * @function
  * @name indiceTuile
  * @description Renvoie indice de tuile 
  * en fonction d'indice de dalle
  * @param {int} X - abscisse du coin supérieur gauche de la dalle
  * @param {int} Y - ordonnee du coin supérieur gauche de la dalle
  * @return {lst[int]} indice - indice de la tuile
  */
function indiceTuile(X, Y){
	let colonne = ((X - X0) / (tilesPerWidth * TileW * resolution));
	let ligne = ((Y0 - Y) / (tilesPerHeight * TileH * resolution));
	
	let indice = [parseInt(colonne), parseInt(ligne)];
	
	console.log("coord tuile : " + indice.toString());
	return indice;
}

/**
  * @function
  * @name convert36
  * @description Renvoie indice de tuile en base 36 de taille 3 minimum
  * @param {int} X - indice de tuile
  * @param {int} Y - indice de la tuile
  * @return {lst[string]} indice - indice de la tuile en base 36
  */
function convert36(X, Y){
	X = X.toString(36);
	Y = Y.toString(36);

	//regarde si X est de taille 3 au mini
	if(X.length < 3){
		for(let i = 0; i < 2; i++){
			X = "0" + X;
		}
	}

	//Verifie si les deux var sont de la même taille
	if(X.length > Y.length){
		let diff = X.length - Y.length;
		
		for(let i = 0; i < diff; i++){
			Y = "0" + Y;
		}
	}

	else if(Y.length > X.length){
		let diff = Y.length - X.length;
		
		for(let i = 0; i < diff; i++){
			X = "0" + X;
		}
	}
	
	let indice36 = [X, Y];//TileOffsets
	
	return indice36;
}

/**
  * @function
  * @name createParse
  * @description Renvoie chemin de la dalle de tuile
  * @param {string} X - indice de tuile en base 36
  * @param {string} Y - indice de la tuile en base 36
  * @return {string} chemin - chemin du tif de la tuile
  */
function createParse(X, Y, level, format){
	let chemin = "PYRAMIDE" + "/" + "IMAGE" + "/" + level + "/" + X[X.length - 3] + Y[Y.length - 3] + "/" + X[X.length - 2] + Y[Y.length - 2] + "/" + X[X.length - 1] + Y[Y.length - 1] + "." + format;

	return chemin
}

/**
  * @function
  * @name coordToindice
  * @description Renvoie l'image tiff correspond au coordonee
  * @param {int} x - latitude en lambert 93
  * @param {int} y - longitude en lambert 94
  * @param {string} niveau - niveau de de la pyramide du mnt
  * @param {string} type - type du fichier chercher (png, tif...)
  * @return {string} chemin - chemin du tif de la tuile
  */
function coordToindice(x, y, niveau, type){
	//recherche de la dalle ou sont les coords
	//let res = searchIndiceCoord(x, y);

	//let Xdalle = res[0];
	//let Ydalle = res[1];

	//console.log(Xdalle);
	//console.log(Ydalle);
	
	let dalle = indiceDalle(x, y);
	let coordTuile = indiceTuile(dalle[0], dalle[1]);
	let resConvert = convert36(coordTuile[0], coordTuile[1]);
	
	Xtuile = resConvert[0];
	Ytuile = resConvert[1];
	
	console.log(Xtuile);
	console.log(Ytuile);
	
	let chemin = createParse(Xtuile, Ytuile, niveau, type);
	
	return chemin;
}

var Xparis = 652470.64;
var Yparis = 6862036.80;
//coord tuile de paris :
//159
//1252

//223 247 min max de X
//1327 1512 min max de Y
console.log(coordToindice(Xparis, Yparis, "8", "tif"));
console.log(convert36(225,1350));
console.log(indiceCoord(Xparis,Yparis));

module.exports = {

	indiceCoord : function(x,y){
		return indiceCoord(x,y);
	}
}
