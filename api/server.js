const express = require('express');
const server = express();


const actionsRouter = require('./actions/actions-router');
const projectsRouter = require('./projects/projects-router');



server.use(express.json()); 


server.use('/api/actions', actionsRouter);
server.use('/api/projects', projectsRouter);


server.get('/', (req, res) => {
  res.send('<h2>Welcome to the API</h2>');
});


server.use((err, req, res, next) => {
  console.error(err); 
  res.status(500).json({
    message: "Something went wrong, please try again later",
  });
});

module.exports = server;
