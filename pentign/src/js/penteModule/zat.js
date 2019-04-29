
// function zat_algoritm(x,y,z,image){

// }


function zat_algoritm(image){
    var i = 1
    var j = 1

    var z = image['image'][i][j];
    var l = 10;

    var g = (-image['image'][i][j-1]+image['image'][i][j+1])/(2*l);
    var h = (image['image'][i-1][j]-image['image'][i+1][j])/(2*l);

    var slope = Math.sqrt((g**2+h**2));
    var slope_angle = Math.atan(slope) * 180 / Math.PI;
    var aspect = Math.atan(-h/-g) * 180 / Math.PI + 180;

    //orientation par rapport au nord
    // if(aspect < 0){
    //     aspect += 360; 
    // }

    // console.log(g);
    // console.log(h);
    // console.log(slope);

    // console.log("angle de la pente : " + slope_angle);
    // console.log("orientation par rapport à l'axe x : " + aspect);
}

var image = {
    "image":[
        [10,20,25],
        [22,23,25],
        [20,24,18]
    ]
};

zat_algoritm(image);

var image2 = {
    "image":[
        [3,2,1],
        [3,2,1],
        [3,2,1]
    ]
}

zat_algoritm(image2);