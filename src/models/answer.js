module.exports = (db, type) => {
    return db.define("answer", {
        answerNumeric: {
          type: type.INTEGER
        },
        answerText: {
          type: type.STRING
        },
        answerYn: {
          type: type.BOOLEAN
        }   
      });
}