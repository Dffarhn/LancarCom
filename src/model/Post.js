const pool = require("../../db_connect")

async function AddPostUserToDB(data,user) {

    try {

        const {judul_post,image_post,deskripsi_post} = data

        const {access_id} = user

        const tgl_post = new Date()

        const queryValues = [judul_post,image_post,deskripsi_post,tgl_post,access_id]

        const queryText = `INSERT INTO public.post(
            judul_post, image_post, deskripsi_post, tgl_post, pengupload_post)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING id
            `

        const {rows} = await pool.query(queryText,queryValues) 

        if (rows) {

            throw new Error("Failed Add Post To Database")
            
        }
        return rows


    
        
    } catch (error) {
        throw new Error(`${error.message}`)
        
    }
    
}

module.exports = {AddPostUserToDB}