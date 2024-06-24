const loginRepository = require("../repositories/login_repository");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const userResult = await loginRepository.findUserByEmail(email);

    if (!userResult.success) {
      return res.status(400).json({ error: " Invalid Email" });
    }

    const user = userResult.user;

    const validatePassword = await loginRepository.validatePassword(
      password,
      user.password
    );

    if (!validatePassword) {
      return res.status(400).json({ error: "Invalid Password" });
    }

    const token = jwt.sign({ id: user.user_id }, "cCw~3C4546L=[.O[E{CW", {
      expiresIn: "24h",
    });

    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  loginUser,
};
