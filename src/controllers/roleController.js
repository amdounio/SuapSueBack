const {Role} = require("../database/relations")

const env = process.env.NODE_ENV || 'production'
module.exports ={
    create: async (req,res)=>{
        try {
            const creation = await Role.create(req.body)
            if (creation) {
                res.status(200).json({msg:"Role created succesfully !!",entity: creation})
            } 
        } catch (error) {
            res.status(500).json({ error: "Internal server Error !! " })
        }
    },


    getAll: async (req, res) => {
        try {
            const Roles = await Role.findAll()
            console.log(Roles)
            if (Roles) {
                res.status(200).json({ entities : Roles })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server Error !! " })
        }
    },

    getOne: async (req, res) => {
        try {
            const entity = await Role.findOne({
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