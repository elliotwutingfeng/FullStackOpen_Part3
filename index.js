const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
// 3.7 3.8
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
  { id: 4, name: "Mary Poppendick", number: "39-23-6423122" },
];

// 3.1
app.get("/api/persons", (request, response) => {
  response.json(persons);
});
// 3.2
app.get("/info", (request, response) => {
  const number_of_persons = persons.length;
  response.send(
    `<div>Phonebook has info for ${number_of_persons} people</div>
    <div>${new Date()}</div>`
  );
});
// 3.3
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((d) => d.id === id);
  if (person !== undefined) {
    response.json(person);
  } else {
    response.status(404).send({ error: "no such person" });
  }
});
// 3.4
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((d) => d.id !== id);
  response.status(204).end();
});
// 3.5
app.post("/api/persons", (request, response) => {
  // 3.6
  if (!request.body.hasOwnProperty("name")) {
    return response.status(400).send({ error: "name is missing" });
  }
  if (!request.body.hasOwnProperty("number")) {
    return response.status(400).send({ error: "number is missing" });
  }
  if (persons.find((d) => d.number === request.body.number)) {
    return response.status(400).send({ error: "number must be unique" });
  }
  const id = (function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  })(1, 1e9);
  const person = { id, ...request.body };
  persons = persons.concat(person);
  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
