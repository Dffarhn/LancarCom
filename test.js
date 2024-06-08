const { bcrypt_data } = require("./src/function/bcrypt_data");

bcrypt_data("password123")
  .then(hashedPassword => {
    console.log(hashedPassword);
  })
  .catch(err => {
    console.error("Error:", err);
  });
