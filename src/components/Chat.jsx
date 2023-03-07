import React, { useState } from 'react';
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';

export default function Chat() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: 'hello, i am chat gpt',
      sender: 'chatgpt',
    },
  ]);
  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: 'user',
      direction: 'outgoing',
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    setTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = '';
      if (messageObject.role === 'ChatGPT') {
        role = 'assistant';
      } else {
        role = 'user';
      }
      return { role: role, content: messageObject.message };
    });

    const systemMessage = {
      role: 'system',
      content:
        'You are a great tour guide who shows what can be done in a city, country or area. You should sometimes ask questions for better answers',
    };

    const apiRequestBody = {
      messages: [systemMessage, ...apiMessages],
    };
   
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_END_POINT}/openai/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            apiRequestBody,
          }),
        }
      );
      if (!response.ok) {
        throw new Error('prompt could not be generated');
      }
      const completion = await response.json();
      console.log(completion.data);
      setMessages([
        ...chatMessages, {
            message: completion.data,
            sender: "ChatGPT"
        }
      ])

    } catch (error) {
      console.log(error);
    }

    setTyping(false);
  }

  return (
    <div style={{ position: 'relative', height: '800px', width: '700px' }}>
      <MainContainer>
        <ChatContainer>
          <MessageList
          scrollBehavior='smooth'
            typingIndicator={
              typing ? <TypingIndicator content='ChatGPT is typing' /> : null
            }
          >
            {messages.map((message, i) => {
              return <Message key={i} model={message} />;
            })}
          </MessageList>
          <MessageInput placeholder='type here' onSend={handleSend} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}
