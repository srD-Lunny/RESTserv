const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();
const {verifyToken, verifyRole} = require('../middleware/auth');
let User = require('../models/Usuarios');

app.get('/user', verifyToken, (req, res) => {

    let from = req.query.from || 0;
    let limit = req.query.limit || 5;

    from = Number(from);
    limit = Number(limit);

    User.find({estado: true}, 'nombre correo img role estado google')
        .skip(from)
        .limit(limit)
        .exec((err, usuarios) => {
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
                cantidad: usuarios.length,
                usuarios
            });
        });
});

app.post('/user', [verifyToken,verifyRole], (req, res) => {
    let body = req.body;

    usuario = new User({
        nombre: body.nombre,
        correo: body.correo,
        pass: bcrypt.hashSync(body.pass, 10),
        role: body.role
    });

    usuario.save((err, userDB) => {
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
            user: userDB
        });
    });
});

app.put('/user/:id', [verifyToken, verifyRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'correo', 'img', 'role', 'estado']);
    //req.body;
    User.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, userDB) => {
        if(err){
            return res.status(400).json({
                of: false,
                err: {
                    message: err
                }
            });
        }
        
        res.json({
            ok: true,
            user: userDB
        });
    });
});

app.delete('/user/:id', [verifyToken, verifyRole], (req, res) => {
    let id = req.params.id;
    let status = {
        estado: false
    }
    //User.findByIdAndRemove(id, (err, userDel) => {
    User.findByIdAndUpdate(id, status, {new: true}, (err, userDel) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err: {
                    message: err
                }
            });
        }
        if(!userDel){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró el usuario'
                }
            });
        }
        res.json({
            ok: true,
            usuario: userDel
        });
    });
});

module.exports = app;