const algoZAT = require('../penteModule/algoZAT.js');
const algoHorn = require('../penteModule/algoHorn.js');
const search_coord = require('../search_coord.js');

module.exports = {

		/**
		 * @function
		 * @name coordToPointMatrix
		 * @description une matrice d'indice pour la lecture de la tuile est créée en fonction des coordonnées géographiques renseignées
		 * @param {float} x coordonnée x
		 * @param {float} y coordonnée y
		 * @returns {Array([int,int])} matrice d'indice de l'image (position du pixel entre 0 et 256)
		 */
		
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

		/**
		 * @function
		 * @name indiceToAlti
		 * @description renvoie une matrice 9 x 9 des valeur de pente pour calculer la pente du point sélectionné, on passe de l'indice de l'image en altitude récupérée à partir de la tuile lue
		 * @param {Array([int,int])} matrixIndice 9 indices pour récupérer les valeurs de pixel sous forme de matrice 
		 * @param {Buffer} buffer buffer qui comprend la tuile
		 * @returns {Array(float)} liste des altitudes de taille 9
		 * 
		 */
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
		 * @returns {Array(float)} liste de coordonnées des points de la matrice
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

		/**
		 * @function
		 * @name valProperties 
		 * @description insersion des propriétés de l'API dans l'url
		 * @param {String} valQuery valeur de requete insérée dans l'url (req.query.nomVariable)
		 * @param {String} valeurInseree valeur de la requete à renseigner
		 * @param {String} valeurDefaut valeur par defaut si le paramètre n'est pas renseigné dans l'url
		 * @returns {String} valeur de paramètre choisi par l'utilisateur en sortie
		 */
        valProperties: function(valQuery,valeurInseree,valeurDefaut){
            if(valQuery == valeurInseree){
                return valeurInseree;
            }else{
                return valeurDefaut;
            }
        }		

    }