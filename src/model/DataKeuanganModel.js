const pool = require("../../db_connect");
const { validatorUUID } = require("../function/Validator");

async function getAlurKeuangan(id) {
  try {
    const idAlur = validatorUUID(id);

    if (!idAlur) {
      throw new Error("ur id is not valid");
    }

    const queryValues = [id];

    const queryText = `SELECT * FROM data_keuangan where id = $1`;

    const { rows } = await pool.query(queryText, queryValues);

    if (rows.length === 0) {
      throw new Error("U Dont Have Any Alur Keuangan ID");
    }

    return rows;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function SearchUserForAccessIdDB(id) {
  try {
    const queryValues = [id];
    const queryText = `

        SELECT *
        FROM public.userdb
        JOIN public.access_id ON public.userdb.access_id = $1;
        
        `;

    const { rows } = await pool.query(queryText, queryValues);

    return rows;
  } catch (error) {
    throw new Error(`Failed to search user : ${error.message}`);
  }
}

async function AddAlurKeuanganDB(data, user) {
  try {
    const { penerima, uang_turunan } = data;

    const { access_id, role } = user;

    const pemberi = access_id;
    const category = role;
    const status = "pending";
    const tgl_turunan = new Date();

    const queryValues = [penerima, pemberi, uang_turunan, tgl_turunan, status, category];

    const queryText = `
        INSERT INTO public.data_keuangan(
            penerima, pemberi, uang_turunan, tgl_turunan, status, category)
            VALUES ($1,$2,$3,$4,$5,$6);

            RETURNING id
        
        `;

    const { rows } = await pool.query(queryText, queryValues);

    return rows;
  } catch (error) {
    throw new Error(`Failed to add alur keuangan : ${error.message}`);
  }
}

async function VerifyAlurKeuanganDB(data, user, id) {
  try {
    const { uang_diterima } = data;

    const { access_id } = user;

    const penerima = access_id;

    const AlurKeuangandetail = await getAlurKeuangan(id);

    let status = "success";
    if (uang_diterima != AlurKeuangandetail[0].uang_turunan) {
      status = "investigasi";
    }

    if (penerima != AlurKeuangandetail[0].penerima) {
      throw new Error("Wrong Recipient");
    }
    const tgl_diterima = new Date();

    const queryValues = [uang_diterima, tgl_diterima, status,id];

    const queryText = `
    UPDATE public.data_keuangan
    SET
        uang_diterima = $1,
        tgl_diterima = $2,
        status = $3
    WHERE
        id = $4
    RETURNING id,uang_diterima;
`;

    const { rows } = await pool.query(queryText, queryValues);

    return rows;
  } catch (error) {
    throw new Error(`Failed to add alur keuangan : ${error.message}`);
  }
}

module.exports = {
  SearchUserForAccessIdDB,
  AddAlurKeuanganDB,
  VerifyAlurKeuanganDB,
};
