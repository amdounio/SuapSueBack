module.exports = (db, type) => {
    return db.define("surveySection", {
        sectionName: {
        type: type.STRING
      },
      sectionTitle: {
        type: type.STRING
      },
      sectionSubheading: {
        type: type.STRING
      },
      sectionRequired: {
        type: type.BOOLEAN
      }
      
    });
    
}