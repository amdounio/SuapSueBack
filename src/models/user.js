module.exports = (db, type) => {
    return db.define("user", {
        username: {
          type: type.STRING
        },
        firstName: {
          type: type.STRING
        },
        lastName: {
          type: type.STRING
        },
        tel: {
          type: type.INTEGER
        },
        password: {
          type: type.STRING
        },
        email: {
          type: type.STRING
        },
        lastLoginDate: {
          type: type.STRING 
        },
        fiscalNumber:{
          type: type.STRING
        }  
      });
}