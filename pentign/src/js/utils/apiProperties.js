const algoZAT = require('../penteModule/algoZAT.js');
const algoHorn = require('../penteModule/algoHorn.js');
const search_coord = require('../search_coord.js');

module.exports = {

//fonction du choix de l'unité et de l'algoritme
        valProperties: function(valQuery,valeurInseree,valeurDefaut){
            if(valQuery == valeurInseree){
                return valeurInseree;
            }else{
                return valeurDefaut;
            }
        },

        //creation d'une matrice d'indice en fonction de coordonnée
        coordToPointMatrix : function (x,y) {
			let matrix = new Array();
			let X_Y = search_coord.indiceCoord(x,y)["indice_point"];

			let X_Y_hg = [X_Y[0] - 1, X_Y[1] - 1];
			let X_Y_h = [X_Y[0], X_Y[1] - 1];
			let X_Y_hd = [X_Y[0] + 1, X_Y[1] - 1];
			
			let X_Y_g = [X_Y[0] - 1, X_Y[1]];
			let X_Y_d = [X_Y[0] + 1, X_Y[1]];
			
			let X_Y_bg = [X_Y[0] - 1, X_Y[1] + 1];
			let X_Y_b = [X_Y[0], X_Y[1] + 1];
			let X_Y_bd = [X_Y[0] + 1, X_Y[1] + 1];
			
			matrix = [X_Y_hg, X_Y_h, X_Y_hd,
						 X_Y_g, X_Y, X_Y_d,
						 X_Y_bg, X_Y_b ,X_Y_bd];
            
            return matrix;
        },

        //creation d'un json pour un point
        jsonPoint:function (U_latitude, U_longitude, U_unit, U_algo, U_proj) {

            let geometry = {
				"latitude": U_latitude,
				"longitude": U_longitude
			};

			let unite = valProperties(U_unit,'prc','deg');
			let algo = valProperties(U_algo,'Horn','Zevenbergen and Thorne');
			let proj = valProperties(U_proj,'4326','2154');   

			let slope;
			let aspect;
			
			let matrix_indice = coordToPointMatrix(U_latitude, U_longitude);

			//let matrix_altitude = indiceToAlti(point); regarder chaque indice matrix_indice pour avoir une matrice altirude

            //algoritmes de pente
            // en attente : matrix
			// if (algo == 'Zevenbergen and Thorne') {
			// 	slope = algoZAT.compute(matrix,10)['slope'];
			// 	aspect = algoZAT.compute(matrix,10)['aspect'];
			// }
			// else if (algo == 'Horn'){
			// 	slope = algoHorn.compute(matrix,10)['slope'];
			// 	aspect = algoHorn.compute(matrix,10)['aspect'];
			// }

			// obtention des coordonnées images
			let coord_img = search_coord.indiceCoord(Xparis,Yparis);
			console.log("coordonnées dans l'image : " + coord_img[0] + ", " + coord_img[1]);

			let properties = {
				"algoritm" : algo,
				"unit" : unite,
				"projection" : proj
			};

			var outJSON = {
				"geometry":geometry,
				"properties":properties,
				"slope":slope,
				"aspect":aspect
				// "matrix":matrix
            };

            return outJSON;
            
        },

		// on passe de l'indice de l'image en altitude récupérée à partir de la tuile lue
        indiceToAlti: function(matrixIndice,buffer) {
            let matrix_alti = new Array();
            for(let i = 0 ; i < matrixIndice.length ; i++){
                matrix_alti[i] = buffer.readFloatLE(i*4);
            }
            return matrix_alti;
		},
		
		//matrice de coordonnées autour d'un point
		coordinateMatrix : function (x,y,ecart) {
			let matrix = new Array();
			matrix.push(search_coord.indiceCoord(x-1,y+1)['coord_point'])
			matrix.push(search_coord.indiceCoord(x,y+1)['coord_point'])
			matrix.push(search_coord.indiceCoord(x+1,y+1)['coord_point'])
			matrix.push(search_coord.indiceCoord(x-1,y)['coord_point'])
			matrix.push(search_coord.indiceCoord(x,y)['coord_point'])
			matrix.push(search_coord.indiceCoord(x+1,y)['coord_point'])
			matrix.push(search_coord.indiceCoord(x-1,y-1)['coord_point'])
			matrix.push(search_coord.indiceCoord(x,y-1)['coord_point'])
			matrix.push(search_coord.indiceCoord(x+1,y-1)['coord_point'])
			return matrix;
		}
    }