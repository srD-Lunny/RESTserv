var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productoSchema = new Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre es necesario'] 
    },
    precioUni: { 
        type: Number, 
        required: [true, 'El precio únitario es necesario'] 
    },
    desc: { 
        type: String, 
        required: false 
    },
    disp: { 
        type: Boolean, 
        required: true, 
        default: true 
    },
    categoria: { 
        type: Schema.Types.ObjectId, 
        ref: 'Categorias', 
        required: true 
    },
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'Users' 
    }
});

module.exports = mongoose.model('Productos', productoSchema);