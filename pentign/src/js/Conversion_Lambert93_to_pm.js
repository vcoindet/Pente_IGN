 

function Lambert93toWgs84(x,y) {

    let b8 = 1 / 298.257222101;
    let b10 = Math.sqrt(2 * b8 - b8 * b8);
    let b16 = 0.7256077650532670;
    x = x- 700000;
    y = y-  12655612.0499;
    let gamma = Math.atan(-x / y);
	let latiso = Math.log(11754255.426096 / Math.sqrt((x * x) + (y * y))) / b16;
	let sinphiit = Math.tanh(latiso + b10 * Math.atanh(b10 * Math.sin(1)));

	for (i = 0; i != 6 ; i++) {
		sinphiit = Math.tanh(latiso + b10 * Math.atanh(b10 * sinphiit));
    }
    
    let longitude = (gamma / b16 + 3 / 180 * Math.PI) / Math.PI * 180;
    let latitude = Math.asin(sinphiit) / Math.PI * 180;
	return [longitude, latitude];
}




