const express = require('express');
const Projects = require('./projects-model'); 
const router = express.Router();


router.get('/', async (req, res, next) => {
  try {
    const projects = await Projects.get();
    res.status(200).json(projects);
  } catch (err) {
    next(err);
  }
});


router.get('/:id', async (req, res, next) => {
  try {
    const project = await Projects.get(req.params.id);
    if (project) {
      res.status(200).json(project);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (err) {
    next(err);
  }
});


router.post('/', async (req, res, next) => {
  try {
    const { name, description, completed } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newProject = await Projects.insert({ name, description, completed });
    res.status(201).json(newProject);
  } catch (err) {
    next(err);
  }
});


router.put('/:id', async (req, res, next) => {
  try {
    const { name, description, completed } = req.body;
    if (!name || !description || typeof completed === 'undefined') {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updatedProject = await Projects.update(req.params.id, { name, description, completed });
    if (updatedProject) {
      res.status(200).json(updatedProject);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (err) {
    next(err);
  }
});


router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Projects.remove(req.params.id);
    if (deleted) {
      res.status(204).end(); 
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (err) {
    next(err);
  }
});


router.get('/:id/actions', async (req, res, next) => {
  try {
    const project = await Projects.get(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const actions = await Projects.getProjectActions(req.params.id); 
    res.status(200).json(actions);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
