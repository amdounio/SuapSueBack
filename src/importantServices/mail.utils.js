const nodemailer = require('nodemailer');
const constantes = require('../../config/constantes')
const { google } = require('googleapis');

  
module.exports = {
    Envoyer: async (mailOptions) => {
        const transporter = nodemailer.createTransport({
          host: constantes.MAIL_HOST,
          port: constantes.MAIL_HOST_PORT,
          secure: true,
          auth: {
            user:  constantes.MAIL_HOST_USER, 
            pass:  constantes.MAIL_HOST_PASS 
          },
          tls: {
            rejectUnauthorized: false
         }
        }); 
        // console.log(mailOptions);
        return await transporter.sendMail(mailOptions)
        .then(result => {
            return {
              status : 200,
              body : {
                  message: result
              }
          }
        }).catch(err=>{ throw err; });
    },





 
}