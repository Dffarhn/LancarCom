const pool = require("../../db_connect")
const { KelolaRekomendasiText } = require("../function/AICHAT")
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


async function AddRekomendasiToDB(data) {
    try {
        const validasi_access = validatorUUID(data.id)

        console.log(data.id)

        const pisahkondisirekomendasi = KelolaRekomendasiText(data.rekomendasi_ai)

        console.log(pisahkondisirekomendasi)

        if (!validasi_access) {
            throw new Error("Your access is not valid")
        }
        const queryValues = [data.id,pisahkondisirekomendasi.rekomendasiAi, pisahkondisirekomendasi.kondisi,pisahkondisirekomendasi.alasan]
        const queryText = `
            INSERT INTO public.rekomendasi_ai(
            rekomendasi_ke,rekomendasi_ai, kondisi, alasan)
            VALUES ($1, $2, $3, $4);
        
        `

        const {rows} = await pool.query(queryText,queryValues)

        if (!rows) {
            throw new Error("Your Place not have child place")
            
        }
        
        return rows
    } catch (error) {
        throw new Error(`${error.message}`)
    }


    
}

module.exports = {GetTheChild,AddRekomendasiToDB}