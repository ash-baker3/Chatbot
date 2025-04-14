import openai from './config/open-ai.js';
import readlineSync from 'readline-sync';
import colors from 'colors';

async function main() {
  console.log(colors.bold.green('Welcome to the Chatbot!'));
  console.log(colors.bold.green('Ask Anything!!!'));

  const chatHistory = []; // Storing conversation history

  while (true) {
    const userInput = readlineSync.question(colors.yellow('You: '));

    try {
      // Constructing messages by iterating over the history
      const messages = chatHistory.map(([role, content]) => ({
        role,
        content,
      }));

      // Adding latest user input
      messages.push({ role: 'user', content: userInput });

      // Calling the API with user input & history
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
      });

      // Getting completion text/content
      const completionText = completion.choices[0].message.content;

      if (userInput.toLowerCase() === 'exit') {
        console.log(colors.green('Bot: ') + completionText);
        return;
      }

      console.log(colors.green('Bot: ') + completionText);

      // Updating history with user input and assistant response
      chatHistory.push(['user', userInput]);
      chatHistory.push(['assistant', completionText]);

    } catch (error) {
      if (error instanceof openai.APIError) {
        console.error(colors.red(`API Error [${error.status}]: ${error.name}`));
        console.error(colors.red(error.message));
        if (error.code) {
          console.error(colors.red(`Error code: ${error.code}`));
        }
      } else {
        console.error(colors.red("Unexpected error: "), error);
      }
      return;
    }
  }
}

main();