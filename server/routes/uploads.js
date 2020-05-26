const express = require('express');
const fileUp = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();
const User = require('../models/Usuarios');
const Prod = require('../models/productos');

app.use(fileUp());

let extensiones = ['png', 'jpg', 'jpeg', 'gif'];
let tipos = ['productos', 'user'];

app.put('/uploads/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if(!req.files || Object.keys(req.files).length === 0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se han subido archivos'
            }
        });
    }

    let imagen = req.files.imagen;
    let splitName = imagen.name.split('.');
    let extension = splitName[splitName.length - 1]; //se obtiene el ultimo elemento

    if(extensiones.indexOf(extension) < 0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Extension no valida'
            }
        });
    }

    if(tipos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El tipo no es permitido'
            }
        });
    }

    let archivo = `${id}-${new Date().getMilliseconds()}-26145.${extension}`;

    imagen.mv(`uploads/${tipo}/${archivo}` , (err) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if(tipo == 'productos'){
            imageProduct(id, res, archivo);
        }
        else{
            imageUser(id, res, archivo);
        }
        
    });
});

module.exports = app;

function imageUser(id, res, archivo){
    User.findById(id, (err, userDB) => {
        if(err){
            deleteArchivo(archivo, 'user');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!userDB){
            deleteArchivo(archivo, 'user');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }
        userDB.img = archivo;
        userDB.save((err, newUser) => {
            if(err){
                deleteArchivo(archivo, 'user');
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                user: newUser
            });
        });
    });
}

function imageProduct(id, res, archivo){
    Prod.findById(id, (err, prodDB) => {
        if(err){
            deleteArchivo(archivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!prodDB){
            deleteArchivo(archivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }
        prodDB.img = archivo;
        prodDB.save((err, newProd) => {
            if(err){
                deleteArchivo(archivo, 'productos');
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: newProd
            });
        });
    });
}

function deleteArchivo(archivo, tipo){
    pathImage = path.resolve(__dirname, `../../uploads/${tipo}/${archivo}`);
    if(fs.existsSync(pathImage)){
        fs.unlinkSync(pathImage);
    }
}