const sql = require("mssql");
const pool = require("../configuration/db");
const validator = require("validator");
const bcrypt = require("bcrypt");

//Create User
async function saveUser(userData) {
  try {
    if (!userData.username || !userData.email || !userData.password) {
      return { success: false, message: "All fields are required" };
    }

    await pool.connect();

    //Validate Email
    if (!validator.isEmail(userData.email)) {
      return { success: false, message: "Invalid Email Format!" };
    }

    //Check Username and Email if Exists
    const checkQuery = `SELECT * FROM users WHERE username = @username OR email = @email`;

    const resultCheck = await pool
      .request()
      .input("username", sql.VarChar, userData.username)
      .input("email", sql.VarChar, userData.email)
      .query(checkQuery);

    if (resultCheck.recordset.length > 0) {
      const existingUser = resultCheck.recordset[0];
      if (
        existingUser.username === userData.username &&
        existingUser.email === userData.email
      ) {
        return { success: false, message: "Username and Email already exist" };
      } else if (existingUser.username === userData.username) {
        return { success: false, message: "Username already exists" };
      } else if (existingUser.email === userData.email) {
        return { success: false, message: "Email already exists" };
      }
    }

    //Hashed Password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const query = `INSERT INTO users (username, email, password, created_at)
        VALUES(@username, @email, @password, GETDATE())`;

    const result = await pool
      .request()
      .input("username", sql.VarChar, userData.username)
      .input("email", sql.VarChar, userData.email)
      .input("password", sql.VarChar, hashedPassword)
      .query(query);

    if (result.rowsAffected[0] > 0) {
      return { success: true, message: "User Created Successfully" };
    } else {
      return { success: false, message: "Failed to create user" };
    }
  } catch (error) {
    console.error("Error creating User:", error.message);
    return { success: false, message: "Internal Server Error" };
  } finally {
    await pool.close();
  }
}

//Find All Users
async function findAllUsers() {
  try {
    await pool.connect();

    const query = `SELECT * FROM users`;

    const result = await pool.request().query(query);

    return result.recordset;
  } catch (error) {
    console.error("Error retrieving Users:", error.message);
    return { success: false, message: "Internal Server Error" };
  } finally {
    await pool.close();
  }
}

//Find User By ID
async function findUserById(id) {
  try {
    await pool.connect();

    const query = `SELECT * FROM users WHERE user_id = @id`;

    const result = await pool.request().input("id", sql.Int, id).query(query);

    if (result.recordset.length > 0) {
      return result.recordset[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user by ID:", error.message);
    throw new Error("Internal Server Error");
  } finally {
    await pool.close();
  }
}

module.exports = {
  saveUser,
  findAllUsers,
  findUserById,
};
