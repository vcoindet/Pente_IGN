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
				let imgIndice = ((256 * (matrixIndice[i][1] - 1)) + matrixIndice[i][0] ) *4 ;
				matrix_alti[i] = buffer.readFloatLE(imgIndice);
			}
            return matrix_alti;
		},
		
		//matrice de coordonnées autour d'un point
		/**
		 * @function
		 * @name coordinateMatrix
		 * @description revoie les coordonnées des 8 points de la matrice utilisés pour calculer la pente autour d'un point
		 * @param {float} x - coordonnée x du point
		 * @param {float} y - coordonnée y du point
		 * @returns {[float],[float]} liste de coordonnées des points de la matrice
		 * 
		 */
		coordinateMatrix : function (x,y) {
			let matrix = new Array();
			let coord_point = 'coord_point';
			matrix.push(search_coord.indiceCoord(x-1,y+1)[coord_point]);
			matrix.push(search_coord.indiceCoord(x,y+1)[coord_point]);
			matrix.push(search_coord.indiceCoord(x+1,y+1)[coord_point]);
			matrix.push(search_coord.indiceCoord(x-1,y)[coord_point]);
			matrix.push(search_coord.indiceCoord(x,y)[coord_point]);
			matrix.push(search_coord.indiceCoord(x+1,y)[coord_point]);
			matrix.push(search_coord.indiceCoord(x-1,y-1)[coord_point]);
			matrix.push(search_coord.indiceCoord(x,y-1)[coord_point]);
			matrix.push(search_coord.indiceCoord(x+1,y-1)[coord_point]);
			return matrix;
		},

		/**
		 * 
		 * @function
		 * @name lineLength
		 * @description calcule la longueur d'une polyligne formée par une liste de points
		 * @param {[float,float]} pt_list - liste de points sous forme de coordonnées x y
		 * @returns longueur totale de la polyligne
		 * 
		 */
		//calcule la longueur d'une polyligne
		lineLength:function (pt_list) {
			let length_polyline = 0;
			for(let i = 0; i < pt_list.length-1 ;i++){
                let l = (pt_list[i+1][0] - pt_list[i][0])**2;
                let h = (pt_list[i+1][1] - pt_list[i][1])**2;
                length_polyline += Math.sqrt(l+h);
			}
			return length_polyline;
		},

		//division d'une polyligne en plusieurs points
		pointsPolyline : function (pt_debut,pt_fin,precision) {

			let new_list_geom = new Array();
			let nb_point = this.lineLength([pt_debut,pt_fin]) / precision;

			let longueur_x = Math.abs(pt_fin[0] - pt_debut[0]);
			let longueur_y = Math.abs(pt_fin[1] - pt_debut[1]);
			
			let ecart_pt_x = longueur_x / nb_point;
			let ecart_pt_y = longueur_y / nb_point;
			
			for(let i = 0;i < nb_point ;i++){
                new_list_geom.push([pt_debut[0] + ecart_pt_x * i, pt_debut[1] + ecart_pt_y * i]);
			}
			
			new_list_geom.push([pt_fin[0],pt_fin[1]]);

			return new_list_geom;
		}

    }