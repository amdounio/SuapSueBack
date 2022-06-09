const {Municipality, SurveyHeader} = require("../database/relations")

const env = process.env.NODE_ENV || 'production'
module.exports ={
    create: async (req,res)=>{
        try {
            const creation = await Municipality.create(req.body)
            if (creation) {
                res.status(200).json({msg:"entity created succesfully !!",entity: creation})
            } 
        } catch (error) {
            res.status(500).json({ error: "Internal server Error !! " })
        }
    },


    getAll: async (req, res) => {
        try {
            const Municipalitys = await Municipality.findAll({
                include: [
                    {
                        model: SurveyHeader,
                        as: 'surveyHeaders'
                    }
                ]
            })
            console.log(Municipalitys)
            if (Municipalitys) {
                res.status(200).json({ entities : Municipalitys })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server Error !! " })
        }
    },

    getOne: async (req, res) => {
        try {
            const entity = await Municipality.findOne({
                where: {
                    id: req.params.id,
                },
                include: [
                    {
                        model: SurveyHeader,
                        as: 'surveyHeaders'
                    }
                ]
            });
            if (entity) {
                res.status(200).json({ entity: entity });
            }
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