module.exports = (db, type) => {
    return db.define("optionChoice", {
        optionChoiceName: {
          type: type.STRING
        } 
      });
}