module.exports = (db, type) => {
    return db.define("Ticket", {
        label: {
          type: type.STRING
        },
        description: {
          type: type.STRING
        },
        statue: {
          type: type.INTEGER
        },
        firstName: {
          type: type.STRING
        },
        lastName: {
          type: type.STRING
        },
        email: {
          type: type.STRING
        },
        area: {
          type: type.STRING
        },
        ticketcol: {
          type: type.INTEGER
        },
        response: {
          type: type.INTEGER
        }
      });
}