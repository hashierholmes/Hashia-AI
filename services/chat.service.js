const axios = require('axios');
const facebookService = require('./facebook.service');
const geminiService = require('./gemini.service');

const chatHistory = new Map();

const getHistoryFor = (senderId) => {
  if (!chatHistory.has(senderId)) {
    chatHistory.set(senderId, []);
  }
  return chatHistory.get(senderId);
};

const updateHistory = (senderId, newUserMessage, newModelResponse) => {
  const userHistory = getHistoryFor(senderId);
  if (newUserMessage) {
    userHistory.push(newUserMessage);
  }
  if (newModelResponse) {
    userHistory.push(newModelResponse);
  }
  
  if (userHistory.length > 20) {
    userHistory.splice(0, userHistory.length - 20);
  }
};

const sendLongMessage = async (recipientId, text) => {
  const MAX_LENGTH = 1900;
  if (text.length > MAX_LENGTH) {
    const chunks = text.match(new RegExp(`.{1,${MAX_LENGTH}}`, 'g'));
    for (const chunk of chunks) {
      await facebookService.sendMessage(recipientId, chunk);
    }
  } else {
    await facebookService.sendMessage(recipientId, text);
  }
};

const handleMessage = async (senderId, message) => {
  try {
    const userHistory = getHistoryFor(senderId);
    let responseText;
    let userMessageForHistory = null;

    if (message.attachments?.some(att => att.type === 'image')) {
      const imageAttachments = message.attachments.filter(att => att.type === 'image');
      const imageUrl = imageAttachments[0].payload.url;
      const imageData = await facebookService.downloadImage(imageUrl);
      
      const imageParts = [{ inlineData: { mimeType: 'image/jpeg', data: imageData } }];
      const promptText = message.text?.trim() || 'What do you see in this image? Please describe it in detail.';
      imageParts.push({ text: promptText });
      
      responseText = await geminiService.generateImageResponse(userHistory, imageParts);
      userMessageForHistory = { role: 'user', parts: imageParts, timestamp: new Date().toISOString() };
    } else if (message.text) {
      responseText = await geminiService.generateTextResponse(userHistory, message.text);
      userMessageForHistory = { role: 'user', parts: [{ text: message.text }], timestamp: new Date().toISOString() };
    } else {
      responseText = "I'm sorry, I can only process text messages and images at the moment.";
    }

    const modelResponseForHistory = { role: 'model', parts: [{ text: responseText }], timestamp: new Date().toISOString() };
    updateHistory(senderId, userMessageForHistory, modelResponseForHistory);

    await sendLongMessage(senderId, responseText);
  } catch (error) {
    console.error('Error handling message:', error);
    await facebookService.sendMessage(senderId, 'Sorry, I encountered an error processing your message. Please try again.');
  }
};

const handlePostback = async (senderId, payload) => {
  let response;
  switch (payload) {
    case 'GET_STARTED':
      response = 'Hello! I\'m Hashia your personal AI companion. I can help you with questions and analyze images you send me. How can I assist you today? 😊';
      break;
    case 'CLEAR_HISTORY':
      chatHistory.delete(senderId);
      response = 'Your chat history has been cleared. How can I help you today?';
      break;
    case 'PINTEREST':
      response = 'Please enter what image you are looking for after /pinterest';
      break;
    default:
      response = 'I received your request. How can I help you?';
  }
  await facebookService.sendMessage(senderId, response);
};

const handlePinterestCommand = async (senderId, messageText) => {
  const input = messageText.trim().split(' ').slice(1).join(' ');
  if (!input) {
    await facebookService.sendMessage(senderId, 'Please enter what image you are looking for after /pinterest');
    return;
  }

  try {
    const res = await axios.get(`https://hashier-api-v1.vercel.app/api/pinterest?search=${encodeURIComponent(input)}`);
    const content = res.data.data;
    const uniqueUrls = [...new Set(content)].slice(0, 10);

    if (uniqueUrls.length === 0) {
      await facebookService.sendMessage(senderId, 'No images found for your search.');
      return;
    }

    await facebookService.sendMessage(senderId, "Please wait while sending the images...");
    await facebookService.sendImage(senderId, uniqueUrls);
  } catch (error) {
    console.error("Error in pinterest command:", error);
    await facebookService.sendMessage(senderId, "Something went wrong while fetching images.");
  }
};

module.exports = {
  handleMessage,
  handlePostback,
  handlePinterestCommand,
  chatHistory,
};