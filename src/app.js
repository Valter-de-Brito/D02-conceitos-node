const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({ error: "Invalid repository ID." });
  }

  return next();
}

app.get("/repositories", (request, response) => {
  const result = repositories;
  return response.json(result);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const objRepository = {
    id: uuid(), title, url, techs, likes: 0
  }

  repositories.push(objRepository);

  return response.json(objRepository);

});

app.put("/repositories/:id", validateProjectId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found!" });
  }

  const { likes } = repositories[repositoryIndex];
  const objRepository = { id, title, url, techs, likes };
  repositories[repositoryIndex] = objRepository;

  return response.json(objRepository);

});

app.delete("/repositories/:id", validateProjectId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found!" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", validateProjectId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found!" });
  }

  let { title, url, techs, likes } = repositories[repositoryIndex];
  likes += 1;
  const objRepository = { id, title, url, techs, likes };
  repositories[repositoryIndex] = objRepository;

  return response.json(objRepository);

});

module.exports = app;
