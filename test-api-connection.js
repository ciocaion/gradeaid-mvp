// Simple script to test OpenAI API connection
require('dotenv').config();
const fetch = require('node-fetch');

const apiKey = process.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.error('Error: No OpenAI API key found in .env file');
  process.exit(1);
}

console.log('API Key found:', apiKey.substring(0, 10) + '...');

// Test basic API connection
async function testBasicConnection() {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Hello, can you hear me?' }],
        max_tokens: 50
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error, null, 2));
    }

    const data = await response.json();
    console.log('Basic API Connection Successful!');
    console.log('Response:', data.choices[0].message.content);
    
    return true;
  } catch (error) {
    console.error('Error connecting to OpenAI API:', error);
    return false;
  }
}

// Test the vision API (used for image analysis)
async function testVisionAPI() {
  // A simple base64 encoded 1x1 pixel image (white)
  const sampleBase64Image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  
  try {
    console.log('Testing Vision API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'What is in this image?' },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/png;base64,${sampleBase64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 100
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error, null, 2));
    }

    const data = await response.json();
    console.log('Vision API Connection Successful!');
    console.log('Response:', data.choices[0].message.content);
    
    return true;
  } catch (error) {
    console.error('Error connecting to OpenAI Vision API:', error);
    return false;
  }
}

// Run the tests
async function runTests() {
  const basicTest = await testBasicConnection();
  if (basicTest) {
    await testVisionAPI();
  }
}

runTests(); 