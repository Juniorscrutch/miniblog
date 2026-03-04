import express from "express";
import { Pool } from "./db.js";
import methodOverride from "method-override";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT id, username FROM users ORDER BY id DESC",
    );
    res.render("index.ejs", { users: users.rows });
  } catch (error) {
    res.status(500).send("Erreur lors de la récupération des utilisateurs");
  }
});

app.post("/users", async (req, res) => {
  const { username, password } = req.body;
  try {
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      username,
      password,
    ]);
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Erreur lors de la création de l'utilisateur");
  }
});

app.post("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { newUsername, newPassword } = req.body;
  try {
    await pool.query(
      "UPDATE users SET username = $1, password = $2 WHERE id = $3",
      [newUsername, newPassword, id],
    );
    res.redirect("/");
  } catch (error) {
    console.error("Erreur modification:", error);
    res
      .status(500)
      .send(
        "Erreur lors de la modification de l'utilisateur: " + error.message,
      );
  }
});

app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { newUsername, newPassword } = req.body;
  try {
    await pool.query(
      "UPDATE users SET username = $1, password = $2 WHERE id = $3",
      [newUsername, newPassword, id],
    );
    res.redirect("/");
  } catch (error) {
    console.error("Erreur modification:", error);
    res
      .status(500)
      .send(
        "Erreur lors de la modification de l'utilisateur: " + error.message,
      );
  }
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.redirect("/");
  } catch (error) {
    console.error("Erreur suppression:", error);
    res
      .status(500)
      .send("Erreur lors de la suppression de l'utilisateur: " + error.message);
  }
});

app.post("/users/:id", async (req, res) => {
  if (req.query._method === "DELETE") {
    const { id } = req.params;
    try {
      await pool.query("DELETE FROM users WHERE id = $1", [id]);
      res.redirect("/");
    } catch (error) {
      console.error("Erreur suppression:", error);
      res
        .status(500)
        .send(
          "Erreur lors de la suppression de l'utilisateur: " + error.message,
        );
    }
  }
});
app.listen(process.env.PORT || 3000, () => {
  console.log(" Server is running on port ");
});
