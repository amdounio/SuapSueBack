const {
    User,
    resetToken,
    hashtag,
    product,
    comment

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
    addComment:async(req,res)=>{
        const userId = req.body.userId
        const productId = req.body.productId
        try {
            console.log(userId,productId);
            const finduser= await User.findOne({
                where:{id : userId}
            })
            if (!finduser) {
                res.status(401).json({error:"user not found"})
            }
            const findproduct = await product.findOne({
                where:{id:productId}
            })
            if (!findproduct) {
                res.status(401).json({error:"user not found"})
            }
            const comments = {
                comment : req.body.comment,
                userId : userId,
                productId: productId
            }
            const addComment = await comment.create(comments)
            if (addComment) {
                const findComment = await comment.findOne({
                    where:{id : addComment.id},
                    include : [
                        {
                            model : User,
                            as : "user"
                        }
                    ]

                })
                res.status(200).json({msg:"comment added", findComment})
            }
            
        } catch (error) {
            res.status(500).json({error:"Internal server Error!"})
        }
    },


    getAllProductComment: async (req,res)=>{
        const productId = req.params.id
        try {
            const findproduct = await product.findOne({
                where:{id:productId}
            })
            if (!findproduct) {
                res.status(401).json({error:"product not found"})
            }
            const comments = await comment.findAll({
                where : {productId:productId},

                include : [
                    {
                        model : User,
                        as : "user"
                    }
                ]
            })
            if (comments) {
                console.log(comments);
                res.status(200).json({comments})
                
            }
        } catch (error) {
            res.status(500).json({error:"Internal server Error!"})
        }
    }
}