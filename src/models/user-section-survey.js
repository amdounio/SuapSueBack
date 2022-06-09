module.exports = (db,type)=>{
    return db.define('user_survey_section',{
        id:{
            type : type.INTEGER,
            primaryKey: true,
            autoIncrement:true,
            allowNull: false
        }, 
        selfGranted : type.BOOLEAN
    })
}