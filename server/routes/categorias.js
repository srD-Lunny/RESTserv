const express = require('express');
let Catego = require('../models/categorias');
let { verifyToken, verifyRole } = require('../middleware/auth');
let app = express();

app.get('/categoria', verifyToken, (req, res) => {
    Catego.find({}, 'desc user')
        .sort('desc')
        .populate('user', 'nombre correo')
        .exec((err, catDocs) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: err
                    }
                });
            }
            res.json({
                ok: true,
                categorias: catDocs
            });
        });
});

app.get('/categoria/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    Catego.findById(id, (err, categoria) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err: {
                    message: err
                }
            });
        }
        if(!categoria){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró la categoria'
                }
            });
        }
        res.json({
            ok: true,
            categoria
        });
    });
});

app.post('/categoria', [verifyToken, verifyRole], (req, res) => {
    let body = req.body;
    let catego = new Catego({
        desc: body.desc,
        user: req.user._id
    });
    catego.save((err, categoria) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err: {
                    message: err
                }
            });
        }
        if(!categoria){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se pudo añadir la categoria'
                }
            });
        }
        res.json({
            ok: true,
            categoria
        });
    });
});

app.put('/categoria/:id', [verifyToken, verifyRole], (req, res) => {
    let id = req.params.id;
    let newCat = { desc: req.body.desc };
    Catego.findByIdAndUpdate(id, newCat, {new: true, runValidators: true}, (err, categoria) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err: {
                    message: err
                }
            })
        }
        if(!categoria){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se actualizó la categoria'
                }
            });
        }
        res.json({
            ok: true,
            categoria
        });
    })
});

app.delete('/categoria/:id', [verifyToken, verifyRole], (req, res) => {
    let id = req.params.id;
    Catego.findByIdAndRemove(id, (err, categoria) => {
        if(err){
            res.status(500).json({
                ok: false,
                err: {
                    message: err
                }
            });
        }
        if(!categoria){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se pudo eliminar la categoria'
                }
            });
        }
        res.json({
            ok: true,
            categoria
        });
    });
});

module.exports = app;