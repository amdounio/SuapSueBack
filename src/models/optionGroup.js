module.exports = (db, type) => {
    return db.define("optionGroup", {
        optionGroupName: {
          type: type.STRING
        } 
      });
}