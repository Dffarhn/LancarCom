const { Router } = require("express");

const { RegisterUser, LoginUser } = require("./UserRoute");
const { GetDompet } = require("./DompetAuth");
const { Auth_Access } = require("../middleware/AccessRoute");
const { AddAlurKeuangan, VerifyAlurKeuangan } = require("./DataKeuanganAuth");

const route = Router();

route.get("/", (req, res) => {
  res.send("halo world");
});

route.post("/login", LoginUser );

route.post("/register", RegisterUser);


//endpoint for dompet
route.get("/dompet/:access_id",GetDompet)
// route.patch("/dompet/:access_id")


//request access id for user government


//post data_keuangan
route.post("/add/alur/keuangan",Auth_Access,AddAlurKeuangan)
route.patch("/verify/alur/keuangan/:id",Auth_Access,VerifyAlurKeuangan)

module.exports = { route };
