const {
    User,
    resetToken,
    hashtag,
    product,
    comment,
    reviews,
    artType,
    trackType

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
    addType: async (req, res) => {
        try {
            const data = {
                type: req.body.type
            }
            const addType = await trackType.create(data)
            if (addType) {
                res.status(200).json({ msg: "this type is added", addType })
            }
        } catch (error) {
            res.status(500).json({ error: "Internal server Error !! " })
        }
    },
    deleteType: async (req, res) => {
        const id = req.params.id
        console.log(id);
        try {
            const findType = await trackType.findOne({
                where: { id: id }
            })
            if (findType) {
                console.log(findType);
                await findType.destroy()
                res.status(200).json({ msg: "this type is deleted" })
            }
        } catch (error) {
            res.status(500).json({ error: "Internal server Error !! " })
        }
    },
    getAllartType: async (req, res) => {
        try {
            const trackTypes = await trackType.findAll()
            console.log(trackTypes)
            if (trackTypes) {
                res.status(200).json({ trackTypes })
            }
        } catch (error) {
            res.status(500).json({ error: "Internal server Error !! " })
        }
    },

    getAllartTypeLimit: async (req, res) => {
        try {
            const trackTypes = await trackType.findAll({ limit: 5 })
            console.log(trackTypes)
            if (trackTypes) {
                res.status(200).json({ trackTypes })
            }
        } catch (error) {
            res.status(500).json({ error: "Internal server Error !! " })
        }
    }
}