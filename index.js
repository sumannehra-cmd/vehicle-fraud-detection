import express from "express";

const app = express();

// VERY IMPORTANT: root route
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Listening on port", PORT);
});
