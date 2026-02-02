const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());
const pool = new Pool({
  connectionString:
    "postgresql://tiqworld:t7XBeAJmvY2wfbUp9iRadQbOKiNAxpLQ@dpg-d60dt5ngi27c73c84p70-a.singapore-postgres.render.com/tiqworld",
  ssl: {
    rejectUnauthorized: false,
  },
});
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        text TEXT NOT NULL,
        done BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Todos table ready");
  } catch (err) {
    console.error("DB Init Error:", err.message);
  }
};

initDB();
app.get("/todos", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM todos ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/todos", async (req, res) => {
  try {
    const { text } = req.body;
    const result = await pool.query(
      "INSERT INTO todos (text) VALUES ($1) RETURNING *",
      [text]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "UPDATE todos SET done = NOT done WHERE id = $1 RETURNING *",
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM todos WHERE id = $1", [id]);
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});
