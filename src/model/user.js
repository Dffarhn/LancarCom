const pool = require("../../db_connect");
const { validateNoSpaces, validateNoSpacesArray, validateEmail } = require("../function/Validator");
const { bcrypt_data, comparePasswordBcrypt } = require("../function/bcrypt_data");

async function AddUser(data) {
  try {
    const { username, email, password, asal_daerah } = data;

    const checkString = validateNoSpaces(username);

    const checkemail = validateEmail(email);
    const checkemailisexist = await check_emailToDB(email)

    console.log(checkemailisexist)

    if (!checkString || !checkemail) {
      throw new Error("data is not valid");
    }

    if (checkemailisexist.length>0) {
        throw new Error("the email has been used")
    }

    const password_hash = await bcrypt_data(password);
    const values = [username, email, password_hash, asal_daerah];

    const querytext = `INSERT INTO public.userdb(
            username, email, password, asal_daerah)
            VALUES ($1, $2, $3, $4)
            RETURNING * ;
            `;

    const { rows } = await pool.query(querytext, values);

    if (rows) {
      return rows;
    } else {
      throw new Error("internal server error");
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
async function check_emailToDB(email) {
    return new Promise((resolve, reject) => {
      const checkemailinput = validateEmail(email);
      if (checkemailinput) {
        const queryText = `
              SELECT * FROM public.userdb
              WHERE email = $1;
            `;
        pool
          .query(queryText, [email])
          .then(({ rows }) => {
            // console.log(rows);
            resolve(rows); // Resolve with true if admin with this email exists
          })
          .catch((err) => {
            console.error("Error querying database:", err);
            reject(err);
          });
      } else {
        resolve(false); // Invalid email input
      }
    });
  }


  async function SearchUser(data){
    try {
        const { email, password } = data;
        
        const checkemail = validateEmail(email);
        const checkpassword = validateNoSpaces(password);
    
        if (!checkemail || !checkpassword) {
            throw new Error("Invalid input");
        }

        const values = [email];

        const queryText = `SELECT * FROM userdb WHERE email = $1`;

        const { rows } = await pool.query(queryText, values);

        if (rows.length > 0) {
            const userDBpassword = rows[0].password;

            const checksamepassword = await comparePasswordBcrypt(password, userDBpassword);
            if (checksamepassword) {
                return rows[0]; // Return the user object if password is correct
            } else {
                throw new Error("Incorrect password");
            }
            
        } else {
            throw new Error("No account found with that email");
        }
    } catch (error) {
        throw new Error(error.message);
    }
}


module.exports = { AddUser, SearchUser };
