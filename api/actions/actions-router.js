const express = require('express');
const Actions = require('./actions-model'); 
const Projects = require('../projects/projects-model'); 
const router = express.Router();


router.get('/', async (req, res, next) => {
  try {
    const actions = await Actions.get();
    res.status(200).json(actions);
  } catch (err) {
    next(err);
  }
});


router.get('/:id', async (req, res, next) => {
  try {
    const action = await Actions.get(req.params.id);
    if (action) {
      res.status(200).json(action);
    } else {
      res.status(404).json({ message: "Action not found" });
    }
  } catch (err) {
    next(err);
  }
});


router.post('/', async (req, res, next) => {
  try {
    const { project_id, description, notes, completed } = req.body;

    
    if (!project_id || !description || !notes) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    
    const project = await Projects.get(project_id);
    if (!project) {
      return res.status(400).json({ message: "Invalid project_id" });
    }

    const newAction = await Actions.insert({ project_id, description, notes, completed });
    res.status(201).json(newAction);
  } catch (err) {
    next(err);
  }
});


router.put('/:id', async (req, res, next) => {
  try {
    const { project_id, description, notes, completed } = req.body;

    
    if (!project_id || !description || !notes || typeof completed === 'undefined') {
      return res.status(400).json({ message: "Missing required fields" });
    }

   
    const existingAction = await Actions.get(req.params.id);
    if (!existingAction) {
      return res.status(404).json({ message: "Action not found" });
    }

    
    const project = await Projects.get(project_id);
    if (!project) {
      return res.status(400).json({ message: "Invalid project_id" });
    }

    const updatedAction = await Actions.update(req.params.id, { project_id, description, notes, completed });
    res.status(200).json(updatedAction);
  } catch (err) {
    next(err);
  }
});


router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Actions.remove(req.params.id);
    if (deleted) {
      res.status(204).end(); 
    } else {
      res.status(404).json({ message: "Action not found" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
