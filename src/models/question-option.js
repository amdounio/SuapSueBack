module.exports = (db,type)=>{
    return db.define('question_option',{
        id:{
            type : type.INTEGER,
            primaryKey: true,
            autoIncrement:true,
            allowNull: false
        }, 
        selfGranted : type.BOOLEAN
    })
}