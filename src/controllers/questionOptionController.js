const {QuestionOption, Question, InputType} = require("../database/relations");

const env = process.env.NODE_ENV || 'production'

module.exports ={
    create: async (req,res)=>{
        try {
            const creation = await QuestionOption.create(req.body)
            if (creation) {
                res.status(200).json({msg:"entity created succesfully !!",entity: creation})
            } 
        } catch (error) {
            res.status(500).json({ error: "Internal server Error !! " })
        }
    },


    getAll: async (req, res) => {
        try {
            const QuestionOptions = await QuestionOption.findAll({})

            console.log(QuestionOptions)
            if (QuestionOptions) {
                res.status(200).json({ entities : QuestionOptions })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server Error !! " +error})
        }
    },

    getOne: async (req, res) => {
        try {
            const entity = await QuestionOption.findOne({
                where:{id:req.params.id}
            })
            res.status(200).json({entity})

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server Error !! " })
        }
    },
}