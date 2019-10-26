const express = require('express');

const server = express();
server.use(express.json());

const projects = [];


//Midlleware para contabilizar o numero de requests
function logRequests(req, res, next) {
  console.count("Número de requisições");
  return next();
}

server.use(logRequests);
// server.use((req, res, next)=>{
//   requests++;
//   console.log(`Total de requsições: ${requests}`);
//   next();
// })

//Middleware Local que Verifica se o id do projeto existe
function checkProjectExists(req, res, next){  
  const {id} = req.params;  
  const project = projects.find(p => p.id == id);

  if(!project){
    return  res.status(400).json({error:'Project not found' });
  }  
  req.project = project;
  return next();
  
  /** Modo Convencional */
  // for(; i < projects.length; i++){
  //   if(projects[i].id == req.params.id){
  //     index = i;
  //     break;
  //   }
  // }

  
}

//Middleware Local que Verifica se o titulo está sendo enviado
function checkTitleExists(req, res, next){
  if(!req.body.title){
    return  res.status(400).json({error:'Title is required'});
  }
  return next();
}

/**
 * @api {get} /signin Singin
 * @apiGroup Sistema
 *
 * @apiSuccess {Projects} List projects
 * 
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "projects"{
 *          project:{
 *                
 *      }
 *    }
 *
 */
//Get All Projects
server.get('/projects/', (req,res)=>{
  return res.json(projects);
})

//Get Project by Id
server.get('/projects/:id', checkProjectExists, (req,res)=>{
  const {id} = req.params;
  return res.json(projects);
})

//Adicionar novo Projeto
server.post('/projects/', checkTitleExists, (req, res)=>{
  const {id, title} = req.body;  
  const project = {
                    id: id, 
                    title: title, 
                    tasks: []
                  };
  projects.push(project);
  return res.json(projects);
})

//Adicionar Task
server.post('/projects/:id/tasks', checkTitleExists, checkProjectExists, (req, res)=>{
  const {title} = req.body;  
  req.project.tasks.push(title);
  return res.json(projects);
})

//Remover um Projeto
server.delete('/projects/:id', checkProjectExists, (req, res)=>{
  const {id} = req.params;
  const index = projects.findIndex(p => p.id == id);
  projects.splice(index, 1);
  return res.send('Exclusão realizada com sucesso');
})

//Atualizar título
server.put('/projects/:id', checkTitleExists, checkProjectExists, (req, res)=>{
  const {title} = req.body;
  req.project.title = title;
  return res.json(projects);
})

server.listen(3001);