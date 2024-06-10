const pool = require("../../db_connect");
const { validatorUUID } = require("../function/Validator");

async function AddProgressPembangunanToDB(data) {
  try {
    const { id_pembangunan, image_progress, progress_pembangunan, dana_digunakan } = data;

    const queryValues = [id_pembangunan, image_progress, progress_pembangunan, dana_digunakan];
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}

async function GetProgressPembangunanToDB(data, access_id) {
  try {
    const validasiUUID = validatorUUID(data);

    if (!validasiUUID) {
      throw new Error("Your data is not Valid");
    }
    const queryValues = [access_id,data];

    const queryText = `
        SELECT DISTINCT ON (pp.id_pembangunan)
        pp.id,
        pp.id_pembangunan,
        pp.image_progress,
        pp.progress_pembangunan,
        pp.dana_digunakan,
        pp.dana_sisa,
        pp.created_at,
        p.nama_pembangunan,
        p.lokasi_pembangunan,
        p.dana_pembangunan,
        p.status_pembangunan,
        p.pemilik_pembangunan
    FROM
        public.progress_pembangunan pp
    JOIN
        public.pembangunan p
    ON
        pp.id_pembangunan = p.id
    WHERE
        p.pemilik_pembangunan = $1 AND pp.id = $2
    ORDER BY
        pp.id_pembangunan,
        pp.created_at DESC;



        
        `;

    const { rows } = await pool.query(queryText, queryValues);

    if (!rows) {
      throw new Error("Failed To get data to Database");
    }

    return rows;
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}
async function GetAllProgressPembangunanToDB(access_id) {
  try {
    const validasiUUID = validatorUUID(access_id);

    if (!validasiUUID) {
      throw new Error("Your data is not Valid");
    }

    // console.log(access_id)
    const queryValues = [access_id];

    const queryText = `
    SELECT DISTINCT ON (pp.id_pembangunan)
        pp.id,
        pp.id_pembangunan,
        pp.image_progress,
        pp.progress_pembangunan,
        pp.dana_digunakan,
        pp.dana_sisa,
        pp.created_at,
        p.nama_pembangunan,
        p.lokasi_pembangunan,
        p.dana_pembangunan,
        p.status_pembangunan,
        p.pemilik_pembangunan
    FROM
        public.progress_pembangunan pp
    JOIN
        public.pembangunan p
    ON
        pp.id_pembangunan = p.id
    WHERE
        p.pemilik_pembangunan = $1
    ORDER BY
        pp.id_pembangunan,
        pp.created_at DESC;


        
        `;

    const { rows } = await pool.query(queryText, queryValues);

    if (!rows) {
      throw new Error("Failed To get data to Database");
    }


    return rows;
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}

module.exports = {
  AddProgressPembangunanToDB,
  GetProgressPembangunanToDB,
  GetAllProgressPembangunanToDB
};
