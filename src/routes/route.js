const {Router} = require("express")

const route = Router()


route.get("/",(req,res)=>{
    res.send("halo world")
})




route.post('/login', (req,res))


module.exports = {route}