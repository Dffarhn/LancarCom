const express = require("express")
const cors = require("cors")
const cookieparser = require("cookie-parser");
const dotenv = require("dotenv");
const { route } = require("./src/routes/route");
dotenv.config()

const app = express();
const PORT = process.env.PORT || 3002
const corsOptions = {
    origin: "*", // Replace 'https://example.com' with your specific URL
    optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"], // Allow specified HTTP methods
  };
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieparser());

app.use(route)

app.listen(PORT,()=>{
    console.log(`ur running on http://localhost:${PORT}`)
})



