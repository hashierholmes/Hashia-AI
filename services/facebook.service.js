const axios = require('axios');
const { config } = require('../config');

const API_URL = `${config.GRAPH_API_URL}/me/messages`;
const API_PROFILE_URL = `${config.GRAPH_API_URL}/me/messenger_profile`;

const callApi = async (url, data) => {
  try {
    const response = await axios.post(
      url,
      data,
      {
        params: { access_token: config.FACEBOOK_PAGE_ACCESS_TOKEN },
        headers: { 'Content-Type': 'application/json' }
      }
    );
    console.log('Facebook API call successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error calling Facebook API:', error.response?.data || error.message);
    throw error;
  }
};

const sendMessage = async (recipientId, messageText) => {
  const messageData = {
    recipient: { id: recipientId },
    message: { text: messageText }
  };
  return callApi(API_URL, messageData);
};

const sendImage = async (recipientId, imageUrls) => {
  const attachments = imageUrls.map((url) => ({
    type: 'image',
    payload: {
      url: url,
      is_reusable: false
    }
  }));

  const messageData = {
    messaging_type: 'RESPONSE',
    recipient: { id: recipientId },
    message: { attachments }
  };
  return callApi(API_URL, messageData);
};

const sendTypingIndicator = async (recipientId, action) => {
  const data = {
    recipient: { id: recipientId },
    sender_action: action // 'typing_on' or 'typing_off'
  };
  try {
    await callApi(API_URL, data);
  } catch (error) {
    console.error(`Error sending ${action} indicator:`, error.response?.data || error.message);
  }
};

const setupMessengerProfile = async () => {
  try {
    console.log('Setting up Get Started button...');
    await callApi(API_PROFILE_URL, { get_started: { payload: 'GET_STARTED' } });

    console.log('Setting up Persistent Menu...');
    await callApi(API_PROFILE_URL, {
      persistent_menu: [{
        locale: 'default',
        composer_input_disabled: false,
        call_to_actions: [
          { title: 'Pinterest', type: 'postback', payload: 'PINTEREST' },
          { title: 'Clear Chat History', type: 'postback', payload: 'CLEAR_HISTORY' }
        ]
      }]
    });
    console.log('Messenger profile setup completed');
  } catch (error) {
    console.error('Error setting up messenger profile:', error.response?.data || error.message);
  }
};

const downloadImage = async (imageUrl) => {
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      headers: { 'Authorization': `Bearer ${config.FACEBOOK_PAGE_ACCESS_TOKEN}` }
    });
    return Buffer.from(response.data).toString('base64');
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
};

module.exports = {
  sendMessage,
  sendImage,
  sendTypingOn: (recipientId) => sendTypingIndicator(recipientId, 'typing_on'),
  sendTypingOff: (recipientId) => sendTypingIndicator(recipientId, 'typing_off'),
  setupMessengerProfile,
  downloadImage,
};