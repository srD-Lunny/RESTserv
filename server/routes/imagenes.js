const express = require('express');
const fs = require('fs');
const path = require('path');
const { verifyTokenUrl } = require('../middleware/auth');

let app = express();

app.get('/imagenes/:tipo/:img', verifyTokenUrl, (req, res) => {
    let img = req.params.img;
    let tipo = req.params.tipo;

    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    let imagen;
    if(fs.existsSync(pathImg)){
        imagen = pathImg;
    }
    else{
        imagen = path.resolve(__dirname, '../assets/no-image.jpg');
    }
    res.sendFile(imagen);
});


module.exports = app;