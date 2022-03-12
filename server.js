const express = require("express");
const data = require("./db/db.json");
const path = require("path");
const uuid = require("./public/assets/helpers/uuid");
const {
  readAndAppend,
  readFromFile,
} = require("./public/assets/helpers/fsUtils");
const fs = require("fs");
const { Console } = require("console");
const app = express();
const PORT = 3001;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});
app.get("/api/notes", (req, res) => {
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});
//post new note
app.post("/api/notes", async (req, res) => {
  const data = await fs.readFileSync("./db/db.json", "utf-8");
  const parsedData = JSON.parse(data);
  console.log(parsedData);
  const { title, text } = req.body;
  const newNote = {
    title,
    text,
    id: uuid(),
  };
  parsedData.push(newNote);
  fs.writeFile("./db/db.json", JSON.stringify(parsedData), (err) =>
    err
      ? console.error(err)
      : (res.send(data),
        console.log(`Note for ${newNote.title} has been written`))
  );
});
app.delete("/api/notes/:id", (req, res) => {
  let chosenId = req.params.id;
  console.log(chosenId);
  fs.readFile("./db/db.json", (err, data1) => {
    if (err) throw err;
    let dataJSON = JSON.parse(data1);
    let newData = dataJSON.filter((note) => note.id !== chosenId);
    fs.writeFile("./db/db.json", JSON.stringify(newData), (err) =>
      err
        ? console.error(err)
        : (res.send(data), console.log(`Note for ${chosenId} has been removed`))
    );
  });
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
