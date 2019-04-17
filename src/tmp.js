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
<level>
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
var X0 = -0.5; //coord
var Y0 = 12000000.5;
var TileW = 256; //taille de la tuile
var TileH = 256;
var MatrixW = 4000; //nombre de pixel en largeur
var MatrixH = 23000; // nombre de pixel largeur
var imageWidth = 16; //nb de tuile dans la hauteur de la dalle
var imageHeight = 16;
var pathDepth = 2; //profondeur arborescence


function coordDalle(X, Y){
	let colonne = ((X - X0) / (imageWidth * TileW * resolution));
	let ligne = ((Y0 - Y) / (imageHeight *TileH * resolution));

	return [parseInt(colonne), parseInt(ligne)];
}


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
	return [X, Y];
}

function createParse(coord, level, format){
	let X = coord[0];
	let Y = coord[1];
	let chemin = "PYRAMIDE" + "/" + "IMAGE" + "/" + level + "/" + X[X.length - 3] + Y[Y.length - 3] + "/" + X[X.length - 2] + Y[Y.length - 2] + "/" + X[X.length - 1] + Y[Y.length - 1] + "." + format;

	return chemin
}

// C3L3C2L2 / C1L1 / C0L0.tif

var X = coordDalle(667902.49, 6848097.42)[0];
var Y = coordDalle(667902.49, 6848097.42)[1];

console.log(X);
console.log(Y);

console.log(X.toString(36));
console.log(Y.toString(36));

console.log(convert36(X, Y));

console.log(createParse(convert36(X,Y), "8", "tif"));

