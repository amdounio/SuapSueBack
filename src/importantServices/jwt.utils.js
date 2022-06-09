//Imports
const jwt = require('jsonwebtoken');
const { JWT_KEY, TOKEN_TIME_EXPIRES } = require('../../config/constantes');
//exported functions
module.exports = {
    generatTokenForuser: function(userData, expiresIn = null){
        return jwt.sign({
            userId: userData.id,
            roles: userData.roles,
            status: userData.status
        },
        JWT_KEY,
        {
            expiresIn: expiresIn ? expiresIn : TOKEN_TIME_EXPIRES
        })
    },

    parseAuthorization: function(authorization){
        return (authorization != null) ? authorization.replace('Bearer ', '') : null;
    },

    getUserId: function(authorization){
        let userId = -1;
        let token = module.exports.parseAuthorization(authorization);
        if(token != null){
            try {
                let jwtToken = jwt.verify(token, JWT_KEY);
                if(jwtToken != null){
                    userId = jwtToken.userId;
                }
            }catch(err) {}
        }
        return userId;
    },

    getTokenParams: function(authorization){
        let tokenParams = new Object;
        let token = module.exports.parseAuthorization(authorization);
        if(token != null){
            try {
                let jwtToken = jwt.verify(token, JWT_KEY);
                if(jwtToken != null){
                    tokenParams.userId = jwtToken.userId;
                    tokenParams.roles = jwtToken.roles;
                    tokenParams.status = jwtToken.status;
                }
            }catch(err) {}
        }
        //console.log(tokenParams);
        return tokenParams;
    }
}