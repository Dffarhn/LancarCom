const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv");
const { route } = require("./src/routes/route");
dotenv.config()

const app = express();
const PORT = process.env.PORT || 3002

app.use(cors())
app.use(express.json())

app.use(route)

app.listen(PORT,()=>{
    console.log(`ur running on http://localhost:${PORT}`)
})



