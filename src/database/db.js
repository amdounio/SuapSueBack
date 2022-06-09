const { Sequelize } = require('sequelize');
require('dotenv').config()
const env = process.env.NODE_ENV || 'production'
//const hggg =require('../../.devlopment')
const { DB_DATABASE, DB_USER, DB_PASS, DB_HOST, DB_DIALECT } = require(`../../.${env}.js`)
const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASS, {
    host: DB_HOST,
    dialect: DB_DIALECT,
    define: { engine: 'MYISAM' }
});
sequelize.authenticate().then(() => { console.log('Connecté avec succès.'); })
    .catch(e => {

        console.error('Erreur de connection au serveur:', e);
    });


module.exports = sequelize;