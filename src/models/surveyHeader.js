module.exports = (db, type) => {
    return db.define("surveyHeader", {
        surveyName: {
          type: type.STRING
        },
        infos: {
          type: type.STRING
        }
      });
}