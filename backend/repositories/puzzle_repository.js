const sql = require("mssql");
const pool = require("../configuration/db");

//Create Puzzles
async function savePuzzle(puzzleData, puzzleImage) {
  try {
    await pool.connect();

    const imagePath = `/images/image_game/${puzzleImage.originalname}`;

    const query = `INSERT INTO puzzles(puzzle_name, puzzle_image, created_at, user_id)
    OUTPUT INSERTED.puzzle_id
        VALUES(@puzzle_name, @puzzle_image, GETDATE(), @user_id)`;

    const result = await pool
      .request()
      .input("puzzle_name", sql.VarChar, puzzleData.puzzle_name)
      .input("puzzle_image", sql.VarChar, imagePath)
      .input("user_id", sql.Int, puzzleData.user_id)
      .query(query);

    const puzzleId = result.recordset[0].puzzle_id;

    if (result.rowsAffected[0] > 0) {
      return {
        success: true,
        message: "Puzzle Created Successfully",
        puzzleId: puzzleId,
        imagePath: imagePath,
      };
    } else {
      return { success: false, message: "Failed to create Puzzle" };
    }
  } catch (error) {
    console.error("Error creating Puzzle:", error.message);
    return { success: false, message: "Internal Server Error" };
  } finally {
    await pool.close();
  }
}

//Find All Puzzles
async function findAllPuzzles() {
  try {
    await pool.connect();

    const query = `SELECT * FROM puzzles`;

    const result = await pool.request().query(query);

    return result.recordset;
  } catch (error) {
    console.error("Error retrieving Puzzles:", error.message);

    return { success: false, message: "Internal Server Error" };
  } finally {
    await pool.close();
  }
}

//Find Puzzles By Id
async function findPuzzleById(id) {
  try {
    await pool.connect();

    const query = `SELECT * FROM puzzles WHERE puzzle_id = @id`;

    const result = await pool.request().input("id", sql.Int, id).query(query);

    if (result.recordset.length > 0) {
      return result.recordset[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching Puzzle by ID:", error.message);

    return { success: false, message: "Internal Server Error" };
  } finally {
    await pool.close();
  }
}

module.exports = {
  savePuzzle,
  findAllPuzzles,
  findPuzzleById,
};
