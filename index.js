// .importa e instância o "express"
const express = require('express');
const server = express();

// .utilização de JSON no corpo da requisição
server.use(express.json());

// .conjunto de projetos
const projects = [
  {
    id: "1",
    title: "Projeto 1",
    tasks: [
      "Nova Tarefa"
    ]
  }
];

// contagem de requisições
let count = 0;

server.get('/', (req, res) => res.send('Hello World!'));

// .middleware para contar requisições
server.use((req, res, next) => {
  // .incrementa contador de requisições
  count+=1;
  console.log(`Request count: ${count}`);

  return next();
})

// .middleware para rotas com parâmetro "id"
function isExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id === id);

  // .verifica se existe o projeto
  if (!project) {
    return res.status(400).json({ message: 'Project not found' })
  }

  return next();
}

// GET.: Projetos
server.get('/projects', (req, res) => {
  return res.json(projects);
});

// POST.: Projetos
server.post('/projects', (req, res) => {
  // .pega as informações do corpo e salva na variável projetos
  const { id, title } = req.body;

  // .cria objeto de projeto
  const project = {
    id,
    title,
    tasks: []
  }
  
  projects.push(project);

  return res.json(project);
});

// PUT.: Projetos
server.put('/projects/:id', isExists, (req, res) => {
  // .pega "id" informado como parâmetro da requisição
  const { id } = req.params;
  // .pega informação do corpo e altera o título do projeto
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.title = title;

  return res.json(project);
});

// DELETE.: Projetos
server.delete('/projects/:id', isExists, (req, res) => {
  // .pega "id" informado como parâmetro da requisição
  const { id } = req.params;

  // exclui registro da variável
  const index = projects.findIndex(p => p.id === id);

  projects.splice(index, 1);

  return res.send();
});

// POST.: Projetos/Tasks
server.post('/projects/:id/tasks', isExists, (req, res) => {
  // .pega "id" informado como parâmetro da requisição
  const { id } = req.params;
  // .pega as informações do corpo e atualiza informações do projetos
  const { title } = req.body;

  const project = projects.find(p => p.id === id);
  
  project.tasks.push(title);

  return res.json(project);
});


server.listen(3333);