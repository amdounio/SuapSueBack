module.exports = (db, type) => {
    return db.define("InputType", {
        inputTypeName: {
        type: type.STRING
      } 
    });
}