const fs = require('fs');
const path = require('path');

//const GEMINI_API_KEY = ""; // H.H

const config = {
  PORT: process.env.PORT || 3000,
  FACEBOOK_VERIFY_TOKEN: process.env.FACEBOOK_VERIFY_TOKEN || 'hashia',
  FACEBOOK_PAGE_ACCESS_TOKEN: process.env.FACEBOOK_PAGE_ACCESS_TOKEN || "EAAOPWwZCtXZBQBPNXsI9eKaxJepzeCZCYcfYNxe6ZBhaZBu6xto9EJmVM7jvFohZBEWifbbAXdew61vnWsSkBL6dg9nniSZCjiOHGZAZCWqsfTeGX5OBz4VCTdYDUIj6WBWSdrddkg7qAmosQEmYu3pQRqGngVB2IpSrHBL4AkPYphSAhgS0VPkrYanHEywkOE9ZBZB44ZAQhwZDZD", // Your actual token here
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GRAPH_API_URL: 'https://graph.facebook.com/v22.0'
};

const systemInstruction = fs.readFileSync(path.join(__dirname, 'systemInstruction', 'prompt.txt'), 'utf8');

module.exports = {
  config,
  systemInstruction
};