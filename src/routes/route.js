const { Router } = require("express");

const { RegisterUser, LoginUser } = require("./UserRoute");
const { GetDompet } = require("./DompetAuth");
const { Auth_Access } = require("../middleware/AccessRoute");
const { AddAlurKeuangan, VerifyAlurKeuangan } = require("./DataKeuanganAuth");
const { GetAllDaerahAccessId, AddRequestAccessId } = require("./AccessIdRoute");
const { AddReviewUser, GetReviewUser } = require("./ReviewRoute");

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
route.get("/access_id/daerah",GetAllDaerahAccessId)
route.post("/request/access_id",Auth_Access,AddRequestAccessId)




//post data_keuangan
route.post("/add/alur/keuangan",Auth_Access,AddAlurKeuangan)
route.patch("/verify/alur/keuangan/:id",Auth_Access,VerifyAlurKeuangan)



//Review User

route.get("/review",Auth_Access,GetReviewUser)
route.post("/review",Auth_Access,AddReviewUser)

module.exports = { route };
