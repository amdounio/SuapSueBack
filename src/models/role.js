module.exports = (db, type) => {
    return db.define("role", {
        label: {
          type: type.STRING
        },
        code_role: {
          type: type.STRING
        },
        weight: {
          type: type.INTEGER
        }
      });
}