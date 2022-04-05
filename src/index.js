const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const updatedRepository = request.body;

  const repositoryExists = repositories.find(repository => repository.id === id);

  if (!repositoryExists) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const index = repositories.indexOf(repositoryExists);

  const repository = { ...repositories[index], ...updatedRepository };

  if (repositoryExists.likes !== updatedRepository.likes) {
    repository.likes = repositoryExists.likes
  }

  repositories[index] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryExists = repositories.find(repository => repository.id === id);

  if (!repositoryExists) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const index = repositories.indexOf(repositoryExists);

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryExists = repositories.find(repository => repository.id === id);
  
  if (!repositoryExists) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const index = repositories.indexOf(repositoryExists);

  repositories.splice(index, 1);
  repositoryExists.likes++;
  repositories.push(repositoryExists);

  return response.json(repositoryExists);
});

module.exports = app;
