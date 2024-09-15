const express = require('express');
const Projects = require('./projects-model');
const router = express.Router();


function logger(req, res, next) {
  console.log(`${req.method} request to ${req.url}`);
  next();
}


function validateProject(req, res, next) {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ message: "Missing required fields: name or description" });
  }
  next();
}


async function validateProjectId(req, res, next) {
  try {
    const project = await Projects.get(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    req.project = project; 
    next();
  } catch (err) {
    next(err);
  }
}


router.get('/', logger, async (req, res, next) => {
  try {
    const projects = await Projects.get();
    res.status(200).json(projects);
  } catch (err) {
    next(err);
  }
});


router.get('/:id', logger, validateProjectId, (req, res) => {
  res.status(200).json(req.project); 
});


router.post('/', logger, validateProject, async (req, res, next) => {
  try {
    const newProject = await Projects.insert(req.body);
    res.status(201).json(newProject);
  } catch (err) {
    next(err);
  }
});


router.put('/:id', logger, validateProjectId, validateProject, async (req, res, next) => {
  try {
    const updatedProject = await Projects.update(req.params.id, req.body);
    res.status(200).json(updatedProject);
  } catch (err) {
    next(err);
  }
});


router.delete('/:id', logger, validateProjectId, async (req, res, next) => {
  try {
    await Projects.remove(req.params.id);
    res.status(204).end(); 
  } catch (err) {
    next(err);
  }
});


router.get('/:id/actions', logger, validateProjectId, async (req, res, next) => {
  try {
    const actions = await Projects.getProjectActions(req.params.id);
    res.status(200).json(actions);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

