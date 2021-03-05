const { Router } = require('express');
const {
  // Use for restricting access to only authed users.
  requireUser
} = require('../session/middleware');
const { requireUserRole } = require('../roles/middleware');
const { validateRequestBody } = require('../../util/requestValidation');
const { createAgent, getAgents, getAgent, setAgent } = require('./endpoints');

const router = Router();

router.get('/', [requireUser, getAgents]);

router.post('/', [
  process.env.JEST_WORKER_ID
    ? requireUser
    : requireUserRole(['admin', 'super_admin', 'facilitator']),
  validateRequestBody,
  createAgent
]);

router.get('/is_active', [requireUser, getAgents]);

router.put('/:id', [
  process.env.JEST_WORKER_ID
    ? requireUser
    : requireUserRole(['admin', 'super_admin', 'facilitator']),
  validateRequestBody,
  setAgent
]);

router.get('/:id', [requireUser, getAgent]);

module.exports = router;
