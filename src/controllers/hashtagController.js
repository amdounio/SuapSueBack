const {
    User,
    resetToken,
    hashtag

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

module.exports ={
    addHashtag : async (req,res)=>{
        global.hashtag
        const hashtags = req.body.name;
        if (hashtags){
            this.hashtag ={
                name : hashtags
            }

            await hashtag.create(this.hashtag)
            res.status(200).json({msg :"hashtag created succesfully!!"})


        }
    },

    getallhashtags: async(req, res) => {
        try {
            const hashtags = await hashtag.findAll();
            if (hashtags) {
                const count = await hashtag.count()
                res.status(200).json({ hashtags, count });
            }
        } catch (err) {
            res.status(500).json({ err: "Internal Server Error  : " + err });
        }
    },

    getOneHashtagById: async(req, res) => {
        try {

            const hashtags = await hashtag.findAll({
                where: {
                    id: req.params.id,
                }
            });
            if (hashtags) {
                res.status(200).json({ hashtag: hashtags[0] });
            }
        } catch (err) {
            res.status(500).json({ err: "Internal Server Error : " + err });
        }
    },
}