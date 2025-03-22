// Simple test for OpenAI API key
const fs = require('fs');
const path = require('path');
const https = require('https');

// Read the .env file
try {
  const envFile = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  const apiKeyMatch = envFile.match(/VITE_OPENAI_API_KEY=([^\s]+)/);
  
  if (!apiKeyMatch || !apiKeyMatch[1]) {
    console.error('❌ No OpenAI API key found in .env file');
    process.exit(1);
  }
  
  const apiKey = apiKeyMatch[1];
  console.log(`📝 Found API key: ${apiKey.substring(0, 10)}...`);
  
  // Test the key with a simple request
  console.log('🔍 Testing API key with OpenAI...');
  
  const options = {
    hostname: 'api.openai.com',
    port: 443,
    path: '/v1/models',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  };
  
  const req = https.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✅ API key is valid and working!');
        const response = JSON.parse(data);
        console.log(`🤖 Available models: ${response.data.slice(0, 3).map(m => m.id).join(', ')}...`);
      } else {
        console.error('❌ API key validation failed:', res.statusCode);
        console.error(data);
      }
    });
  });
  
  req.on('error', (error) => {
    console.error('❌ Request error:', error);
  });
  
  req.end();
  
} catch (error) {
  console.error('❌ Error reading .env file:', error);
} 