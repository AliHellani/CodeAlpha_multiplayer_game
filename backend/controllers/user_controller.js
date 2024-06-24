const userRepository = require("../repositories/user_repository");

//Register User
async function register(req, res) {
  try {
    const userData = req.body;

    const result = await userRepository.saveUser(userData);

    if (result.success) {
      res.status(201).json({ message: result.message });
    } else if (result.message === "Username already exists") {
      res.status(400).json({ error: result.message });
    } else if (result.message === "Email already exists") {
      res.status(400).json({ error: result.message });
    } else if (result.message === "Username and Email already exist") {
      res.status(400).json({ error: result.message });
    } else {
      res.status(500).json({ error: result.message });
    }
  } catch (error) {
    console.error("Error creating User:", error.message);

    res.status(500).json({ error: "Internal Server Error" });
  }
}

//Find All Users
async function findAllUsers(req, res) {
  try {
    const users = await userRepository.findAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving Users:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

//Find User By ID
async function findUserById(req, res) {
  try {
    const userId = req.params.id;
    const result = await userRepository.findUserById(userId);

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: "User Not Found!" });
    }
  } catch (error) {
    console.error("Error retrieving User:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  register,
  findAllUsers,
  findUserById,
};
