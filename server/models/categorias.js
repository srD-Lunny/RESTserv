const mongo = require('mongoose');
let Schema = mongo.Schema;

let category = new Schema({
    desc : {
        type: String,
        unique: true,
        required: [true, 'Debe ser una descripción única']
    },
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'Users'
    }
});

module.exports = mongo.model('Categorias', category);