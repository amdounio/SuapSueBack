const {
    User,
    resetToken,
    Role,
    userRoles

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

    create: async (req, res) => {
        try {
            const creation = await User.create(req.body)
            if (creation) {
                res.status(200).json({ message: "entity created successfully !!", entity: creation })
            }
        } catch (error) {
            res.status(500).json({ error: "Internal server Error !! " })
        }
    },

    getall: async (req, res) => {
        try {
            const entities = await User.findAll({
                include: [
                    {
                        model: Role,
                        as: 'roles'
                    }
                ]
            });
            if (entities) {
                const count = await User.count()
                res.status(200).json({ entities: entities, count: count });
            }
        } catch (err) {
            res.status(500).json({ error: "Internal server Error !! " + err });
        }
    },

    getOne: async (req, res) => {
        try {

            const entity = await User.findOne({
                where: {
                    id: req.params.id,
                },
                include: [
                    {
                        model: Role,
                        as: 'roles'
                    }
                ]
            });
            delete entity.password
            console.log(entity);
            if (entity) {
                res.status(200).json({ ok: true, entity: entity });
            }
        } catch (err) {
            res.status(500).json({ ok: false, message: "Erreur au niveau de serveur : " + err });
        }
    },

    add: async (req, res) => {
        try {

            const mail = req.body.email
            global.user;
            global.personnelimage;
            const url = req.protocol + "://" + req.get("host");


            const { count } = await User.findAndCountAll();

            console.log(req.body);
            if (!count) {

                const hash = await bcrypt.hash(req.body.password, 10);
                if (hash) {
                    this.user = {
                        username: req.body.username,
                        email: req.body.email,
                        password: hash,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        gender: req.body.gender,
                        displayName: req.body.displayName,
                        description: req.body.description,
                        userImage: this.personnelimage,
                        subscription: req.body.subscription,
                        Role: 'admin',
                        activated: false
                    };
                    await User.create(this.user);
                }
                return res.status(200).json({
                    ok: true,
                    message: "inscription effuctuée avec succès",
                });
            }

            else {
                global.user;
                const findUser = await User.findOne({
                    where: {
                        username: req.body.username
                    }
                });
                if (findUser) {
                    return res.status(402).json({ message: "username already used", ok: false });
                }


                const findEmail = await User.findOne({
                    where: {
                        email: req.body.email
                    }
                });
                if (findEmail) {
                    return res.status(402).json({ message: "email already used", ok: false })
                }

                const hash = await bcrypt.hash(req.body.password, 10);
                if (hash) {
                    this.user = {
                        username: req.body.username,
                        email: req.body.email,
                        password: hash,
                        firstName: '',
                        lastName: '',
                        gender: '',
                        displayName: '',
                        description: '',
                        userImage: '',
                        subscription: '',
                        activated: false
                    };
                    const userAdded = await User.create(this.user);
                    if (userAdded) {
                        var expireDate = new Date();
                        expireDate.setHours(expireDate.getHours() + 1);
                        const token = jwtUtils.generatTokenForuser(this.user, '1h');

                        // set an new token to the DB
                        await resetToken.create({
                            mail: mail,
                            expiration: expireDate,
                            token: token,
                            used: 0
                        });

                        // console.log(user.lastName);
                        const text = `
                        Welcome on VagaBeats,

                        You can now complete your profile details by clicking on the link below or by copying it to your browser:

                        http://localhost:4200/user/completeProfile?token=${encodeURIComponent(token)}&mail=${mail}
                        
                        This link can only be used once to complete your profile and will take you to the page to complete your profile. It will expire in an hour and nothing will happen if it is not used.
                        
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
                            <p style="margin: 0;">We're excited to have you get started. First, you need to confirm your account. Just press the button below.</p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                        <table border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td align="center" style="border-radius: 3px;" bgcolor="red"><a href="http://localhost:4200/user/completeProfile?token=${encodeURIComponent(token)}&mail=${mail}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid red; display: inline-block;">Confirm Account</a></td>
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
                            <p style="margin: 0;"><a href="#" target="_blank" style="color: red;">http://localhost:4200/user/completeProfile?token=${encodeURIComponent(token)}&mail=${mail}</a></p>
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



                        const message = {
                            from: constantes.MAIL_SENDER_ADDRESS,
                            to: mail,
                            replyTo: constantes.MAIL_REPLYTO_ADDRESS,
                            subject: constantes.VERIFICATION_EMAIL_SUBJECT_LINE,
                            text: text,
                            html: htmlMailTemp
                        };
                        const sentMail = await mailUtils.Envoyer(message);
                        if (sentMail) {
                            res.status(200).json({
                                message: "Password reset instructions have been sent to your email",
                                ok: true
                            })

                        }
                    }

                }

                return res.status(200).json({ message: 'user created suuccefuly ' + this.user })




            }

        } catch (err) {
            console.log(err)
            res.status(500).json({ err: "internal server error user: " + this.user });
        }
    },

    completeProfile: async (req, res) => {

        const url = req.protocol + "://" + req.get("host");
        console.log(req.body)
        const mail = req.body.mail;
        const token = req.body.token;
        console.log(mail, token)
        try {

            await resetToken.destroy({
                where: {
                    expiration: { [Op.lt]: Sequelize.fn('CURDATE') },
                }
            });

            const record = await resetToken.findOne({
                where: {
                    mail: mail,
                    expiration: { [Op.gt]: Sequelize.fn('NOW') },
                    token: token,
                    used: 0
                }
            });

            if (record == null) {
                res.status(401).json({ message: "The token has expired. Please try resetting password again" })
            }

            const expToken = await resetToken.update({
                used: 1
            },
                {
                    where: { mail: mail }
                });

            if (expToken) {
                console.log("done")
            }

            const finduser = await User.findOne({
                where: {
                    email: req.body.mail
                }
            });
            if (!finduser) {
                res.status(401).json({ message: "User Not Found !!" })
            }

            if (finduser) {
                finduser.update({
                    firstName: req.body.firstName ? req.body.firstName : finduser.firstName,
                    lastName: req.body.lastName ? req.body.lastName : finduser.lastName,
                    gender: req.body.gender ? req.body.gender : finduser.gender,
                    displayName: req.body.displayName ? req.body.displayName : finduser.displayName,
                    description: req.body.description ? req.body.description : finduser.description,
                    userImage: this.personnelimage ? this.personnelimage : finduser.personnelimage,
                    subscription: req.body.subscription ? req.body.subscription : finduser.subscription,
                    activated: true,
                });
            }
            if (finduser) {
                res.status(200).json({
                    message: "user updated succecfully",
                    user: finduser,
                    ok: true,
                });
            }



        } catch {
            res.status(500).json({ err: " internal server error" });
        }

    },

    updateProfile: async (req, res) => {
        const mail = req.body.mail;
        try {



            const finduser = await User.findOne({
                where: {
                    email: req.body.mail
                }
            });
            if (!finduser) {
                res.status(401).json({ message: "User Not Found !!" })
            }

            if (finduser) {
                finduser.update({
                    firstName: req.body.firstName ? req.body.firstName : finduser.firstName,
                    lastName: req.body.lastName ? req.body.lastName : finduser.lastName,
                    gender: req.body.gender ? req.body.gender : finduser.gender,
                    displayName: req.body.displayName ? req.body.displayName : finduser.displayName,
                    description: req.body.description ? req.body.description : finduser.description,
                    userImage: this.personnelimage ? this.personnelimage : finduser.personnelimage
                });
            }
            if (finduser) {
                res.status(200).json({
                    message: "user updated succecfully",
                    user: finduser,
                    ok: true,
                });
            }



        } catch {
            res.status(500).json({ err: " internal server error" });
        }

    },


    updateUserPhoto: async (req, res) => {

        const url = req.protocol + "://" + req.get("host");
        console.log(req.body)
        const mail = req.body.mail;
        const token = req.body.token;
        console.log(mail, token)
        const personnelimage = url + "/images/" + req.files["Image"][0].filename;

        try {

            await resetToken.destroy({
                where: {
                    expiration: { [Op.lt]: Sequelize.fn('CURDATE') },
                }
            });

            const finduser = await User.findOne({
                where: {
                    email: req.body.mail
                }
            });
            if (!finduser) {
                res.status(401).json({ message: "User Not Found !!" })
            }

            if (finduser) {

                const user = await finduser.update({
                    userImage: personnelimage ? personnelimage : finduser.userImage,
                });
                if (user) {
                    res.status(200).json({
                        message: "Images updated succecfully",
                        user: user,
                        ok: true,
                    });
                }

            }






        } catch (err) {
            res.status(500).json({ err: "internal server error" });
        }

    },


    getallusersLimit: async (req, res) => {
        try {
            const users = await User.findAll({
                where: { activated: true },
                limit: 5
            });
            if (users) {
                const count = await User.count()
                res.status(200).json({ users, count });
            }
        } catch (err) {
            res.status(500).json({ err: "Erreur au niveau de serveur : " + err });
        }
    },



    updatePassword: async (req, res) => {
        console.log(req.body);
        const oldpassword = req.body.oldpassword
        try {
            const user = await User.findOne(
                {
                    where: { email: req.body.mail }
                }
            )
            if (user) {
                const hashedpass = user.password;
                const pass = await bcrypt.compare(oldpassword, hashedpass);
                if (!pass) {
                    res.status(401).json({ err: "password doesn't match !!", ok: false });
                }
                const hash = await bcrypt.hash(req.body.password, 10);
                const upPass = user.update({ password: hash });
                if (upPass) {
                    res.status(200).json({ message: "password is updated succesfuly ", ok: true })
                }
            }

        } catch (err) {
            res.status(500).json({ err: "error in the server : " + err });
        }
    },

    addToBalance: async (req, res) => {
        const mail = req.body.mail
        const balance = req.body.balance
        try {
            const user = await User.findOne(
                {
                    where: { email: mail }
                }
            )
            const newBalance = balance + user.balance
            console.log(newBalance);
            if (user) {
                const addbalance = user.update({ balance: newBalance })
                if (addbalance) {
                    const user = await User.findOne(
                        {
                            where: { email: mail }
                        }
                    )
                    res.status(200).json({ message: "balance added ", ok: true, user: user })
                }
            }
        } catch (error) {
            res.status(500).json({ err: "error in the server : " + err });
        }
    },


    update: async (req, res) => {
        try {
            global.personnelimage;
            global.hashpass = "";

            /*if (req.files !== undefined) {
                this.personnelimage = url + "/images/" + req.files["Image"][0].filename;
            } */

            const url = req.protocol + "://" + req.get("host");

            const finduser = await User.findOne({
                where: { id: req.params.id }
            });
            if (req.body.password) {
                this.hashpass = await bcrypt.hash(req.body.password, 10);
            }
            if (finduser) {
                finduser.update({
                    firstName: req.body.firstName ? req.body.firstName : finduser.firstName,
                    lastName: req.body.lastName ? req.body.lastName : finduser.lastName,
                    gender: req.body.gender ? req.body.gender : finduser.gender,
                    displayName: req.body.displayName ? req.body.displayName : finduser.displayName,
                    description: req.body.description ? req.body.description : finduser.description,
                    userImage: this.personnelimage ? this.personnelimage : finduser.personnelimage,
                    subscription: req.body.subscription ? req.body.subscription : finduser.subscription
                });
            }
            if (finduser) {
                res.status(200).json({
                    message: "user updated succecfully",
                    user: finduser,
                    ok: true,
                });
            }

        } catch (err) {
            res.status(500).json({ err: "internal server error :" + err })

        }
    },

    loginSpid: async (req, res, next) => {
        try {
            global.user;
            const user = await User.findOne({
                where: { fiscalNumber: req.body.fiscalNumber }
            });
            console.log(user)
            if (!user) {
                res.status(401).json({ message: "wrong fiscal number!!", ok: false });
            }
            const accessToken = await jwt.sign({
                fiscalNumber: user.fiscalNumber,
                username: user.username,
                userId: user.id
            },
                SECRET, { expiresIn: '9h' });
            // const jwtDecode = jwt.decode(accessToken)


            if (!accessToken) {
                res.json({ message: "faild to connect !!", ok: false })
            } else {

                res.status(200).json({
                    accessToken: accessToken,
                    ok: true,
                    message: "user connected succesfully !!",
                    // decodedToken : jwtDecode
                });

            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: "internal server error :" + err })
        }
    },

    auth: async (req, res, next) => {
        try {
            global.user;
            const user = await User.findOne({
                where: { email: req.body.email }
            });
            console.log(user)
            if (!user) {
                res.status(401).json({ message: "wrong email or password !!", ok: false });
            }

            // if (user.activated === false) {
            //     res.status(401).json({ message: "your account is not activated !!", ok: false })
            // }

            const motpasse = req.body.password;
            const hashedpass = user.password;
            const pass = await bcrypt.compare(motpasse, hashedpass);
            if (!pass) {
                res.status(401).json({ message: "wrong email or password !!", ok: false });
            }



            const token = await jwt.sign({
                email: user.email,
                username: user.username,
                id: user.id
            },
                SECRET, { expiresIn: '9h' });

            if (!token) {
                res.json({ message: "faild to connect !!", ok: false })
            } else {

                res.status(200).json({
                    token: token,
                    user: user,

                    ok: true,
                    message: "user connected succesfully !!"
                });

            }



        } catch (err) {
            console.log(err);
            res.status(500).json({ err: "internal server error :" + err })
        }
    },

    updateImage: (req, res) => {

        const url = req.protocol + "://" + req.get("host");
        const image = url + "/images/" + req.files["Image"][0].filename;
        const imageToupdate = { Image: image };
        User.update(imageToupdate,
            {
                where: { id: req.params.id },
            }).then((userresponce) => {
                res.status(200).json({
                    imagepath: image,
                    message: "Image updated succesfuly",
                });
            }).catch((err) => {
                res.status(500).json({ err: "Erreur au niveau de serveur : " + err });
            });


    },




    forgotPass: async (req, res) => {
        try {
            mail = req.body.mail
            const user = User.findOne({
                where: { email: mail }
            });

            /**
             * we don't want to tell attackers that an
             * email doesn't exist, because that will let
             * them use this form to find ones that do
             * exist.
             **/
            if (!user) {
                res.status(200).json({ message: "mail has been sent to your Email adresse please check your E-mail to change the password" + req.body.mail, ok: true })
            }

            // Set an Experation date to the token
            var expireDate = new Date();
            expireDate.setHours(expireDate.getHours() + 1);
            const token = jwtUtils.generatTokenForuser(user, '1h');

            // set an new token to the DB
            await resetToken.create({
                mail: mail,
                expiration: expireDate,
                token: token,
                used: 0
            });


            console.log(user.firstName);
            // console.log(user.lastName);
            const text = `${user.firstName} ${user.lastName},
        A request to reset your password for your account has been made on VagaBeats.

        You can now log in by clicking on the link below or by copying it to your browser:

        http://localhost:4200/auth/forgotpassword/resetpassword?token=${encodeURIComponent(token)}&mail=${mail}
        
        This link can only be used once to log in and will take you to the page to change your password. It will expire in an hour and nothing will happen if it is not used.
        
        --  VagaBeats team`



            const message = {
                from: constantes.MAIL_SENDER_ADDRESS,
                to: mail,
                replyTo: constantes.MAIL_REPLYTO_ADDRESS,
                subject: constantes.FORGOT_PASS_SUBJECT_LINE + user.username + ' sur ' + constantes.APP_NAME,
                text: text
            };
            const sentMail = await mailUtils.Envoyer(message);
            if (sentMail) {
                res.status(200).json({
                    message: "Password reset instructions have been sent to your email",
                    ok: true
                })

            }



        } catch (err) {
            console.log(err);
            res.status(500).json({ err: "internal server error :" + err })
        }
    },

    resetPassword: async (req, res) => {

        const mail = req.body.mail;
        const token = req.body.token;
        console.log(mail, token)
        try {

            await resetToken.destroy({
                where: {
                    expiration: { [Op.lt]: Sequelize.fn('CURDATE') },
                }
            });

            const record = await resetToken.findOne({
                where: {
                    mail: mail,
                    expiration: { [Op.gt]: Sequelize.fn('NOW') },
                    token: token,
                    used: 0
                }
            });

            if (record == null) {
                res.status(401).json({ message: "The token has expired. Please try resetting password again" })
            }

            const expToken = await resetToken.update({
                used: 1
            },
                {
                    where: { mail: mail }
                });

            if (expToken) {
                console.log("done")
            }

            const userFound = await User.findOne({
                where: {
                    email: mail
                }
            });

            if (userFound) {
                res.status(200).json({ message: "password changed succesfully!", userFound });
                console.log(userFound)
            }

            const newPass = await bcrypt.hash(req.body.password, 10);
            const updPass = await userFound.update({
                password: newPass
            },
                {
                    where: { email: mail }
                });

            if (updPass) {
                res.status(200).json({ message: "password changed succesfully!" });
            }
            if (!updPass) {
                res.status(401).json({ message: "password not changed " });
                console.log("password not changed ")
            }


        } catch (err) {
            res.status(500).json({ err: "internal server error:" + err })
        }

    },


    validateCaptcha: (req, res) => {
        const token = req.body.recaptcha;
        console.log(token);
        // const secretkey = process.env.RECAPTCHA_SECRET_KEY; //the secret key from your google admin console;

        //token validation url is URL: https://www.google.com/recaptcha/api/siteverify 
        // METHOD used is: POST
        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${constantes.RECAPTCHA_SECRET_KEY}&response=${token}&remoteip=${req.connection.remoteAddress}`
        // const url =  `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`;
        //note that remoteip is the users ip address and it is optional
        // in node req.connection.remoteAddress gives the users ip address
        if (token === null || token === undefined || token === '') {
            return res.status(201).json({ success: false, message: "Le jeton est vide ou non valide" });
        }
        request(url, (err, response, body) => {
            //the body is the data that contains success message
            body = JSON.parse(body);
            console.log(body)

            //check if the validation failed
            if (body.success !== undefined && !body.success) {
                res.status(200).json({
                    success: false,
                    message: "échec de recaptcha."
                });
            }

            //if passed response success message to client
            res.status(200).json({
                success: true,
                message: "recaptcha passé."
            });
        });
    },

    desactivateUser: async (req, res) => {
        const id = req.body.id
        try {
            const findUser = await User.findOne({
                where: { id: id }
            });
            if (findUser) {
                await findUser.update({
                    activated: false
                })
                res.status(200).json({ message: "user desactivated" })
            }

        } catch (error) {
            res.status(500).json({ error: "Internal server error!" })
        }
    },

    setAdmin: async (req, res) => {
        const id = req.body.id
        try {
            const findUser = await User.findOne({
                where: { id: id }
            });
            if (findUser) {
                await findUser.update({
                    Role: "admin"
                })
                res.status(200).json({ message: "user desactivated" })
            }

        } catch (error) {
            res.status(500).json({ error: "Internal server error!" })
        }
    }


}


