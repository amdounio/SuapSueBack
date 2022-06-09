module.exports = (db,type)=>{
    return db.define('user_roles',{
        id:{
            type : type.INTEGER,
            primaryKey: true,
            autoIncrement:true,
            allowNull: false
        }, 
        selfGranted : type.BOOLEAN
    })
}