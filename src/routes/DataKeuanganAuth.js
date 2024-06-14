const { validateRequestBody } = require("../function/Validator");
const { SearchUserForAccessIdDB, AddAlurKeuanganDB, VerifyAlurKeuanganDB, GetAllDataKeuanganToDB, GetStatisticAllDataKeuanganToDB, GetAllDataKeuanganToDBPenerima, GetDataKeuanganToDB, GetDataKeuanganToDBPenerima, GetStatisticAllMonthDataKeuanganToDB } = require("../model/DataKeuanganModel");
const { GetDompetAuthDB, UpdateDompetAuthDB } = require("../model/DompetAuth");

const AddAlurKeuangan = async (req, res) => {
  try {
    // Verify and decode the JWT to extract the user ID
    const userId = req.user.id;
    // Use the user ID to fetch user details from the database
    const user = await SearchUserForAccessIdDB(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Proceed with your logic for adding Alur Keuangan
    // For example, insert data into the database, etc.
    const data = req.body;
    const requiredFields = ["penerima", "pemberi", "uang_turunan"];

    const isValidRequest = validateRequestBody(data, requiredFields);
    if (!isValidRequest) {
      throw new Error("Incomplete data provided.");
    }

    const AddAlurKeuangan = await AddAlurKeuanganDB(data, user[0]);

    if (!AddAlurKeuangan[0].id) {
      res.status(500).json({ message: `Failed to Add Alur Keuangan ke database` });
    }

    // Respond with success message
    res.status(200).json({ message: "Alur Keuangan added successfully" });
  } catch (error) {
    res.status(500).json({ message: `Failed to Add Alur Keuangan: ${error.message}` });
  }
};

const VerifyAlurKeuangan = async (req, res) => {
  try {
    // Verify and decode the JWT to extract the user ID
    const userId = req.user.id;
    // Use the user ID to fetch user details from the database
    const user = await SearchUserForAccessIdDB(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const data = req.body;
    const id = req.params.id;
    const requiredFields = ["uang_diterima"];

    const isValidRequest = validateRequestBody(data, requiredFields);
    if (!isValidRequest) {
      throw new Error("Incomplete data provided.");
    }

    data.id = id

    const VerifyAlurKeuangan = await VerifyAlurKeuanganDB(data, user[0]);

    if (!VerifyAlurKeuangan[0].id) {
      res.status(500).json({ message: `Failed to verify Alur Keuangan ke database` });
    }
      
    res.status(200).json({ message: "Alur Keuangan Verify successfully" });
    

    // Respond with success message
  } catch (error) {
    res.status(500).json({ message: `Failed to Verify Alur Keuangan: ${error.message}` });
  }
};


const GetAllDataKeuangan = async (req,res)=>{
  try {

    const userId = req.user.id;
    // Use the user ID to fetch user details from the database
    const user = await SearchUserForAccessIdDB(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const {access_id} = user[0];



    const AllDataKeuangan = await GetAllDataKeuanganToDB(access_id)

    if (AllDataKeuangan) {
      res.status(200).send({ msg: "Query Successfully", data: AllDataKeuangan });
    } else {
      throw new Error("failed to get fetch from Database");
    }


    
  } catch (error) {
    res.status(500).send({msg:`${error.message}`})
    
  }
}
const GetAllDataKeuanganPenerima = async (req,res)=>{
  try {

    const userId = req.user.id;
    // Use the user ID to fetch user details from the database
    const user = await SearchUserForAccessIdDB(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const {access_id} = user[0];



    const AllDataKeuangan = await GetAllDataKeuanganToDBPenerima(access_id)

    if (AllDataKeuangan) {
      res.status(200).send({ msg: "Query Successfully", data: AllDataKeuangan });
    } else {
      throw new Error("failed to get fetch from Database");
    }


    
  } catch (error) {
    res.status(500).send({msg:`${error.message}`})
    
  }
}
const GetDataKeuangan = async (req,res)=>{
  try {

    const userId = req.user.id;
    // Use the user ID to fetch user details from the database
    const user = await SearchUserForAccessIdDB(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const {access_id} = user[0];

    const {id} = req.params


    const AllDataKeuangan = await GetDataKeuanganToDB(access_id,id)

    if (AllDataKeuangan) {
      res.status(200).send({ msg: "Query Successfully", data: AllDataKeuangan });
    } else {
      throw new Error("failed to get fetch from Database");
    }


    
  } catch (error) {
    res.status(500).send({msg:`${error.message}`})
    
  }
}
const GetDataKeuanganPenerima = async (req,res)=>{
  try {

    const userId = req.user.id;
    // Use the user ID to fetch user details from the database
    const user = await SearchUserForAccessIdDB(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const {access_id} = user[0];
    const {id} = req.params




    const AllDataKeuangan = await GetDataKeuanganToDBPenerima(access_id,id)

    if (AllDataKeuangan) {
      res.status(200).send({ msg: "Query Successfully", data: AllDataKeuangan });
    } else {
      throw new Error("failed to get fetch from Database");
    }


    
  } catch (error) {
    res.status(500).send({msg:`${error.message}`})
    
  }
}


const GetStatisticAllDataKeuangan = async (req,res)=>{
  try {

    const userId = req.user.id;
    // Use the user ID to fetch user details from the database
    const user = await SearchUserForAccessIdDB(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const {access_id} = user[0];

    const StatisticAllDataKeuangan = await GetStatisticAllDataKeuanganToDB(access_id,req.query)

    if (StatisticAllDataKeuangan) {
      res.status(200).send({ msg: "Query Successfully", data: StatisticAllDataKeuangan });
    } else {
      throw new Error("failed to get fetch from Database");
    }


    
  } catch (error) {
    res.status(500).send({msg:`${error.message}`})
    
  }
}
const GetStatisticAllMonthDataKeuangan = async (req,res)=>{
  try {

    const userId = req.user.id;
    // Use the user ID to fetch user details from the database
    const user = await SearchUserForAccessIdDB(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const {access_id} = user[0];

    const StatisticAllDataKeuangan = await GetStatisticAllMonthDataKeuanganToDB(access_id)

    if (StatisticAllDataKeuangan) {
      res.status(200).send({ msg: "Query Successfully", data: StatisticAllDataKeuangan });
    } else {
      throw new Error("failed to get fetch from Database");
    }


    
  } catch (error) {
    res.status(500).send({msg:`${error.message}`})
    
  }
}
module.exports = { 
  AddAlurKeuangan,
  VerifyAlurKeuangan,
  GetAllDataKeuangan,
  GetStatisticAllDataKeuangan,
  GetAllDataKeuanganPenerima,
  GetDataKeuangan,
  GetDataKeuanganPenerima,
  GetStatisticAllMonthDataKeuangan
 };
