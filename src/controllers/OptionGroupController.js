const {OptionGroup} = require("../database/relations");

const env = process.env.NODE_ENV || 'production'

module.exports = {
    create: async (req,res)=>{
        try {
            const creation = await OptionGroup.create(req.body)
            if (creation) {
                res.status(200).json({msg:"entity created succesfully !!",entity: creation})
            } 
        } catch (error) {
            res.status(500).json({ error: "Internal server Error !! " })
        }
    },


    getAll: async (req, res) => {
        try {
            const OptionGroups = await OptionGroup.findAll()
            console.log(OptionGroups)
            if (OptionGroups) {
                res.status(200).json({ entities : OptionGroups })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server Error !! " })
        }
    },

    getOne: async (req, res) => {
        try {
            const entity = await OptionGroup.findOne({
                where:{id:req.params.id}
            })
            res.status(200).json({entity})

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server Error !! " })
        }
    },
}