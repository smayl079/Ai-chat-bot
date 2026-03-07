import { ChatSession } from './chat-function.js';

/**
 * Test the chat function with example questions
 * This demonstrates how the conversation history is maintained
 */
async function testChatFunction() {
  console.log('\n🤖 Testing Chat Function with Conversation History\n');
  
  // Create a new chat session
  const chatSession = new ChatSession();

  try {
    // First question
    console.log('👤 User: What is JavaScript?');
    const response1 = await chatSession.sendMessage('What is JavaScript?');
    console.log('🤖 Assistant:', response1);
    console.log('\n' + '─'.repeat(80) + '\n');

    // Second question - This relies on conversation history
    console.log('👤 User: Can you give me a simple example?');
    const response2 = await chatSession.sendMessage('Can you give me a simple example?');
    console.log('🤖 Assistant:', response2);
    console.log('\n' + '─'.repeat(80) + '\n');

    // Display conversation summary
    console.log('📊 Conversation Summary:');
    console.log(`Total messages: ${chatSession.getHistory().length}`);
    console.log(`User messages: ${chatSession.getHistory().filter(m => m.role === 'user').length}`);
    console.log(`Assistant messages: ${chatSession.getHistory().filter(m => m.role === 'model').length}`);
    
    console.log('\n✅ Test completed successfully!\n');

  } catch (error) {
    console.error('❌ Error during test:', error.message);
    process.exit(1);
  }
}

// Run the test
testChatFunction();
