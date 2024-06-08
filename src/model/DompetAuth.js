const pool = require("../../db_connect");
const { validateNoSpaces, validateNumber, validatorUUID } = require("../function/Validator");

async function GetDompetAuthDB(id) {
    try {
        const queryValues = [id];
        const queryText = `
        WITH latest_uang_masuk AS (
            SELECT uang_masuk, tanggal_update
            FROM public.dompet_keuangan
            WHERE pemilik_dompet = $1
            AND uang_masuk IS NOT NULL
            ORDER BY tanggal_update DESC
            LIMIT 1
        ),
        latest_uang_keluar AS (
            SELECT uang_keluar, tanggal_update
            FROM public.dompet_keuangan
            WHERE pemilik_dompet = $1
            AND uang_keluar IS NOT NULL
            ORDER BY tanggal_update DESC
            LIMIT 1
        ),
        latest_uang_sekarang AS (
            SELECT uang_sekarang, tanggal_update
            FROM public.dompet_keuangan
            WHERE pemilik_dompet = $1
            AND uang_sekarang IS NOT NULL
            ORDER BY tanggal_update DESC
            LIMIT 1
        )
        SELECT
            (SELECT uang_masuk FROM latest_uang_masuk) AS uang_masuk,
            (SELECT uang_keluar FROM latest_uang_keluar) AS uang_keluar,
            (SELECT uang_sekarang FROM latest_uang_sekarang) AS uang_sekarang,
            GREATEST(
                (SELECT tanggal_update FROM latest_uang_masuk),
                (SELECT tanggal_update FROM latest_uang_keluar),
                (SELECT tanggal_update FROM latest_uang_sekarang)
            ) AS tanggal_update_terakhir

        `;

        const { rows } = await pool.query(queryText, queryValues);

        return rows;
    } catch (error) {
        throw new Error(`Failed to get dompet auth: ${error.message}`);
    }
}


async function UpdateDompetAuthDB(data) {
    try {
        const updateColumns = [];
        const values = [];

        const index = 1;
        const placeholder = [];
    
        Object.keys(data).forEach((key) => {
          if (key !== "access_id") {
            if (typeof data[key] == "string") {
              if (validateNoSpaces(data[key])) {
                updateColumns.push(key);
                values.push(data[key]);
                placeholder.push(`$${index}`)
                index++
              } else {
                throw new Error("Your data is not valid");
              }
            } else {
              console.log(data[key]);
              if (validateNumber(data[key])) {
                updateColumns.push(key);
                // Assuming price should be a number, parse it
                values.push(parseInt(data[key], 10));
                placeholder.push(`$${index}`)
                index++
              } else {
                throw new Error("Your data is not valid");
              }
            }
          }
        });
    
        // Periksa apakah ada kolom yang akan diupdate
        updateColumns.push("pemilik_dompet");
        placeholder.push(`$${index}`);
        values.push(data.access_id);
          // Buat queryText dengan kolom-kolom yang akan diupdate
        const queryText = `
        INSERT INTO public.dompet_keuangan (${updateColumns.join(", ")})
        VALUES (${placeholder.join(", ")});
        `;
    
          console.log("Update query:", queryText);
          console.log("Values:", values);
          // Execute your database update query using the queryText and values
          // Example:
          const rows = await pool.query(queryText, values);
    
          // Return success message or updated data
          // console.log(rows.rowCount);
          return rows;

      } catch (error) {
        // Handle the error appropriately
        console.error("Error updating event:", error.message);
        // Optionally, you can throw the error again to propagate it to the calling function
        throw error;
      }


    
}


async function GetStatisticDompetDB(access_id) {
  try {
    const validasiUUID = validatorUUID(access_id)

    const queryText =`
    WITH latest_uang_masuk AS (
        SELECT DISTINCT ON (EXTRACT(YEAR FROM tanggal_update), EXTRACT(MONTH FROM tanggal_update))
            EXTRACT(YEAR FROM tanggal_update) AS tahun,
            EXTRACT(MONTH FROM tanggal_update) AS bulan,
            uang_masuk,
            tanggal_update
        FROM 
            public.dompet_keuangan
        WHERE 
            pemilik_dompet = $1
            AND uang_masuk IS NOT NULL
        ORDER BY 
            EXTRACT(YEAR FROM tanggal_update), EXTRACT(MONTH FROM tanggal_update), tanggal_update DESC
    ),
    latest_uang_keluar AS (
        SELECT DISTINCT ON (EXTRACT(YEAR FROM tanggal_update), EXTRACT(MONTH FROM tanggal_update))
            EXTRACT(YEAR FROM tanggal_update) AS tahun,
            EXTRACT(MONTH FROM tanggal_update) AS bulan,
            uang_keluar,
            tanggal_update
        FROM 
            public.dompet_keuangan
        WHERE 
            pemilik_dompet = $1
            AND uang_keluar IS NOT NULL
        ORDER BY 
            EXTRACT(YEAR FROM tanggal_update), EXTRACT(MONTH FROM tanggal_update), tanggal_update DESC
    ),
    latest_uang_sekarang AS (
        SELECT DISTINCT ON (EXTRACT(YEAR FROM tanggal_update), EXTRACT(MONTH FROM tanggal_update))
            EXTRACT(YEAR FROM tanggal_update) AS tahun,
            EXTRACT(MONTH FROM tanggal_update) AS bulan,
            uang_sekarang,
            tanggal_update
        FROM 
            public.dompet_keuangan
        WHERE 
            pemilik_dompet = $1
            AND uang_sekarang IS NOT NULL
        ORDER BY 
            EXTRACT(YEAR FROM tanggal_update), EXTRACT(MONTH FROM tanggal_update), tanggal_update DESC
    )
    SELECT
        COALESCE(lum.tahun, luk.tahun, lus.tahun) AS tahun,
        COALESCE(lum.bulan, luk.bulan, lus.bulan) AS bulan,
        lum.uang_masuk,
        luk.uang_keluar,
        lus.uang_sekarang,
        GREATEST(lum.tanggal_update, luk.tanggal_update, lus.tanggal_update) AS tanggal_update_terakhir
    FROM
        latest_uang_masuk lum
        FULL JOIN latest_uang_keluar luk ON lum.tahun = luk.tahun AND lum.bulan = luk.bulan
        FULL JOIN latest_uang_sekarang lus ON lum.tahun = lus.tahun AND lum.bulan = lus.bulan
    ORDER BY
        tahun, bulan;

    `

    if (validasiUUID) {
      const {rows} = await pool.query(queryText,[access_id])
      if (rows) {
        return rows
        
      }else{
        throw new Error("Failed to fetch data to database")
      }
    }else{
      throw new Error("Your data is not valid")
    }
    
  } catch (error) {
    throw new Error(`${error.message}`)
    
  }
  
}

module.exports={
  

    GetDompetAuthDB,
    UpdateDompetAuthDB,
    GetStatisticDompetDB
}



