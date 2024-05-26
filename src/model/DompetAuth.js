const pool = require("../../db_connect");
const { validateNoSpaces, validateNumber } = require("../function/Validator");

async function GetDompetAuthDB(id) {
    try {
        const queryValues = [id];
        const queryText = `
            SELECT * FROM dompet_keuangan WHERE pemilik_dompet = $1
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
    
        Object.keys(data).forEach((key) => {
          if (key !== "access_id") {
            if (typeof data[key] == "string") {
              if (validateNoSpaces(data[key])) {
                updateColumns.push(key);
                values.push(data[key]);
              } else {
                throw new Error("Your data is not valid");
              }
            } else {
              console.log(data[key]);
              if (validateNumber(data[key])) {
                updateColumns.push(key);
                // Assuming price should be a number, parse it
                values.push(parseInt(data[key], 10));
              } else {
                throw new Error("Your data is not valid");
              }
            }
          }
        });
    
        // Periksa apakah ada kolom yang akan diupdate
        if (updateColumns.length > 0) {
          const updateQuery = updateColumns
            .map((col, index) => {
                return `${col}=$${index + 1}`;
              })
            .join(", ");
    
          values.push(data.access_id);
          // Buat queryText dengan kolom-kolom yang akan diupdate
          const queryText = `
          UPDATE public.dompet_keuangan
          SET ${updateQuery}
          WHERE id=$${values.length};
          `;
    
          console.log("Update query:", queryText);
          console.log("Values:", values);
          // Execute your database update query using the queryText and values
          // Example:
          const rows = await pool.query(queryText, values);
    
          // Return success message or updated data
          // console.log(rows.rowCount);
          return rows;
        } else {
          // Tidak ada kolom yang akan diupdate karena semua nilainya null
          throw new Error("No data to update boy");
        }
      } catch (error) {
        // Handle the error appropriately
        console.error("Error updating event:", error.message);
        // Optionally, you can throw the error again to propagate it to the calling function
        throw error;
      }


    
}


module.exports={

    GetDompetAuthDB,
    UpdateDompetAuthDB
}



