module.exports = (db, type) => {
    return db.define('resetToken', {
        id: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        mail : {
            type : type.STRING(50)
        },

        token : {
            type : type.STRING(255)
        },

        expiration: {
            type: type.DATE
        },

        used: {
            type: type.BOOLEAN
        }

    })
}