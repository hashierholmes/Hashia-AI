# Facebook Messenger AI Chatbot with Gemini Integration

Facebook Messenger chatbot powered by Google's Gemini AI that can handle text conversations, analyze images, and fetch Pinterest images. The bot features persistent chat history, typing indicators, and a clean web interface.

## 🌟 Features

- **AI-Powered Conversations**: Utilizes Google Gemini 2.0 Flash for intelligent responses
- **Image Analysis**: Process and analyze images sent through Messenger
- **Pinterest Integration**: Search and send Pinterest images using `/pinterest` command
- **Persistent Chat History**: Maintains conversation context for each user
- **Typing Indicators**: Shows when the bot is processing messages
- **Message Splitting**: Automatically splits long responses into multiple messages
- **Web Interface**: Includes privacy policy and terms of service pages
- **Health Monitoring**: Built-in health check endpoint
- **Graceful Shutdown**: Saves chat history before server shutdown

## 🏗️ Project Structure

```
project-root/
├── index.js                 // Main server entry point
├── app.js                   // Express app setup, middleware, and routes
├── config.js                // All configuration variables and constants
│
├── controllers/
│   └── webhook.controller.js  // Logic for handling webhook events
│
├── routes/
│   └── api.routes.js        // All application routes
│
├── services/
│   ├── chat.service.js      // Manages chat history and main message handling
│   ├── facebook.service.js  // Functions that interact with the Facebook Graph API
│   └── gemini.service.js    // Functions that interact with the Gemini API
│
├── public/                  // static HTML files
│   ├── index.html
│   ├── pptos.html
│   ├── policy.html
│   └── terms.html
│
├── systemInstruction/         // Hashia system instructions
│   └── prompt.txt
│
├── tmp/
│   └── chat_history_backup.json   # Backup chat history (auto-generated)
└── README.md                       # This file
```

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Facebook Developer Account
- Google Cloud Account (for Gemini API)

### Setup Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hashierholmes/Hashia
   cd Hashia
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create required directories**:
   ```bash
   mkdir -p systemInstruction public tmp
   ```

4. **Create system instruction file**:
   Create `systemInstruction/prompt.txt` with your AI's personality and instructions.

5. **Set up environment variables**:
   ```bash
   # Create .env file
   FACEBOOK_VERIFY_TOKEN=your_verify_token_here
   FACEBOOK_PAGE_ACCESS_TOKEN=your_page_access_token_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

## 🔧 Facebook Developer Setup

### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "Create App" → "Business" → "Next"
3. Enter app name and contact email
4. Click "Create App"

### Step 2: Add Messenger Product

1. In your app dashboard, click "Add Product"
2. Find "Messenger" and click "Set Up"
3. Scroll down to "Webhooks" section

### Step 3: Create Facebook Page

1. Go to [Facebook Pages](https://www.facebook.com/pages/create)
2. Create a new page for your business/bot
3. Note down the Page ID

### Step 4: Generate Page Access Token

1. In Messenger settings, find "Access Tokens" section
2. Select your page and generate token
3. Copy the Page Access Token to your environment variables

### Step 5: Setup Webhook

1. In Messenger → Webhooks, click "Add Callback URL"
2. Enter your webhook URL: `https://yourdomain.com/webhook`
3. Enter your verify token (any string you choose)
4. Subscribe to these webhook fields:
   - `messages`
   - `messaging_postbacks`
   - `messaging_optins`
   - `message_deliveries`

### Step 6: Subscribe to Page

1. In "Webhooks" section, click "Add Subscriptions"
2. Select your page and subscribe

### Step 7: App Review (for public use)

For public deployment, submit your app for review:
1. Add Privacy Policy URL: `https://yourdomain.com/privacy`
2. Add Terms of Service URL: `https://yourdomain.com/terms`
3. Submit for "pages_messaging" permission

## 🔑 Obtaining Gemini API Key

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable billing (required for Gemini API)

### Step 2: Enable Generative AI API

1. In Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Generative Language API"
3. Click on it and press "Enable"

### Step 3: Create API Key

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key
4. (Recommended) Restrict the API key to Generative Language API only

### Step 4: Alternative Method (Google AI Studio)

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" → "Create API Key"
4. Select your Google Cloud project
5. Copy the generated key

## 🚀 Deployment

### Local Development

```bash
npm start
# or
node index.js
```

The server will start on port 3000. Use tools like ngrok for webhook testing:

```bash
ngrok http 3000
```

### Production Deployment

Popular deployment options:

