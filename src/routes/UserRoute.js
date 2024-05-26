const { validateRequestBody } = require("../function/Validator");
const { AddUser,  SearchUser } = require("../model/user");
const jwt = require("jsonwebtoken");

const RegisterUser = async (req, res) => {
    try {
      const data = req.body;
      const requiredFields = [ "email", "password"];
  
      const isValidRequest = validateRequestBody(data, requiredFields);
      if (!isValidRequest) {
        throw new Error("Incomplete data provided.");
      }
  
      const searchingUser = await SearchUser(data)
  
      if (searchingUser.length > 0) {
        const payload = { id: searchingUser.id, username: searchingUser.username, email: searchingUser.email };
        const accessToken = jwt.sign(payload, process.env.SECRET_KEY_TOKEN, {
          expiresIn: "10m",
        });
        const refreshToken = jwt.sign(payload, process.env.SECRET_KEY_REFRESH_TOKEN, {
          expiresIn: "1d",
        });
  
        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
  
        searchingUser.accessToken = accessToken;
  
        res.status(200).send({ msg: "Login successful", data: searchingUser });
          
      }else{
          res.status(500).send({ msg: "Internal server error" });
      }
  
    } catch (error) {
      res.status(500).send({ msg: error.message });
  
    }
  }


  const LoginUser =  async (req, res) => {
    try {
      const data = req.body;
      const requiredFields = ["username", "email", "password", "asal_daerah"];
  
      const isValidRequest = validateRequestBody(data, requiredFields);
      if (!isValidRequest) {
        throw new Error("Incomplete data provided.");
      }
  
      const newUser = await AddUser(data);
  
      if (newUser) {
        const payload = { id: newUser.id, username: newUser.username, email: newUser.email };
        const accessToken = jwt.sign(payload, process.env.SECRET_KEY_TOKEN, {
          expiresIn: "10m",
        });
        const refreshToken = jwt.sign(payload, process.env.SECRET_KEY_REFRESH_TOKEN, {
          expiresIn: "1d",
        });
  
        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
  
        newUser.accessToken = accessToken;
  
        res.status(201).send({ msg: "Registration successful", data: newUser });
      } else {
        res.status(500).send({ msg: "Internal server error" });
      }
    } catch (error) {
      res.status(500).send({ msg: error.message });
    }
  }


  module.exports={
    RegisterUser,
    LoginUser
  }