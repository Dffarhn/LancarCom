const { validatorUUID } = require("../function/Validator");
const { GetDompetAuthDB, UpdateDompetAuthDB } = require("../model/DompetAuth")

const GetDompet = async (req, res) => {
    try {
        const data = req.params;

        const GetDataDompet = await GetDompetAuthDB(data.access_id);

        res.status(200).json(GetDataDompet);
    } catch (error) {
        // Send an error response with a status code and error message
        res.status(500).json({ message: `Failed to get dompet: ${error.message}` });
    }
}


async function UpdateDompet(data_update, access_id) {
    try {
        if (!validatorUUID(access_id)) {
            throw new Error("Invalid access ID");
        }
        
        const data = {
            access_id: access_id,
            uang_masuk: data_id.uang_masuk || null,
            uang_keluar: data_update.uang_keluar || null,
            uang_sekarang: data_update.uang_sekarang || null,
            tanggal_update: new Date(),
          };
        const filteredData = Object.fromEntries(Object.entries(data).filter(([key, value]) => value !== null));

        console.log(filteredData);

        const hasil_update = await UpdateDompetAuthDB(filteredData, access_id);
        if (hasil_update) {
            return true;
        } else {
            throw new Error("Update failed");
        }
    } catch (error) {
        console.log(error.message);
        throw new Error(`Update failed: ${error.message}`);
    }
}




module.exports={
    GetDompet,
    UpdateDompet
}