1. **Heroku**:
   ```bash
   # Install Heroku CLI
   heroku create your-app-name
   heroku config:set FACEBOOK_VERIFY_TOKEN=your_token
   heroku config:set FACEBOOK_PAGE_ACCESS_TOKEN=your_token
   heroku config:set GEMINI_API_KEY=your_key
   git push heroku main
   ```

2. **Railway**:
   - Connect GitHub repository
   - Set environment variables in dashboard
   - Deploy automatically

3. **DigitalOcean App Platform**:
   - Create new app from GitHub
   - Configure environment variables
   - Deploy

## 🎯 Core Functions Explained

### Main Application Flow

```javascript
// Webhook verification for Facebook
app.get('/webhook', ...) // Verifies webhook with Facebook

// Message processing
app.post('/webhook', ...) // Receives and processes messages

// Core message handlers
handleMessage() // Routes different message types
handleTextMessage() // Processes text with Gemini AI
handleImageMessage() // Analyzes images with Gemini Vision
handlePinterest() // Fetches Pinterest images
```

### Key Components

1. **Chat History Management**:
   - Stores conversation context per user
   - Limits to 20 messages to manage memory
   - Persists on graceful shutdown

2. **Message Processing**:
   - Handles text, images, and postbacks
   - Splits long responses automatically
   - Maintains conversation flow

3. **AI Integration**:
   - Uses Gemini 2.0 Flash model
   - Configurable temperature and parameters
   - System instructions for personality

4. **Pinterest Integration**:
   - Searches Pinterest via external API
   - Returns up to 10 unique images
   - Command: `/pinterest search term`

## 🛠️ Troubleshooting

### Common Issues

#### 1. Webhook Verification Failed
**Problem**: Facebook can't verify your webhook
**Solutions**:
- Ensure webhook URL is publicly accessible
- Check FACEBOOK_VERIFY_TOKEN matches exactly
- Verify HTTPS is used (required for production)
- Check server logs for errors

#### 2. Messages Not Received
**Problem**: Bot doesn't respond to messages
**Solutions**:
- Verify page subscription to webhook
- Check FACEBOOK_PAGE_ACCESS_TOKEN is valid
- Ensure webhook fields include 'messages'
- Test with health endpoint: `/health`

#### 3. Gemini API Errors
**Problem**: AI responses fail
**Solutions**:
- Verify GEMINI_API_KEY is correct and active
- Check Google Cloud billing is enabled
- Ensure Generative Language API is enabled
- Review API quotas and limits

#### 4. Image Processing Issues
**Problem**: Images can't be analyzed
**Solutions**:
- Check image URL accessibility
- Verify Facebook Page Access Token permissions
- Ensure images are in supported formats (JPEG, PNG)
- Review Gemini Vision model limits

#### 5. Pinterest Command Not Working
**Problem**: `/pinterest` returns no results
**Solutions**:
- Check external Pinterest API availability
- Verify network connectivity
- Test with different search terms
- Review API rate limits

### Debug Commands

```bash
# Check server health
curl https://yourdomain.com/health

# View chat history for debugging
curl https://yourdomain.com/chat-history/USER_ID

# Test webhook manually
curl -X POST https://yourdomain.com/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### Environment Variables Check

```javascript
// Add this to verify your environment
console.log('Environment Check:');
console.log('FACEBOOK_VERIFY_TOKEN:', process.env.FACEBOOK_VERIFY_TOKEN ? '✓ Set' : '✗ Missing');
console.log('FACEBOOK_PAGE_ACCESS_TOKEN:', process.env.FACEBOOK_PAGE_ACCESS_TOKEN ? '✓ Set' : '✗ Missing');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✓ Set' : '✗ Missing');
```

### Logs and Monitoring

Monitor these logs for issues:
- Webhook verification attempts
- Message processing errors
- Gemini API responses
- Image download failures
- Pinterest API calls

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/webhook` | GET | Webhook verification |
| `/webhook` | POST | Message processing |
| `/health` | GET | Health check |
| `/chat-history/:senderId` | GET | Debug chat history |
| `/` | GET | Main landing page |
| `/privacy` | GET | Privacy policy |
| `/terms` | GET | Terms of service |

## 🔒 Security Considerations

1. **Environment Variables**: Never commit API keys to version control
2. **Webhook Verification**: Always verify Facebook webhook signatures in production
3. **Rate Limiting**: Implement rate limiting for production use
4. **Input Validation**: Sanitize all user inputs
5. **Error Handling**: Don't expose sensitive error details to users

---

**Note**: This bot requires proper setup of Facebook Developer account, page permissions, and Google Cloud billing. Ensure all prerequisites are met before deployment.