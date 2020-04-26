require('./config/config');
const express = require('express');
const bodyp = require('body-parser');
const app = express();

//form-enconde
app.use(bodyp.urlencoded({ extended: false}));
app.use(bodyp.json()); //encode JSON

app.get('/user', (req, res) => {
    res.json('It works GET');
});

app.post('/user', (req, res) => {

    let body = req.body;
    if(body.nombre === undefined){
        res.status(400).json({
            ok: false,
            message: 'Ausencia de nombre de Usuario'
        });
    }
    else{
        res.json({
            user: body
        });
    }
});

app.put('/user/:id', (req, res) => {
    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/user', (req, res) => {
    res.json('It works DELETE');
});

app.listen(process.env.PORT, () => {
    console.log("Escuchando en 3000");
});