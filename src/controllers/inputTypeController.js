const { Question, InputType} = require("../database/relations");

const env = process.env.NODE_ENV || 'production'

module.exports ={
    create: async (req,res)=>{
        try {
            const creation = await InputType.create(req.body)
            if (creation) {
                res.status(200).json({msg:"entity created succesfully !!",entity: creation})
            } 
        } catch (error) {
            res.status(500).json({ error: "Internal server Error !! " })
        }
    },


    getAll: async (req, res) => {
        try {
            const inputTypes = await InputType.findAll({})

            console.log(inputTypes)
            if (inputTypes) {
                res.status(200).json({ entities : inputTypes })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server Error !! " +error})
        }
    },

    getOne: async (req, res) => {
        try {
            const entity = await InputType.findOne({
                where:{id:req.params.id}
            })
            res.status(200).json({entity})

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server Error !! " })
        }
    },
}