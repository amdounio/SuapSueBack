module.exports = (db, type) => {
    return db.define("Question", {
        parent_id: {
          type: type.INTEGER
        },
        question_name: {
          type: type.STRING
        },
        question_subtext: {
          type: type.STRING
        },
        answer_required_yn: {
          type: type.BOOLEAN
        },
        allow_mutiple_option_answers: {
          type: type.BOOLEAN
        },
        dependent_question_id: {
          type: type.INTEGER
        },
        dependent_question_option_id: {
          type: type.INTEGER
        },
        dependent_answer_id: {
          type: type.INTEGER
        }
      });
}