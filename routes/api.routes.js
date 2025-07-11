const express = require('express');
const path = require('path');
const webhookController = require('../controllers/webhook.controller');
const { chatHistory } = require('../services/chat.service');

const router = express.Router();

router.get('/webhook', webhookController.verifyWebhook);
router.post('/webhook', webhookController.handleWebhookEvent);

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});
router.get('/privacy-policy-terms-of-service', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'pptos.html'));
});
router.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'policy.html'));
});
router.get('/terms', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'terms.html'));
});

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    activeChats: chatHistory.size
  });
});

router.get('/chat-history/:senderId', (req, res) => {
  const { senderId } = req.params;
  const history = chatHistory.get(senderId) || [];
  res.json({
    senderId,
    historyLength: history.length,
    history,
  });
});

module.exports = router;