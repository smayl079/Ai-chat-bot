/**
 * Simple Example: Chat Function with Two Questions
 * This demonstrates conversation history in action
 */

import { ChatSession } from './chat-function.js';

// Create new chat session
const chat = new ChatSession();

console.log('🤖 Starting Chat Session...\n');

// Question 1
console.log('Question 1: What is Node.js?');
const answer1 = await chat.sendMessage('What is Node.js?');
console.log('Answer:', answer1);
console.log('\n' + '─'.repeat(80) + '\n');

// Question 2 (uses context from Question 1)
console.log('Question 2: What are its main use cases?');
const answer2 = await chat.sendMessage('What are its main use cases?');
console.log('Answer:', answer2);
console.log('\n' + '─'.repeat(80) + '\n');

// Show that history is maintained
console.log('📝 Total messages in history:', chat.getHistory().length);
console.log('✅ Both user questions and assistant responses are stored!\n');
