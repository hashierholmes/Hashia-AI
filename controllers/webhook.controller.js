const { config } = require('../config');
const chatService = require('../services/chat.service');
const facebookService = require('../services/facebook.service');

const verifyWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === config.FACEBOOK_VERIFY_TOKEN && mode === 'subscribe') {
    console.log('Webhook verified');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
};

const handleWebhookEvent = async (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    res.status(200).send('EVENT_RECEIVED');

    for (const entry of body.entry) {
      for (const webhookEvent of entry.messaging) {
        console.log('Received webhook event:', JSON.stringify(webhookEvent, null, 2));

        const senderId = webhookEvent.sender.id;
        if (!senderId) continue;

        await facebookService.sendTypingOn(senderId);

        try {
          if (webhookEvent.message) {
            const messageText = webhookEvent.message.text?.trim().toLowerCase();
            if (messageText?.startsWith('/pinterest')) {
              await chatService.handlePinterestCommand(senderId, webhookEvent.message.text);
            } else {
              await chatService.handleMessage(senderId, webhookEvent.message);
            }
          } else if (webhookEvent.postback) {
            await chatService.handlePostback(senderId, webhookEvent.postback.payload);
          }
        } catch (error) {
            console.error('Error processing event for sender:', senderId, error);
        } finally {
            await facebookService.sendTypingOff(senderId);
        }
      }
    }
  } else {
    res.sendStatus(404);
  }
};

module.exports = {
  verifyWebhook,
  handleWebhookEvent,
};