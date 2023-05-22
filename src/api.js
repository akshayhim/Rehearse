import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
      'Content-Type': 'application/json',
      Authorization: import.meta.env.VITE_GPTKEY // Replace with your actual API key
    },
  });

const sendMessageToChatGPT = async (message) => {
    try {
      const response = await api.post('/chat/completions', {
        messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: message }],
        model: 'gpt-3.5-turbo',
      });
      return response.data.choices[0].message.content;
    } catch (error) {
      console.log('Error communicating with the ChatGPT API:', error);
      console.log('ChatGPT API error response:', error.response.data.error);
      throw error;
    }
  };

export { sendMessageToChatGPT };
