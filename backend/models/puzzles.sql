CREATE TABLE puzzles (
    puzzle_id INT PRIMARY KEY IDENTITY(1,1),
    puzzle_name VARCHAR(100) NOT NULL,
    puzzle_image VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);