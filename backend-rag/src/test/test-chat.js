// Test Script for Chat API
import fetch from 'node-fetch';

const API_URL = 'http://localhost:3001/api';

// Test questions for each website
const testQueries = [
  {
    websiteId: 1,
    websiteName: 'SmileCare Dental',
    questions: [
      'What services do you offer?',
      'How much does teeth whitening cost?',
      'What are your working hours?',
      'Do you accept insurance?',
      'Tell me about Dr. Sarah Johnson'
    ]
  },
  {
    websiteId: 2,
    websiteName: 'TechForge Solutions',
    questions: [
      'What technologies do you use?',
      'How much does a mobile app cost?',
      'What is your development process?',
      'Do you provide post-launch support?',
      'Can you help with cloud infrastructure?'
    ]
  },
  {
    websiteId: 3,
    websiteName: 'LearnHub Academy',
    questions: [
      'What courses do you offer?',
      'How much is a subscription?',
      'Do you offer certificates?',
      'Can I download courses for offline viewing?',
      'Is there a free trial?'
    ]
  }
];

async function testChat(websiteId, message) {
  try {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`Testing: "${message}"`);
    console.log(`Website ID: ${websiteId}`);
    console.log('='.repeat(80));

    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ websiteId, message })
    });

    const data = await response.json();

    if (data.success) {
      console.log('\n✅ SUCCESS\n');
      console.log('Answer:', data.answer);
      console.log('\nMetadata:');
      console.log('  - Website:', data.metadata.websiteName);
      console.log('  - Sources:', data.sources.join(', '));
      console.log('  - Chunks Retrieved:', data.metadata.chunksRetrieved);
      console.log('  - Processing Time:', data.metadata.processingTimeMs, 'ms');
    } else {
      console.log('\n❌ ERROR\n');
      console.log('Error:', data.error);
      console.log('Code:', data.code);
    }
  } catch (error) {
    console.log('\n❌ REQUEST FAILED\n');
    console.log('Error:', error.message);
  }
}

async function runTests() {
  console.log('🤖 RAG Chatbot - Test Suite');
  console.log('Testing chat API with sample questions\n');

  // Test each website
  for (const testSet of testQueries) {
    console.log(`\n${'█'.repeat(80)}`);
    console.log(`TESTING: ${testSet.websiteName.toUpperCase()}`);
    console.log('█'.repeat(80));

    // Ask each question
    for (const question of testSet.questions) {
      await testChat(testSet.websiteId, question);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between requests
    }
  }

  console.log('\n\n✨ Test suite completed!');
}

// Run tests
runTests().catch(console.error);
