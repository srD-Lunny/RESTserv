const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

let User = require('../models/Usuarios');

app.post('/login', (req, res) => {

    let body = req.body;

    User.findOne({correo: body.correo}, (err, userDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!userDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario y / o contraseña incorrectos'
                }
            });
        }

        if(!bcrypt.compareSync(body.pass, userDB.pass)){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario y/o contraseña incorrectos'
                }
            });
        }

        let token = jwt.sign({
            user: userDB
        }, process.env.TOKEN_SEED,
        { expiresIn: process.env.TOKEN_EXP });

        res.json({
            ok: true,
            user: userDB,
            token
        });
    });
});






module.exports = app;