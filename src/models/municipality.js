module.exports = (db, type) => {
    return db.define("municipality", {
        name: {
          type: type.STRING
        } 
      });
}