module.exports = (db,type)=>{
    return db.define('municipality_surveyHeader',{
        id:{
            type : type.INTEGER,
            primaryKey: true,
            autoIncrement:true,
            allowNull: false
        }, 
    })
}