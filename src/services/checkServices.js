
const userServices = require('../services/userServices')


exports.usernameExist = async (username)=>{
    let user = await userServices.getOneByUsername(username);
    if(user.body) return true ;
    return false ;
}
exports.emailExist = async (email)=>{
    let user = await userServices.getOneByEmail(email);
    if(user.body) return true ;
    return false ;
}

