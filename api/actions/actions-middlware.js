const express = require('express');
const Actions = require('./actions-model');
const router = express.Router();


function logger(req, res, next) {
  console.log(`${req.method} request to ${req.url}`);
  next();
}


function validateAction(req, res, next) {
  const { project_id, description, notes } = req.body;
  if (!project_id || !description || !notes) {
    return res.status(400).json({ message: "Missing required fields: project_id, description, or notes" });
  }
  next();
}


async function validateActionId(req, res, next) {
  try {
    const action = await Actions.get(req.params.id);
    if (!action) {
      return res.status(404).json({ message: "Action not found" });
    }
    req.action = action; 
    next();
  } catch (err) {
    next(err);
  }
}


router.get('/', logger, async (req, res, next) => {
  try {
    const actions = await Actions.get();
    res.status(200).json(actions);
  } catch (err) {
    next(err);
  }
});


router.get('/:id', logger, validateActionId, (req, res) => {
  res.status(200).json(req.action); 
});


router.post('/', logger, validateAction, async (req, res, next) => {
  try {
    const newAction = await Actions.insert(req.body);
    res.status(201).json(newAction);
  } catch (err) {
    next(err);
  }
});


router.put('/:id', logger, validateActionId, validateAction, async (req, res, next) => {
  try {
    const updatedAction = await Actions.update(req.params.id, req.body);
    res.status(200).json(updatedAction);
  } catch (err) {
    next(err);
  }
});


router.delete('/:id', logger, validateActionId, async (req, res, next) => {
  try {
    await Actions.remove(req.params.id);
    res.status(204).end(); 
  } catch (err) {
    next(err);
  }
});

module.exports = router;

