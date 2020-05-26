const express = require('express');
let Producto = require('../models/productos');
let { verifyRole, verifyToken } = require('../middleware/auth');
let app = express();

app.get('/producto', verifyToken, (req, res) => {
    Producto.find({ disp: true }, 
        'nombre precioUni desc categoria user',)
        .sort('desc')
        .populate('user', 'nombre correo')
        .exec((err, producto) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: err
                    }
                });
            }
            res.json({
                ok: true,
                producto
            });
        });
});

app.get('/producto/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id, (err, producto) =>{
        if(err){
            return res.status(500).json({
                ok: false,
                err:{
                    message: err
                }
            });
        }
        if(!producto){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró el producto en cuestión'
                }
            });
        }
        res.json({
            ok: true,
            producto
        });
    });
});

app.get('/producto/buscar/:termino', verifyToken, (req, res) => {
    let termino = req.params.termino;
    let regex = RegExp(termino, 'i');
    Producto.find({nombre: regex}, (err, producto) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err:{
                    message: err
                }
            });
        }
        if(!producto){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró el producto en cuestión'
                }
            });
        }
        res.json({
            ok: true,
            producto
        });
    })
})

app.post('/producto', [verifyToken, verifyRole], (req, res) => {
    let body = req.body;
    let product = new Producto({
        nombre: body.nombre,
        precioUni: body.precio,
        desc: body.desc,
        categoria: body.catego,
        user: req.user._id
    });
    product.save((err, producto) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err:{
                    message: err
                }
            });
        }
        if(!producto){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se añadio el producto'
                }
            });
        }
        res.json({
            ok: true,
            producto
        });
    });
});

app.put('/producto/:id', [verifyToken, verifyRole], (req, res) => {
    let body = req.body;
    let id = req.params.id;
    let product = {
        nombre: body.nombre,
        precioUni: body.precio,
        desc: body.desc,
        categoria: body.catego,
        disp: body.disp
    };
    Producto.findByIdAndUpdate(id, product, { new: true, runValidators: true }, (err, producto) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err:{
                    message: err
                }
            });
        }
        if(!producto){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se actualizó el producto'
                }
            });
        }
        res.json({
            ok: true,
            producto
        });
    });
});

app.delete('/producto/:id', [verifyToken, verifyRole], (req, res) => {
    let id = req.params.id;
    Producto.findByIdAndRemove(id, (err, producto) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err:{
                    message: err
                }
            });
        }
        if(!producto){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se actualizó el producto'
                }
            });
        }
        res.json({
            ok: true,
            producto
        });
    });
});

module.exports = app;