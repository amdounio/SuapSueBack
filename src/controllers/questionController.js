const {Question,SurveySection,InputType} = require("../database/relations")

const env = process.env.NODE_ENV || 'production'
module.exports={
    create: async (req,res)=>{
        try {
            const creation = await Question.create(req.body)
            if (creation) {
                res.status(200).json({msg:"entity created succesfully !!",entity: creation})
            } 
        } catch (error) {
            res.status(500).json({ error: "Internal server Error !! " })
        }
    },


    getAll: async (req, res) => {
        try {
            const Questions = await Question.findAll({
                include: [
                    {
                        model: SurveySection,
                        as: 'surveySection'
                    },
                    {
                        model: InputType,
                        // as: 'inputTypes'
                    }
                ]
            })
            console.log(Questions)
            if (Questions) {
                res.status(200).json({ entities : Questions })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server Error !! "+error })
        }
    },

    getOne: async (req, res) => {
        try {
            const entity = await Question.findOne({
                where:{id:req.params.id},
                include: [
                    {
                        model: SurveySection,
                        as: 'surveySection'
                    },
                    {
                        model: InputType,
                        // as: 'inputTypes'
                    }
                ]
            })
            res.status(200).json({entity})
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server Error !! " })
        }
    },
}