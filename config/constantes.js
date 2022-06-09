require('dotenv/config');
// Constantes de l'application
const JWT_KEY = "4SIQr7JeVfCOlmExJlC6WlH6exxtXvOoGfecDfY1ujqWspqzGIE24wUKSNbV";
const TOKEN_TIME_EXPIRES = '1d';
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;
const LOGIN_MAX_LENGTH = 12;
const LOGIN_MIN_LENGTH = 5;
const PASSWORD_MAX_LENGTH = 8;
const PASSWORD_MIN_LENGTH = 4;
const HOSTS_ALLOWED_ORIGIN = ['http://localhost:4200'];
const PUBLIC_FOLDER_PATH = 'src/public';
const STATIC_PATH = '/static';
const PUBLIC_FOLDER_WEB_PATH = process.env.APP_HOST + ':' + process.env.APP_PORT + STATIC_PATH;
const {htmlMailTemp} = require('../config/mailtemp')


//Parametres serveur Mail
MAIL_HOST = 'smtp.gmail.com'
MAIL_HOST_PORT = 465
MAIL_HOST_USER = 'ossamahedli@gmail.com'
MAIL_HOST_PASS = 'ossabob04MVP'
MAIL_SENDER_ADDRESS = '"vagaBeats" <ossamahedli@gmail.com>'
MAIL_REPLYTO_ADDRESS = '"VagaBeats" <ossamahedli@gmail.com>'
FORGOT_PASS_SUBJECT_LINE = 'Modification des informations de connexion pour '
VERIFICATION_EMAIL_SUBJECT_LINE = 'VagaBeats Email Verification'
PRODUCT_ACCEPTED_SUBJECT_LINE = 'Product Accepted On VagaBeats'
PRODUCT_SELLED_SUBJECT_LINE = 'Product purchased On VagaBeats'
DOMAIN = 'localhost:4200'

//Constantes de l'application
FIX_ROUTE_PATH = '/api/v1/'
RECAPTCHA_SECRET_KEY = '6LdRtNYUAAAAADs0Xk5kr1pQDTP7pKekoGHWiYuF'

module.exports = {
    JWT_KEY,
    EMAIL_REGEX,
    PASSWORD_REGEX,
    LOGIN_MAX_LENGTH,
    LOGIN_MIN_LENGTH,
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
    HOSTS_ALLOWED_ORIGIN,
    PUBLIC_FOLDER_PATH,
    PUBLIC_FOLDER_WEB_PATH,
    STATIC_PATH,
    TOKEN_TIME_EXPIRES,
    MAIL_HOST,
    MAIL_HOST_PORT,
    MAIL_HOST_USER,
    MAIL_HOST_PASS,
    MAIL_SENDER_ADDRESS,
    MAIL_REPLYTO_ADDRESS,
    FORGOT_PASS_SUBJECT_LINE,
    DOMAIN,
    RECAPTCHA_SECRET_KEY,
    VERIFICATION_EMAIL_SUBJECT_LINE,
    htmlMailTemp,
    PRODUCT_ACCEPTED_SUBJECT_LINE,
    PRODUCT_SELLED_SUBJECT_LINE
    
  }