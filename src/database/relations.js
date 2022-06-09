const { Sequelize } = require("sequelize");
const db = require("../database/db");
const userModel = require("../models/user");
const answerModel = require("../models/answer");
const inputTypeModel = require("../models/inputType");
const municipalityModel = require("../models/municipality");
const optionChoiceModel = require("../models/optionChoice");
const optionGroupModel = require("../models/optionGroup");
const questionModel = require("../models/question");
const resetTokenModel = require("../models/resetToken");
const roleModel = require("../models/role");
const surveyHeaderModel = require("../models/surveyHeader");
const surveySectionModel = require("../models/surveySection");
const ticketModel = require("../models/ticket");
const ticketCategoryModel = require("../models/ticketCategory");
// RELATION MODELS
const userRolesModel = require("../models/user-roles");
const UserSurveySectionModel = require("../models/user-section-survey");
const MunicipalitySurveyHeaderModel = require("../models/municipality-survey-header");
const questionOptionModel = require("../models/question-option");

const sequelize = require("../database/db");

const User = userModel(db, Sequelize);
const Answer = answerModel(db, Sequelize);
const InputType = inputTypeModel(db, Sequelize);
const Municipality = municipalityModel(db, Sequelize);
const OptionChoice = optionChoiceModel(db, Sequelize);
const OptionGroup = optionGroupModel(db, Sequelize);
const Question = questionModel(db, Sequelize);
const ResetToken = resetTokenModel(db, Sequelize);
const Role = roleModel(db, Sequelize);
const SurveyHeader = surveyHeaderModel(db, Sequelize);
const SurveySection = surveySectionModel(db, Sequelize);
const Ticket = ticketModel(db, Sequelize);
const TicketCategory = ticketCategoryModel(db, Sequelize);
const userRoles = userRolesModel(db, Sequelize);
const MunicipalitySurveyHeader = MunicipalitySurveyHeaderModel(db, Sequelize);
const UserSurveySection = UserSurveySectionModel(db, Sequelize)
const QuestionOption = questionOptionModel(db, Sequelize);

// RELATIONS
//! Relation USER ROLE
//? ManyToMany
User.belongsToMany(Role, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    through: userRoles
});
Role.belongsToMany(User, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    through: userRoles
});

// ================================
//! Relation Municipality SurveyHeader
//? ManyToMany
Municipality.belongsToMany(SurveyHeader, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    through: MunicipalitySurveyHeader
});
SurveyHeader.belongsToMany(Municipality, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    through: MunicipalitySurveyHeader
});

// ================================
//! Relation  User SurveySection
//? ManyToMany
User.belongsToMany(SurveySection, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    through: UserSurveySection
});
SurveySection.belongsToMany(User, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    through: UserSurveySection
});

// ================================
//! Relation Question InputType
//? ManyToMany
Question.belongsToMany(InputType, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    through: QuestionOption
});
InputType.belongsToMany(Question, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    through: QuestionOption
});

// ================================
//! Relation TicketCategory Tickets
//? OneToOne
TicketCategory.hasOne(Ticket, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})
Ticket.belongsTo(TicketCategory,{
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})

// ================================
//! Relation TicketCategory Tickets
//? OneToOne
Municipality.hasOne(Answer, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})
Answer.belongsTo(Municipality,{
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})

// ================================
//! Relation TicketCategory Tickets
//? OneToOne
OptionGroup.hasOne(OptionChoice, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})
OptionChoice.belongsTo(OptionGroup,{
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})

// ================================
//! Relation TicketCategory Tickets
//? OneToOne
SurveySection.hasOne(Question, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})
Question.belongsTo(SurveySection,{
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})
// ================================
//! Relation TicketCategory Tickets
//? OneToOne
SurveyHeader.hasOne(SurveySection, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
})
SurveySection.belongsTo(SurveyHeader,{
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})



db.sync({ alter: true })
    .then(() => {
        console.log("table updated successfully !!!!!!");
    })
    .catch((e) => {
        console.log(e);
    });
module.exports = {
    User,
    InputType,
    Answer,
    Municipality,
    OptionChoice,
    OptionGroup,
    Question,
    ResetToken,
    Role,
    SurveyHeader,
    SurveySection,
    Ticket,
    TicketCategory,
    userRoles,
    QuestionOption
};