const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(process.env.CLIENT_ID);

const app = express();

let User = require('../models/Usuarios');
//google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        correo: payload.email,
        img: payload.picture,
        google: true
    }
}  

//rutas
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

app.post('/google', async (req, res) => {
    let tokenG = req.body.idtoken;
    let googleUser = await verify(tokenG)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err:{
                    message: e
                }
            });
        });
    User.findOne({correo: googleUser.correo}, (err, userDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err: {
                    message: err
                }
            });
        }
        if(userDB){
            if(userDB.google === true){
                let token = jwt.sign(
                    { user: userDB }, 
                    process.env.TOKEN_SEED, 
                    { expiresIn: process.env.TOKEN_EXP }
                );
                res.json({
                    ok: true,
                    token
                });
            }
            else{
                res.status(500).json({
                    ok: false,
                    err:{
                        message: 'Debes autenticarte con tus credenciales'
                    }
                });
            }
        }
        else{
            let user = new User();
            user.nombre = googleUser.nombre;
            user.correo = googleUser.correo;
            user.img = googleUser.img;
            user.google = true;
            user.pass = ':)uwu>w<:3';
            user.save((err, userSave) => {
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err: {
                            message: err
                        }
                    });
                }
                let token = jwt.sign(
                    { user: userSave }, 
                    process.env.TOKEN_SEED, 
                    { expiresIn: process.env.TOKEN_EXP}
                );
                return res.json({
                    ok: true,
                    usuario: userSave,
                    token
                });
            });
        }
    });
});

module.exports = app;