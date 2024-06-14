const pool = require("../../db_connect")
const { validatorUUID } = require("../function/Validator")

async function GetTheChild(access_id) {
    try {
        const validasi_access = validatorUUID(access_id)

        if (!validasi_access) {
            throw new Error("Your access is not valid")
        }
        const queryValues = [access_id]
        const queryText = `
        select * from access_id 
        where parent = $1`

        const {rows} = await pool.query(queryText,queryValues)

        if (!rows) {
            throw new Error("Your Place not have child place")
            
        }
        
        return rows
    } catch (error) {
        throw new Error(`${error.message}`)
    }
    
}

module.exports = {GetTheChild}