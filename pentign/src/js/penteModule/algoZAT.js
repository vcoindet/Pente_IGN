
// function zat_algoritm(x,y,z,image){

// }
// l'algorithme de Zevenbergen and Throne propose un modèle quadratique


function zat_algoritm(image,taille_pixel){
    var i = 1
    var j = 1

    var z = image['image'][i][j];
    var Z2 = image['image'][i-1][j];
    var Z4 = image['image'][i][j-1];
    var Z6 = image['image'][i][j+1];
    var Z8 = image['image'][i+1][j];

    var G = (-Z4+Z6)/(2*taille_pixel);
    var H = (Z2-Z8)/(2*taille_pixel);

    var slope = Math.sqrt(G**2+H**2)
    var slope_angle = Math.atan(slope) * 180 / Math.PI;
    var aspect = Math.atan(H/G) * 180 / Math.PI;

    return {"slope":slope_angle,
            "aspect":aspect
        };
}

var image = {
    "image":[
        [10,20,25],
        [22,23,25],
        [20,24,18]
    ]
};

var image2 = {
    "image":[
        [1,45,3],
        [30,2,30],
        [1,10,3]
    ]
}

console.log(image2);

console.log( "pente:" + zat_algoritm(image2,10)["slope"]);

module.exports = {
    compute : function(matrix,pixelSize){
        return zat_algoritm(matrix,pixelSize);
    }
}