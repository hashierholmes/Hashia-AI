const { GoogleGenerativeAI } = require('@google/generative-ai');
const { config, systemInstruction } = require('../config');

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

const generateTextResponse = async (history, text) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      systemInstruction: systemInstruction,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(text);
    const response = await result.response;
    return response.text().replace(/\*{1,3}/g, '');
  } catch (error) {
    console.error('Error with Gemini text processing:', error);
    return 'I apologize, but I\'m having trouble processing your message right now. Please try again later.';
  }
};

const generateImageResponse = async (history, imageParts) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      systemInstruction: systemInstruction,
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 1024,
      }
    });

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(imageParts);
    const response = await result.response;
    return response.text().replace(/\*{1,3}/g, '');
  } catch (error) {
    console.error('Error with Gemini image processing:', error);
    return 'I apologize, but I\'m having trouble analyzing the image you sent. Please try again.';
  }
};

module.exports = {
  generateTextResponse,
  generateImageResponse,
};