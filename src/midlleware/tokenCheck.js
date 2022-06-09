const {
    User,
    resetToken

} = require("../database/relations");

const env = process.env.NODE_ENV || 'production'
const {
    DB_DATABASE,
    DB_USER,
    DB_PASS,
    DB_HOST,
    DB_DIALECT,
    BD_HOST,

} = require(`../../.${env}.js`)
require('dotenv').config()
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const { ok } = require("assert");
const { SECRET } = require("../../.development");
const mailUtils = require("../importantServices/mail.utils");
const jwtUtils = require("../importantServices/jwt.utils");
const constantes = require("../../config/constantes");
const request = require('request');
const { Op, Sequelize } = require("sequelize");
const { constants } = require("buffer");

module.exports = {
    checkExpireToken: async(req,res)=>{
        const token= req.body.token
        try {

            if (token){
                const decodeToken = jwt.decode(token)
                console.log(decodeToken);
                if (Date.now()>= decodeToken.exp*1000) {
                    res.status(401).json({tokenExpired:"your session is expired please try to login"})
                }
            }
            


        } catch (error) {
            res.status(500).json({error:'internal server error!'})
        }
    }
}