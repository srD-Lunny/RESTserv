require('./config/config');

const mongo = require('mongoose');
const express = require('express');
const bodyp = require('body-parser');
const app = express();

//form-enconde
app.use(bodyp.urlencoded({ extended: false}));
app.use(bodyp.json()); //encode JSON
app.use(require('./routes/index'));

mongo.connect(process.env.DB_URI,
    { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true}
    ,(err, res) => {
    if(err) throw err;
    console.log('Conectado a la DB');
});

app.listen(process.env.PORT, () => {
    console.log("Escuchando en 3000");
});