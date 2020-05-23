//>>>>>>>>>>>>>>>>>>PORT<<<<<<<<<<<<<<<<<<<//

process.env.PORT = process.env.PORT || 3000;

//>>>>>>>>>>>>>>>>Entorno<<<<<<<<<<<<<<<<<<//

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//>>>>>>>>>>>>>>>>>>SEED<<<<<<<<<<<<<<<<<<<//

process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'la-Libertad-n0-es-Una-Palabra';

//>>>>>>>>>>>>>>>>Expires<<<<<<<<<<<<<<<<<<//

process.env.TOKEN_EXP = '24h';

//>>>>>>>>>>>>>>>>>>>DB<<<<<<<<<<<<<<<<<<<<//

let dbc = '';

if(process.env.NODE_ENV === 'dev'){
    dbc = 'mongodb://localhost:27017/cafecel';
}
else{
    dbc = process.env.ATLAS_URI; //variable de entorno heroku
}

process.env.DB_URI = dbc;

//>>>>>>>>>>>>>>>>Google ID<<<<<<<<<<<<<<<<//

process.env.CLIENT_ID = process.env.CLIENT_ID || '963085719753-g592cn6ul43pakth3ffj9spsv21m9osc.apps.googleusercontent.com';