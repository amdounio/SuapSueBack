const {
    User,
    resetToken,
    product,
    artwork,
    lyrics,
    track,


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

    //fix the psd file input
    addArtworkProduct: async (req, res) => {
        console.log(req.files)
        const userId = req.body.userId
        const url = req.protocol + "://" + req.get("host");
        const tagedartwork = url + "/images/artworkImages/" + req.files["Image"][0].filename;
        console.log(req.files["untaged_artwork"][0].filename)
        const untagedartwork = url + "/images/artworkImages/" + req.files["untaged_artwork"][0].filename;
        const psd_file = url + "/images/artworkImages/" + req.files["psd_file"][0].filename;

        try {

            console.log(userId)
            console.log(req.body.title);
            const finduser = await User.findOne({
                where: {
                    id: userId
                }
            });
            if (!finduser) {
                res.status(401).json({ msg: "this user is not found" });
            }

            const products = {
                userId: finduser.id,
                title: req.body.title,
                description: req.body.description,
                releaseDate: req.body.releaseDate,
                primaryMood: req.body.primaryMood,
                secondaryMood: req.body.secondaryMood,
                price: req.body.price,
                type: 'artwork',
                selled: false
            }

            const artworkProduct = await product.create(products)
            console.log(artworkProduct)
            if (artworkProduct) {
                const artworkDetails = {
                    untaged_artwork: untagedartwork,
                    taged_artwork: tagedartwork,
                    psd_file: psd_file,
                    resolution: req.body.resolution,
                    productId: artworkProduct.id
                }
                const artworkP = await artwork.create(artworkDetails);
                console.log(artworkP)
                if (artworkP) {
                    res.status(200).json({ msg: "artwork product created", artworkProduct, artworkP })
                }
            }


        } catch (err) {
            res.status(500).json({ err: "internal server error", err })
        }
    },


    addTrackProduct: async (req, res) => {
        const userId = req.body.userId
        console.log(userId)
        const url = req.protocol + "://" + req.get("host");
        const Image = url + "/products/media/" + req.files["Image"][0].filename;
        const taged_track = url + "/products/media/" + req.files["taged_track"][0].filename;
        const untaged_track = url + "/products/media/" + req.files["untaged_track"][0].filename;

        try {

            console.log(userId)
            const finduser = await User.findOne({
                where: {
                    id: userId
                }
            });
            if (!finduser) {
                res.status(401).json({ msg: "this user is not found" });
            }

            console.log(finduser)
            const products = {
                userId: finduser.id,
                title: req.body.title,
                description: req.body.description,
                releaseDate: req.body.releaseDate,
                primaryMood: req.body.primaryMood,
                secondaryMood: req.body.secondaryMood,
                price: req.body.price,
                type: 'track',
                selled: false
            }

            const trackProduct = await product.create(products)
            console.log(trackProduct)
            if (trackProduct) {
                const trackDetails = {
                    Image: Image,
                    track_type: req.body.track_type,
                    BPM: req.body.BPM,
                    untaged_track: untaged_track,
                    taged_track: taged_track,
                    key: req.body.key,
                    productId: trackProduct.id
                }
                const trackP = await track.create(trackDetails);
                console.log(trackP)
                if (trackP) {
                    res.status(200).json({ msg: "track product created", trackProduct, trackP })
                }
            }


        } catch (err) {
            res.status(500).json({ err: "internal server error", err })
        }
    },


    addLyricsProduct: async (req, res) => {
        const userId = req.body.userId
        const url = req.protocol + "://" + req.get("host");
        const image = url + "/images/artworkImages/" + req.files["Image"][0].filename;

        try {
            const finduser = await User.findOne({
                where: {
                    id: userId
                }
            });
            if (!finduser) {
                res.status(401).json({ msg: "this user is not found" });
            }
            const products = {
                userId: finduser.id,
                title: req.body.title,
                description: req.body.description,
                releaseDate: req.body.releaseDate,
                primaryMood: req.body.primaryMood,
                secondaryMood: req.body.secondaryMood,
                price: req.body.price,
                type: 'lyrics',
                selled: false
            }

            const lyricsProduct = await product.create(products)
            if (lyricsProduct) {
                const lyricsDetails = {
                    Image: image,
                    part_of_lyrics: req.body.part_of_lyrics,
                    full_lyrics: req.body.full_lyrics,
                    nb_lines: req.body.nb_lines,
                    productId: lyricsProduct.id
                }
                const lyricsP = await lyrics.create(lyricsDetails);
                console.log(lyricsP)
                if (lyricsP) {
                    res.status(200).json({ msg: "lyrics product created", lyricsProduct, lyricsP })
                }
            }

        } catch (err) {
            res.status(500).json({ err: "internal server error", err })
        }
    },

    //Get user Products
    getUserProducts: async (req, res) => {
        const userId = req.params.id
        console.log(userId);
        try {
            const findUser = await User.findOne({
                where: { id: userId }
            });
            if (findUser) {
                const userProducts = await product.findAll({
                    where: { userId: userId , selled:false , accepted : true},
                    include: [
                        {
                            model: artwork,
                            as: 'artwork'
                        },
                        {
                            model: track,
                            as: 'track'
                        },
                        {
                            model: lyrics,
                            as: 'lyric'
                        }
                    ]
                });
                console.log(userProducts);
                if (userProducts) {
                    console.log(userProducts),
                        res.status(200).json({ msg: "Product List of this User is loaded with success", userProducts })
                }
            }
        } catch (error) {
            res.status(500).json({ error: "Internal server error!!" })
        }
    },

    countUserProducts: async (req, res) => {
        const userId = req.params.id
        console.log(userId)
        try {
            const { count } = await product.findAndCountAll({
                where: { userId: userId }
            });
            if (count) {
                const numberOfProjects = count
                res.status(200).json({ numberOfProjects })
            }

        } catch (error) {
            res.status(500).json({ msg: "Internal server Error!!", error })
        }
    },

    countAllProducts: async (req, res) => {

        try {
            const { count } = await product.findAndCountAll();
            if (count) {
                const numberOfProjects = count
                res.status(200).json({ numberOfProjects })
            }

        } catch (error) {
            res.status(500).json({ msg: "Internal server Error!!", error })
        }
    },

    //Get Products By ID Functions
    getProductById: async (req, res) => {
        const productId = req.params.id
        try {
            console.log(productId)
            const products = await product.findOne({
                where: { id: productId }

            });
            console.log(products)

            if (product) {
                res.status(200).json({ products })
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({ msg: "internal server Error!" })
        }

    },

    getArtProductById: async (req, res) => {
        const productId = req.params.id
        try {
            console.log(productId)
            const products = await product.findOne({
                where: { id: productId },
                include: [
                    //         {
                    //         model: track,
                    //         as: "tracks",
                    //     },
                    {
                        model: artwork,
                        as: "artwork",
                    },
                    //     {
                    //         model: lyrics,
                    //         as: "lyrics"
                    //     }
                ],
            });
            console.log(products)

            if (product) {
                res.status(200).json({ products })
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({ msg: "internal server Error!" })
        }
    },

    getTrackProductById: async (req, res) => {
        const productId = req.params.id
        try {
            console.log(productId)
            const products = await product.findOne({
                where: { id: productId },
                include: [

                    {
                        model: track,
                        as: "track",
                    }
                ],
            });
            console.log(products)

            if (product) {
                res.status(200).json({ products })
            }



        } catch (err) {
            res.status(500).json({ msg: "internal server Error!" })
        }
    },

    getLyricsProductById: async (req, res) => {
        const productId = req.params.id
        try {
            console.log(productId)
            const products = await product.findOne({
                where: { id: productId },
                include: [
                    //         {
                    //         model: track,
                    //         as: "tracks",
                    //     },
                    {
                        model: lyrics,
                        as: "lyric",
                    },
                    //     {
                    //         model: lyrics,
                    //         as: "lyrics"
                    //     }
                ],
            });
            console.log(products)

            if (product) {
                res.status(200).json({ products })
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({ msg: "internal server Error!" })
        }
    },


    //Get All the Products for each type
    getAllTrackProduct: async (req, res) => {
        try {
            const products = await product.findAll({
                where: { type: 'track' },
                include: [

                    {
                        model: track,
                        as: "track",
                    }
                ],
            });
            console.log(products)

            if (product) {
                res.status(200).json({ products })
            }

        } catch (err) {
            res.status(500).json({ msg: "internal server Error!" })
        }
    },

    getAllArtProduct: async (req, res) => {
        try {

            const products = await product.findAll({
                where: { type: 'artwork' },
                include: [

                    {
                        model: artwork,
                        as: "artwork",
                    }
                ],
            });
            console.log(products)

            if (product) {
                res.status(200).json({ products })
            }

        } catch (err) {
            res.status(500).json({ msg: "internal server Error!" })
        }
    },

    getAllLyricsProduct: async (req, res) => {
        try {
            const products = await product.findAll({
                where: { type: 'lyrics' },
                include: [

                    {
                        model: lyrics,
                        as: "lyric",
                    }
                ],
            });
            console.log(products)

            if (product) {
                res.status(200).json({ products })
            }

        } catch (err) {
            res.status(500).json({ msg: "internal server Error!" })
        }
    },

    getAllProduct: async (req, res) => {
        try {
            const allProducts = await product.findAll({
                where: {
                    accepted: true,
                    selled: false
                },
                include: [

                    {
                        model: lyrics,
                        as: "lyric",
                    },
                    {
                        model: artwork,
                        as: "artwork",
                    },
                    {
                        model: track,
                        as: "track",
                    }
                ],
                order: [
                    ['createdAt', 'DESC']
                ],
            });


            if (allProducts) {
                res.status(200).json({ msg: "List of all Products", allProducts })
            }

        } catch (err) {
            res.status(500).json({ err: "Intenal server Error" })
        }
    },


    deleteProduct: async (req, res) => {
        const productId = req.body.id
        try {
            const findProduct = await product.findOne({
                where: { id: productId }
            })
            console.log(findProduct)
            if (findProduct) {
                const deleteproduct = await findProduct.destroy({
                    include: [
                        {
                            model: lyrics,
                            as: "lyric",
                        },
                        {
                            model: artwork,
                            as: "artwork",
                        },
                        {
                            model: track,
                            as: "track",
                        }
                    ]
                });
                const Artwork = await artwork.destroy({
                    where: { productId: productId }
                });

                const Track = await track.destroy({
                    where: { productId: productId }
                });

                const Lyrics = await lyrics.destroy({
                    where: { productId: productId }
                });



                if (deleteproduct, Artwork || Track || Lyrics) {
                    res.status(200).json({ msg: "product deleted", productId })
                }
            }

        } catch (error) {
            res.status(500).json({ msg: "Internal server Error", error })
        }
    },

    updateProduct: async (req, res) => {
        const productId = req.body.id
        console.log(req.body)
        console.log(productId)
        try {
            const productToUpdate = await product.findOne({
                where: { id: productId }
            });
            console.log(productToUpdate)
            const artworkToUp = await artwork.findOne({
                where: { productId: productId }
            });
            const trackToUp = await track.findOne({
                where: { productId: productId }
            });
            const lyricsToUp = await lyrics.findOne({
                where: { productId: productId }
            });
            if (productToUpdate) {
                await productToUpdate.update({
                    title: req.body.title ? req.body.title : productToUpdate.title,
                    description: req.body.description ? req.body.description : productToUpdate.description,
                    releaseDate: req.body.releaseDate ? req.body.releaseDate : productToUpdate.releaseDate,
                    primaryMood: req.body.primaryMood ? req.body.primaryMood : productToUpdate.primaryMood,
                    secondaryMood: req.body.secondaryMood ? req.body.secondaryMood : productToUpdate.secondaryMood,
                    price: req.body.price ? req.body.price : productToUpdate.price
                })
                if (artworkToUp) {
                    await artworkToUp.update({
                        resolution: req.body.resolution ? req.body.resolution : artworkToUp.resolution,
                    })
                    res.status(200).json({ msg: "artwork updated", artworkToUp })
                }
                if (trackToUp) {
                    await trackToUp.update({
                        track_type: req.body.track_type ? req.body.track_type : trackToUp.track_type,
                        BPM: req.body.BPM ? req.body.BPM : trackToUp.BPM,
                        // untaged_track : "hdhdhd",
                        // taged_track : "ljdsjnd",
                        key: req.body.key ? req.body.key : trackToUp.key
                    });
                    res.status(200).json({ msg: "track updated", trackToUp })
                }
                if (lyricsToUp) {
                    await lyricsToUp.update({
                        // Image : Image ? Image : lyricsToUp.Image,
                        part_of_lyrics: req.body.part_of_lyrics ? req.body.part_of_lyrics : lyricsToUp.part_of_lyrics,
                        full_lyrics: req.body.full_lyrics ? req.body.full_lyrics : lyricsToUp.full_lyrics,
                        nb_lines: req.body.nb_lines ? req.body.nb_lines : lyricsToUp.nb_lines,
                    });
                    res.status(200).json({ msg: "lyrics updated", lyricsToUp })
                }
            }
        } catch (error) {
            res.status(500).json({ error: "Internal server Error!!" })
        }
    },

    addLike: async (req, res) => {
        const productId = req.body.productId
        try {
            const findproduct = await product.findOne({
                where: { id: productId }
            })
            if (findproduct) {
                const likes = findproduct.likes
                const upLikes = await findproduct.update({
                    likes: likes + 1

                })
                if (upLikes) {
                    res.status(200).json({ error: "like added" })
                }
            } else {
                res.status(401).json({ error: "product not found" })
            }

        } catch (error) {
            res.status(500).json({ error: "Internal server Error!" })
        }

    },

    buyProduct: async (req, res) => {
        const productId = req.body.productId
        const userId = req.body.userId
        try {
            const findproduct = await product.findOne({
                where: { id: productId },
                include: [

                    {
                        model: lyrics,
                        as: "lyric",
                    },
                    {
                        model: artwork,
                        as: "artwork",
                    },
                    {
                        model: track,
                        as: "track",
                    }
                ]
            })
            const finduser = await User.findOne({
                where: { id: userId }
            })
            if (findproduct, finduser) {
                let text
                let htmlMailTemp
                let downloadLink
                switch (findproduct.type) {
                    case 'track':
                        downloadLink = findproduct.track.untaged_track
                        console.log(downloadLink, 'track');
                        text = `
                        Welcome on VagaBeats,

                        You can now download your product by clicking on the link below or by copying it to your browser:

                        press here:${downloadLink}
                            
                        
                        
                        
                        --  VagaBeats team`

                        htmlMailTemp = `
                    <!DOCTYPE html>
                    <html>

                    <head>
                        <title></title>
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                        <style type="text/css">
                            @media screen {
                                @font-face {
                                    font-family: 'Lato';
                                    font-style: normal;
                                    font-weight: 400;
                                    src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                                }

                                @font-face {
                                    font-family: 'Lato';
                                    font-style: normal;
                                    font-weight: 700;
                                    src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                                }

                                @font-face {
                                    font-family: 'Lato';
                                    font-style: italic;
                                    font-weight: 400;
                                    src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                                }

                                @font-face {
                                    font-family: 'Lato';
                                    font-style: italic;
                                    font-weight: 700;
                                    src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                                }
                            }

                            /* CLIENT-SPECIFIC STYLES */
                            body,
                            table,
                            td,
                            a {
                                -webkit-text-size-adjust: 100%;
                                -ms-text-size-adjust: 100%;
                            }

                            table,
                            td {
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                            }

                            img {
                                -ms-interpolation-mode: bicubic;
                            }

                            /* RESET STYLES */
                            img {
                                border: 0;
                                height: auto;
                                line-height: 100%;
                                outline: none;
                                text-decoration: none;
                            }

                            table {
                                border-collapse: collapse !important;
                            }

                            body {
                                height: 100% !important;
                                margin: 0 !important;
                                padding: 0 !important;
                                width: 100% !important;
                            }

                            /* iOS BLUE LINKS */
                            a[x-apple-data-detectors] {
                                color: inherit !important;
                                text-decoration: none !important;
                                font-size: inherit !important;
                                font-family: inherit !important;
                                font-weight: inherit !important;
                                line-height: inherit !important;
                            }

                            /* MOBILE STYLES */
                            @media screen and (max-width:600px) {
                                h1 {
                                    font-size: 32px !important;
                                    line-height: 32px !important;
                                }
                            }

                            /* ANDROID CENTER FIX */
                            div[style*="margin: 16px 0;"] {
                                margin: 0 !important;
                            }
                        </style>
                    </head>

                    <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
                        <!-- HIDDEN PREHEADER TEXT -->
                        <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <!-- LOGO -->
                            <tr>
                                <td bgcolor="red" align="center">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                        <tr>
                                            <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="red" align="center" style="padding: 0px 10px 0px 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                        <tr>
                                            <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                                <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome!</h1> <img src=" https://i.ibb.co/2nrQPRw/vaga-beats.png" width="125" height="120" style="display: block; border: 0px;" />
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                        <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;">We're excited to have you purchase a product from us. First, all you need to downlaod your product. Just press the button below.</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td bgcolor="#ffffff" align="left">
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                                            <table border="0" cellspacing="0" cellpadding="0">
                                                                <tr>
                                                                    <td align="center" style="border-radius: 3px;" bgcolor="red"><a href="${downloadLink}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid red; display: inline-block;">download your product</a></td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr> <!-- COPY -->
                                        <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
                                            </td>
                                        </tr> <!-- COPY -->
                                        <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;"><a href="#" target="_blank" style="color: red;">${downloadLink}</a></p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;">If you have any questions, just reply to this email—we're always happy to help out.</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;">Cheers,<br>VagaBeats Team</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                        <tr>
                                            <td bgcolor="#FFECD1" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <h2 style="font-size: 20px; font-weight: 400; color: #111111; margin: 0;">Need more help?</h2>
                                                <p style="margin: 0;"><a href="#" target="_blank" style="color: #FFA73B;">We&rsquo;re here to help you out</a></p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                        <tr>
                                            <td bgcolor="#f4f4f4" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;"> <br>
                                                <p style="margin: 0;">If these emails get annoying, please feel free to <a href="#" target="_blank" style="color: #111111; font-weight: 700;">unsubscribe</a>.</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body>

                    </html>
                         `
                        break;
                    case 'artwork':
                        downloadLink = findproduct.artwork.untaged_artwork
                        console.log(downloadLink, 'artwork');
                        text = `
                        Welcome on VagaBeats,

                        You can now download your product by clicking on the link below or by copying it to your browser:

                        press here:${downloadLink}
                            
                        
                        
                        
                        --  VagaBeats team`
                        htmlMailTemp = `
                    <!DOCTYPE html>
                    <html>

                    <head>
                        <title></title>
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                        <style type="text/css">
                            @media screen {
                                @font-face {
                                    font-family: 'Lato';
                                    font-style: normal;
                                    font-weight: 400;
                                    src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                                }

                                @font-face {
                                    font-family: 'Lato';
                                    font-style: normal;
                                    font-weight: 700;
                                    src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                                }

                                @font-face {
                                    font-family: 'Lato';
                                    font-style: italic;
                                    font-weight: 400;
                                    src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                                }

                                @font-face {
                                    font-family: 'Lato';
                                    font-style: italic;
                                    font-weight: 700;
                                    src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                                }
                            }

                            /* CLIENT-SPECIFIC STYLES */
                            body,
                            table,
                            td,
                            a {
                                -webkit-text-size-adjust: 100%;
                                -ms-text-size-adjust: 100%;
                            }

                            table,
                            td {
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                            }

                            img {
                                -ms-interpolation-mode: bicubic;
                            }

                            /* RESET STYLES */
                            img {
                                border: 0;
                                height: auto;
                                line-height: 100%;
                                outline: none;
                                text-decoration: none;
                            }

                            table {
                                border-collapse: collapse !important;
                            }

                            body {
                                height: 100% !important;
                                margin: 0 !important;
                                padding: 0 !important;
                                width: 100% !important;
                            }

                            /* iOS BLUE LINKS */
                            a[x-apple-data-detectors] {
                                color: inherit !important;
                                text-decoration: none !important;
                                font-size: inherit !important;
                                font-family: inherit !important;
                                font-weight: inherit !important;
                                line-height: inherit !important;
                            }

                            /* MOBILE STYLES */
                            @media screen and (max-width:600px) {
                                h1 {
                                    font-size: 32px !important;
                                    line-height: 32px !important;
                                }
                            }

                            /* ANDROID CENTER FIX */
                            div[style*="margin: 16px 0;"] {
                                margin: 0 !important;
                            }
                        </style>
                    </head>

                    <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
                        <!-- HIDDEN PREHEADER TEXT -->
                        <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <!-- LOGO -->
                            <tr>
                                <td bgcolor="red" align="center">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                        <tr>
                                            <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="red" align="center" style="padding: 0px 10px 0px 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                        <tr>
                                            <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                                <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome!</h1> <img src=" https://i.ibb.co/2nrQPRw/vaga-beats.png" width="125" height="120" style="display: block; border: 0px;" />
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                        <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;">We're excited to have you purchase a product from us. First, all you need to downlaod your product. Just press the button below.</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td bgcolor="#ffffff" align="left">
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                                            <table border="0" cellspacing="0" cellpadding="0">
                                                                <tr>
                                                                    <td align="center" style="border-radius: 3px;" bgcolor="red"><a href="${downloadLink}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid red; display: inline-block;">download your product</a></td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr> <!-- COPY -->
                                        <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
                                            </td>
                                        </tr> <!-- COPY -->
                                        <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;"><a href="#" target="_blank" style="color: red;">${downloadLink}</a></p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;">If you have any questions, just reply to this email—we're always happy to help out.</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;">Cheers,<br>VagaBeats Team</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                        <tr>
                                            <td bgcolor="#FFECD1" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <h2 style="font-size: 20px; font-weight: 400; color: #111111; margin: 0;">Need more help?</h2>
                                                <p style="margin: 0;"><a href="#" target="_blank" style="color: #FFA73B;">We&rsquo;re here to help you out</a></p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                        <tr>
                                            <td bgcolor="#f4f4f4" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;"> <br>
                                                <p style="margin: 0;">If these emails get annoying, please feel free to <a href="#" target="_blank" style="color: #111111; font-weight: 700;">unsubscribe</a>.</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </body>

                    </html>
                    `
                        break;
                    case 'lyrics':
                        downloadLink = findproduct.lyric.full_lyrics
                        console.log(downloadLink, 'lyrics');
                        text = `
                        Welcome on VagaBeats,

                        You can now download your product by clicking on the link below or by copying it to your browser:

                        press here:${downloadLink}
                            
                        
                        
                        
                        --  VagaBeats team`

                        htmlMailTemp = `
                    <!DOCTYPE html>
                    <html>

                    <head>
                        <title></title>
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                        <style type="text/css">
                            @media screen {
                                @font-face {
                                    font-family: 'Lato';
                                    font-style: normal;
                                    font-weight: 400;
                                    src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                                }

                                @font-face {
                                    font-family: 'Lato';
                                    font-style: normal;
                                    font-weight: 700;
                                    src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                                }

                                @font-face {
                                    font-family: 'Lato';
                                    font-style: italic;
                                    font-weight: 400;
                                    src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                                }

                                @font-face {
                                    font-family: 'Lato';
                                    font-style: italic;
                                    font-weight: 700;
                                    src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                                }
                            }

                            /* CLIENT-SPECIFIC STYLES */
                            body,
                            table,
                            td,
                            a {
                                -webkit-text-size-adjust: 100%;
                                -ms-text-size-adjust: 100%;
                            }

                            table,
                            td {
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                            }

                            img {
                                -ms-interpolation-mode: bicubic;
                            }

                            /* RESET STYLES */
                            img {
                                border: 0;
                                height: auto;
                                line-height: 100%;
                                outline: none;
                                text-decoration: none;
                            }

                            table {
                                border-collapse: collapse !important;
                            }

                            body {
                                height: 100% !important;
                                margin: 0 !important;
                                padding: 0 !important;
                                width: 100% !important;
                            }

                            /* iOS BLUE LINKS */
                            a[x-apple-data-detectors] {
                                color: inherit !important;
                                text-decoration: none !important;
                                font-size: inherit !important;
                                font-family: inherit !important;
                                font-weight: inherit !important;
                                line-height: inherit !important;
                            }

                            /* MOBILE STYLES */
                            @media screen and (max-width:600px) {
                                h1 {
                                    font-size: 32px !important;
                                    line-height: 32px !important;
                                }
                            }

                            /* ANDROID CENTER FIX */
                            div[style*="margin: 16px 0;"] {
                                margin: 0 !important;
                            }
                        </style>
                    </head>

                    <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
                        <!-- HIDDEN PREHEADER TEXT -->
                        <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <!-- LOGO -->
                            <tr>
                                <td bgcolor="red" align="center">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                        <tr>
                                            <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="red" align="center" style="padding: 0px 10px 0px 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                        <tr>
                                            <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                                <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome!</h1> <img src=" https://i.ibb.co/2nrQPRw/vaga-beats.png" width="125" height="120" style="display: block; border: 0px;" />
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                        <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;">We're excited to have you purchase a product from us. First, all you need to downlaod your product. Just press the button below.</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td bgcolor="#ffffff" align="left">
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                                            <table border="0" cellspacing="0" cellpadding="0">
                                                                <tr>
                                                                    <td align="center" style="border-radius: 3px;" bgcolor="red"><h2>Lyrics</h2></td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr> <!-- COPY -->
                                        <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
                                            </td>
                                        </tr> <!-- COPY -->
                                        <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;">${downloadLink}</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;">If you have any questions, just reply to this email—we're always happy to help out.</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <p style="margin: 0;">Cheers,<br>VagaBeats Team</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                        <tr>
                                            <td bgcolor="#FFECD1" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                <h2 style="font-size: 20px; font-weight: 400; color: #111111; margin: 0;">Need more help?</h2>
                                                <p style="margin: 0;"><a href="#" target="_blank" style="color: #FFA73B;">We&rsquo;re here to help you out</a></p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                        </table>
                    </body>

                    </html>
                    `
                        break;
                }
                const sellP = await findproduct.update({
                    selled: true
                })
                const updateBalance = await finduser.update({
                    balance: finduser.balance - findproduct.price
                })
                console.log('update done');
                if (sellP) {

                    console.log(finduser.email);
                    const message = {
                        from: constantes.MAIL_SENDER_ADDRESS,
                        to: finduser.email,
                        replyTo: constantes.MAIL_REPLYTO_ADDRESS,
                        subject: constantes.PRODUCT_SELLED_SUBJECT_LINE ,
                        text: text,
                        html: htmlMailTemp
                    };

                    const sentMail = await mailUtils.Envoyer(message);
                    if (sentMail) {
                        res.status(200).json({
                            msg: "product download link have been sent to your email",
                            ok: true
                        })
                        console.log('email sent !');

                    }
                }
            }
        } catch (error) {
            res.status(500).json({ error: "Internal server Error!" })
        }
    },

    // Dashboard Cruds
    getNotacceptedWithLimit: async (req, res) => {
        try {
            const noAccept = await product.findAll({
                where: { accepted: false },
                include: [

                    {
                        model: lyrics,
                        as: "lyric",
                    },
                    {
                        model: artwork,
                        as: "artwork",
                    },
                    {
                        model: track,
                        as: "track",
                    }
                ],
                order: [
                    ['createdAt', 'DESC']
                ],
                limit: 5
            });
            if (noAccept) {
                res.status(200).json({ noAccept })
            }
        } catch (error) {
            res.status(500).json({ error: "Internal server error!" })
        }
    },

    getNotaccepted: async (req, res) => {
        try {
            const noAccept = await product.findAll({
                where: { accepted: false },
                include: [

                    {
                        model: lyrics,
                        as: "lyric",
                    },
                    {
                        model: artwork,
                        as: "artwork",
                    },
                    {
                        model: track,
                        as: "track",
                    }
                ],
                order: [
                    ['createdAt', 'DESC']
                ],

            });
            if (noAccept) {
                res.status(200).json({ noAccept })
            }
        } catch (error) {
            res.status(500).json({ error: "Internal server error!" })
        }
    },

    acceptP: async (req, res) => {
        const productId = req.body.id
        try {
            const prod = await product.findOne({
                where: { id: productId }
            });

            if (prod) {
                const findUser = await User.findOne({ where: { id: prod.userId } });
                console.log(findUser);
                const accepted = await prod.update({
                    accepted: true
                })
                if (accepted) {

                    const text = `
                            Welcome on VagaBeats,
                            Hi ${findUser.firstName} ${findUser.lastName}
    
                            your product is accepted succesfully you can check your profile right now

                            --  VagaBeats team`


                    const htmlMailTemp = `
                        <!DOCTYPE html>
                        <html>
    
                        <head>
                            <title></title>
                            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                            <meta name="viewport" content="width=device-width, initial-scale=1">
                            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                            <style type="text/css">
                                @media screen {
                                    @font-face {
                                        font-family: 'Lato';
                                        font-style: normal;
                                        font-weight: 400;
                                        src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                                    }
    
                                    @font-face {
                                        font-family: 'Lato';
                                        font-style: normal;
                                        font-weight: 700;
                                        src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                                    }
    
                                    @font-face {
                                        font-family: 'Lato';
                                        font-style: italic;
                                        font-weight: 400;
                                        src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                                    }
    
                                    @font-face {
                                        font-family: 'Lato';
                                        font-style: italic;
                                        font-weight: 700;
                                        src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                                    }
                                }
    
                                /* CLIENT-SPECIFIC STYLES */
                                body,
                                table,
                                td,
                                a {
                                    -webkit-text-size-adjust: 100%;
                                    -ms-text-size-adjust: 100%;
                                }
    
                                table,
                                td {
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                }
    
                                img {
                                    -ms-interpolation-mode: bicubic;
                                }
    
                                /* RESET STYLES */
                                img {
                                    border: 0;
                                    height: auto;
                                    line-height: 100%;
                                    outline: none;
                                    text-decoration: none;
                                }
    
                                table {
                                    border-collapse: collapse !important;
                                }
    
                                body {
                                    height: 100% !important;
                                    margin: 0 !important;
                                    padding: 0 !important;
                                    width: 100% !important;
                                }
    
                                /* iOS BLUE LINKS */
                                a[x-apple-data-detectors] {
                                    color: inherit !important;
                                    text-decoration: none !important;
                                    font-size: inherit !important;
                                    font-family: inherit !important;
                                    font-weight: inherit !important;
                                    line-height: inherit !important;
                                }
    
                                /* MOBILE STYLES */
                                @media screen and (max-width:600px) {
                                    h1 {
                                        font-size: 32px !important;
                                        line-height: 32px !important;
                                    }
                                }
    
                                /* ANDROID CENTER FIX */
                                div[style*="margin: 16px 0;"] {
                                    margin: 0 !important;
                                }
                            </style>
                        </head>
    
                        <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
                            <!-- HIDDEN PREHEADER TEXT -->
                            <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <!-- LOGO -->
                                <tr>
                                    <td bgcolor="red" align="center">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                            <tr>
                                                <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="red" align="center" style="padding: 0px 10px 0px 10px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                            <tr>
                                                <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                                    <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome!</h1> <img src=" https://i.ibb.co/2nrQPRw/vaga-beats.png" width="125" height="120" style="display: block; border: 0px;" />
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                            <tr>
                                                <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                    <p>Welcome on VagaBeats,<br>
                                                    Hi ${findUser.firstName} ${findUser.lastName}</p><br>
                                                    <p style="margin: 0;">We're excited to have accept your product <span style="color=red;">${prod.title}</span>.  please check your profile. Just press the button below.</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td bgcolor="#ffffff" align="left">
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                                                <table border="0" cellspacing="0" cellpadding="0">
                                                                    <tr>
                                                                        <td align="center" style="border-radius: 3px;" bgcolor="red"><a href="http://localhost:4200/user/profile" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid red; display: inline-block;">Go To your Profile</a></td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr> <!-- COPY -->
                                            <tr>
                                                <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                    <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
                                                </td>
                                            </tr> <!-- COPY -->
                                            <tr>
                                                <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                    <p style="margin: 0;"><a href="http://localhost:4200/user/profile" target="_blank" style="color: red;">http://localhost:4200/user/profile</a></p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                    <p style="margin: 0;">If you have any questions, just reply to this email—we're always happy to help out.</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                    <p style="margin: 0;">Cheers,<br>VagaBeats Team</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                                            <tr>
                                                <td bgcolor="#FFECD1" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                                    <h2 style="font-size: 20px; font-weight: 400; color: #111111; margin: 0;">Need more help?</h2>
                                                    <p style="margin: 0;"><a href="#" target="_blank" style="color: #FFA73B;">We&rsquo;re here to help you out</a></p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                
                            </table>
                        </body>
    
                        </html>
                        `


                    const message = {
                        from: constantes.MAIL_SENDER_ADDRESS,
                        to: findUser.email,
                        replyTo: constantes.MAIL_REPLYTO_ADDRESS,
                        subject: constantes.PRODUCT_ACCEPTED_SUBJECT_LINE,
                        text: text,
                        html: htmlMailTemp
                    };

                    const sentMail = await mailUtils.Envoyer(message);
                    if (sentMail) {
                        res.status(200).json({
                            msg: "product acceptation Email is sent to " + findUser.firstName,
                            ok: true
                        })

                    }

                }
                res.status(200).json({ msg: "accepted!" })
            }
        } catch (error) {
            res.status(500).json({ error: "Internal server error!" })
        }
    },

    countSelledProducts: async (req, res) => {
        try {

            const selledP = await product.count({
                where: {
                    selled: true,
                    createdAt: {
                        [Op.lt]: new Date(),
                        [Op.gt]: new Date().getMonth() - 1
                    }
                }
            })
            res.status(200).json({ nb: selledP })
        } catch (error) {
            res.status(500).json({ error: "internal server error!" })
        }
    },

    sumSelledProducts: async (req, res) => {
        try {

            const sumSelledP = await product.sum('price', {
                where: {
                    selled: true
                }
            })
            res.status(200).json({ sum: sumSelledP })
        } catch (error) {
            res.status(500).json({ error: "internal server error!" })
        }
    },

    getUsersOfTheMonth: async (req, res) => {
        const year = new Date().getFullYear()
        const month = new Date().getMonth() + 1
        const day = new Date().getDay()
        const date = year.toString() + '-' + month.toString() + '-' + '1 00:00:00'
        try {
            console.log(date);
            const usersofMonth = await User.count({
                where: {
                    activated: true,
                    createdAt: {
                        [Op.lt]: new Date(),
                        [Op.gt]: date
                    }
                }
            })
            res.status(200).json({ users: usersofMonth })
        } catch (error) {
            res.status(500).json({ error: "internal server error!" })
        }
    },

    getNumberNotAcceptedP: async (req, res) => {
        const year = new Date().getFullYear()
        const month = new Date().getMonth()
        const day = new Date().getDay() - 1
        const date = year.toString() + '-' + month.toString() + '-' + day.toString() + ' 00:00:00'

        try {
            console.log(date);
            const nbNotP = await product.count({
                where: {
                    accepted: false,
                    createdAt: {
                        [Op.lt]: new Date(),
                        [Op.gt]: date
                    }
                }
            })
            res.status(200).json({ nbP: nbNotP })
        } catch (error) {
            res.status(500).json({ error: "internal server error!" })
        }
    },

    numberOfProducts: async (req, res) => {
        try {
            const nbP = await product.count({
                where: {
                    accepted: true,
                    selled: true
                }
            })
            const nbTracks = await product.count({
                where: {
                    accepted: true,
                    type: 'track',
                    selled: true
                }
            })
            const nbLyrics = await product.count({
                where: {
                    accepted: true,
                    type: 'lyrics',
                    selled: true
                }
            })
            const nbArtwork = await product.count({
                where: {
                    accepted: true,
                    type: 'artwork',
                    selled: true
                }
            })
            res.status(200).json({
                nbP: nbP,
                nbTracks: nbTracks,
                nbLyrics: nbLyrics,
                nbArtwork: nbArtwork
            })
        } catch (error) {
            res.status(500).json({ error: "internal server error!" })
        }
    }

}