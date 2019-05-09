const algoZAT = require('../penteModule/algoZAT.js');
const algoHorn = require('../penteModule/algoHorn.js');

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
            let X_Y = search_coord.indiceCoord(x,y);
			
			let X_Y_hg = [X_Y[0] - 1, X_Y[1] - 1];
			let X_Y_h = [X_Y[0], X_Y[1] - 1];
			let X_Y_hd = [X_Y[0] + 1, X_Y[1] - 1];
			
			let X_Y_g = [X_Y[0] - 1, X_Y[1]];
			let X_Y_d = [X_Y[0] + 1, X_Y[1]];
			
			let X_Y_bg = [X_Y[0] - 1, X_Y[1] + 1];
			let X_Y_b = [X_Y[0], X_Y[1] + 1];
			let X_Y_bd = [X_Y[0] + 1, X_Y[1] + 1];
			
			let matrix = {
				"image": [[X_Y_hg, X_Y_h, X_Y_hd]
						 [X_Y_g, X_Y, X_Y_d]
						 [X_Y_bg, X_Y_b ,X_Y_bd]]
            };
            
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

			let properties = {
				"algoritm" : algo,
				"unit" : unite,
				"projection" : proj
			};

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


			var outJSON = {
				"geometry":geometry,
				"properties":properties,
				"slope":slope,
				"aspect":aspect,
				"matrix":matrix
            };

            return outJSON;
            
        }

    }