//>>>>>>>>>>>>>>>>>>PORT<<<<<<<<<<<<<<<<<<<//

process.env.PORT = process.env.PORT || 3000;

//>>>>>>>>>>>>>>>>Entorno<<<<<<<<<<<<<<<<<<//

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//>>>>>>>>>>>>>>>>>>>DB<<<<<<<<<<<<<<<<<<<<//

let dbc = '';

//if(process.env.NODE_ENV === 'dev'){
//    dbc = 'mongodb://localhost:27017/cafecel';
//}
//else{
    dbc = 'mongodb+srv://SrDLunny:MIMaduVVUXuJegB1@cluster0-uvjw4.mongodb.net/cafesel';
//}

process.env.DB_URI = dbc;