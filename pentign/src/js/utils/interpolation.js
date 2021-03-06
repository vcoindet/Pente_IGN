 /**
  * @function
  * @name coeff_droite
  * @description Renvoie l'équation d'une droite
  * @param {int} x1 - coord en lambert 93
  * @param {int} y1 - coord en lambert 93
  * @param {int} x2 - coord en lambert 93
  * @param {int} x2 - coord en lambert 93
  * @return {lst[int]} indice - coefficient et ordonnée à l'origine
  */
function coeff_droite(x1, y1, x2, y2){
	let coef = (x2 - x1) / (y2 - y1);

	let ord_orig = y1 - (x1 * coef);
	
	return [coef, ord_orig];
}

 /**
  * @function
  * @name interpollation_point
  * @description Renvoie l'interpolation d'un point
  * @param {int} x1 - coord en lambert 93
  * @param {int} y1 - coord en lambert 93
  * @param {int} x2 - coord en lambert 93
  * @param {int} x2 - coord en lambert 93
  * @param {int} xi - coord en lambert 93
  * @return {lst[int]} indice - Renvoie l'interpolation y d'un point
  */
function interpollation_y(x1, y1, x2, y2, xi){
	let yi = y1 + ((y2 - y1) * ((xi - x1) / (x2 - x1)));
	return yi;
}


 /**
  * @function
  * @name interpollation_point
  * @description Renvoie une liste 
  * @param {int} x1 - coord en lambert 93
  * @param {int} y1 - coord en lambert 93
  * @param {int} x2 - coord en lambert 93
  * @param {int} x2 - coord en lambert 93
  * @param {int} nb_point - nombre de point voulue
  * @return {[int]} liste_point - Liste de point interpollé entre
  * le point 1 et le point 2
 */
function liste_point(x1, y1, x2, y2, nb_point){
	let equation = coeff_droite(x1, y1, x2, y2);
	let coef = equation[0];
	let ord_orig = equation[1];
	
	let diff = Math.abs(x2 - x1);
	let pas = Math.floor(diff / nb_point);
	
	let liste_point = new Array();
	let new_x;
	let new_y;
	let xmin;
	let xmax;
	let ymin;
	let ymax;
	
	if(x1 < x2){
		xmin = x1;
		xmax = x2;
		ymin = y1;
		ymax = y2;
	}
	else{
		xmin = x2;
		xmax = x1;
		ymin = y2;
		ymax = y1;
	}
	
	liste_point.push([xmin, ymin]);

	for(let i = pas; i < diff;i =  i + pas){
		new_x = xmin + i;
		new_y = interpollation_y(x1, y1, x2, y2, new_x);
		liste_point.push([new_x, new_y]);
	}

	liste_point.push([xmax, ymax]);

	return liste_point;
}

module.exports = {
	liste_point:function (x1, y1, x2, y2, nb_point) {
		return liste_point(x1, y1, x2, y2, nb_point);
	}

}
