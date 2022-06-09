const {
    User,
    resetToken,
    hashtag,
    product,
    comment,
    reviews

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
module.exports={
    addReview : async (req,res)=>{
        const userId = req.body.userId
        const productId = req.body.productId
        try {
            const userfind = await User.findOne({
                where : {id : userId}
            })
            if (!userfind) {
                res.status(401).json({error:"this user is not found"})
            }
            const prodfind = await product.findOne({
                where:{id:productId}
            })
            if (!prodfind) {
                res.status(401).json({error:"this product not found"})
            }
            const data = {
                review : req.body.review,
                rate : req.body.rate,
                userId : userId,
                productId : productId
            }
            const addreview = await reviews.create(data)

            if (addreview) {
                const findReview = await reviews.findOne({
                    where:{id : addreview.id},
                    include : [
                        {
                            model : User,
                            as : "user"
                        }
                    ]

                })
                res.status(200).json({msg:"review added",findReview})
            }
        } catch (error) {
            res.status(500).json({error:"Internal server Error!"})
        }
    },

    getAllReviews : async (req,res) =>{
        const productId = req.params.id
        try {
            const findproduct = await product.findOne({
                where:{id:productId}
                
            })
            if (!findproduct) {
                res.status(401).json({error:"product not found"})
            }
            const review = await reviews.findAll({
                where : {productId:productId},
                include : [
                    {
                        model : User,
                        as : "user"
                    }
                ]
            })
            if (review) {
                res.status(200).json({review})
            }
        } catch (error) {
            res.status(500).json({error:"Internal server Error!"})
        }
    }
}