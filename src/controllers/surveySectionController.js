const { SurveySection, Municipality, SurveyHeader } = require("../database/relations")
const surveySection = require("../models/surveySection")

const env = process.env.NODE_ENV || 'production'
module.exports = {
    create: async (req, res) => {
        try {
            const creation = await SurveySection.create(req.body)
            if (creation) {
                res.status(200).json({ msg: "SurveySection created succesfully !!", entity: creation })
            }
        } catch (error) {
            res.status(500).json({ error: "Internal server Error !! " })
        }
    },


    getAll: async (req, res) => {
        try {
            const SurveySections = await SurveySection.findAll()
            console.log(SurveySections)
            if (SurveySections) {
                res.status(200).json({ entities: SurveySections })
            }
        } catch (error) {
            console.log(error);
        }
    },

    getAllWithType: async (req, res) => {
        try {
            console.log('bla bla');
            global.headerID
            const getMunicipality = await Municipality.findOne({
                where: { id: req.params.id },
                include: [
                    {
                        model: SurveyHeader,
                        as: 'surveyHeaders'
                    }
                ]
            });
            if (getMunicipality) {
                console.log(getMunicipality);
                this.headerID = getMunicipality?.surveyHeaders[0].id
                console.log(this.headerID);
                const entities = await SurveySection.findAll({
                    where: { surveyHeaderId: this.headerID }
                });
                console.log(entities);
                res.status(200).json({entities})
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server Error !! "+error })
        }
    },

    getOne: async (req, res) => {
        try {
            const entity = await surveySection.findOne({
                where:{id:req.params.id}
            })
            res.status(200).json({entity})

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server Error !! " })
        }
    },

    update: async (req, res) => {
        try {
            //todo UPDATE
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server Error !! " })
        }
    },

    delete: async (req, res) => {
        try {
            //todo DELETE
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server Error !! " })
        }
    },
}