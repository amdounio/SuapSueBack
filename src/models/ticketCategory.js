module.exports = (db, type) => {
    return db.define("TicketCategory", {
        Label: {
        type: type.STRING
      }
    });
}