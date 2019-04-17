
const express = require('express')
const app = express();
const penteModule = require('./penteModule/penteModule.js');
const conversion = require ('./conversion/Convert_Lambert_Modul.js');

app.get('/', function (req, res) {
  let x = req.query.x;
  let y = req.query.y;
  let pente = penteModule.Horn_algo(mat,taille_pixel);// données en entrées à modifier
  let orient = penteModule.Zar_algo(image); // données en entrées à modifier
  res.json({
    "pente":pente,
    "orientation":orient
  });
});
app.get('/conversion', function (req, res) {
  let latitude = req.query.latitude;
  let longitude = req.query.longitude;
  let result = conversion.PM_to_Lambert(latitude,longitude);
  res.json(result); 
    

});
app.get('/conversion', function (req, res) {
  let x = req.query.x;
  let y = req.query.y;
  let result2 = conversion.Lambert_to_pm(x,y);
  res.json(result2); 
    

});

app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
  });