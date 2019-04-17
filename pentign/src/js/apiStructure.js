
const express = require('express')
const app = express();
const penteModule = require('./penteModule/penteModule.js');

app.get('/', function (req, res) {
  let x = req.query.x;
  let y = req.query.y;
  let pente = penteModule.computeSlope(x,y);
  let orient = penteModule.computeAspect(x,y);
  res.json({
    "pente":pente,
    "orientation":orient
  });
});

app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
  });