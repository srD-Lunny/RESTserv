const mongo = require('mongoose');
const uValidator = require('mongoose-unique-validator');

let roles = {
    values : ['USER_ROLE', 'ADMIN_ROLE'],
    message : '{VALUE} no es un rol válido'
};

let Schema = mongo.Schema;

let userSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'Debes indicar un nombre']
    },
    correo: {
        type: String,
        unique: true,
        required: [true, 'Debes indicar un correo válido']
    },
    pass: {
        type: String,
        required: [true, 'Debes indicar una contraseña']
    },
    img: {
        type: String,
        required: false,
        default: 'no-photo.jpg'
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum : roles,
        required: [true, 'Debe indicar un rol']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.toJSON = function (){
    let user = this;
    userObject = user.toObject();
    delete userObject.pass;
    return userObject;
}

userSchema.plugin(uValidator, 
    { message : '{PATH} debe ser único' }
);

module.exports = mongo.model('Users', userSchema);