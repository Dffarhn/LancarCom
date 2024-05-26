const { validateRequestBody } = require("../function/Validator");
const { SearchUserForAccessIdDB, AddAlurKeuanganDB, VerifyAlurKeuanganDB } = require("../model/DataKeuanganModel");

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

    const VerifyAlurKeuangan = await VerifyAlurKeuanganDB(data, user[0], id);

    if (!VerifyAlurKeuangan[0].id) {
      res.status(500).json({ message: `Failed to Add Alur Keuangan ke database` });
    }

    // Respond with success message
    res.status(200).json({ message: "Alur Keuangan Verify successfully" });
  } catch (error) {
    res.status(500).json({ message: `Failed to Verify Alur Keuangan: ${error.message}` });
  }
};

module.exports = { AddAlurKeuangan,VerifyAlurKeuangan };
