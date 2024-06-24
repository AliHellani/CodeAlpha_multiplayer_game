const puzzleRepository = require("../repositories/puzzle_repository");
//Create Puzzle
async function createPuzzle(req, res) {
  try {
    const puzzleData = {
      puzzle_name: req.body.puzzle_name,
      user_id: req.body.user_id,
    };

    const puzzleImage = req.file;

    const result = await puzzleRepository.savePuzzle(puzzleData, puzzleImage);
    if (result.success) {
      res.status(201).json({
        message: result.message,
        puzzleId: result.puzzleId,
        puzzleImagePath: result.imagePath,
      });
    } else {
      res.status(500).json({ error: result.message });
    }
  } catch (error) {
    console.error("Error creating Puzzle:", error.message);

    return res.status(500).json({ error: "Internal Server Error" });
  }
}

//Find All Puzzles
async function findAllPuzzles(req, res) {
  try {
    const result = await puzzleRepository.findAllPuzzles();

    res.status(200).json(result);
  } catch (error) {
    console.error("Error retrieving Puzzles:", error.message);

    res.status(500).json({ error: "Internal Server Error" });
  }
}

//Find Puzzle By ID
async function findPuzzleById(req, res) {
  try {
    const puzzleId = req.params.id;
    const result = await puzzleRepository.findPuzzleById(puzzleId);

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: "Puzzle Not Found!" });
    }
  } catch (error) {
    console.error("Error fetching Puzzle by ID:", error.message);

    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  createPuzzle,
  findAllPuzzles,
  findPuzzleById,
};
