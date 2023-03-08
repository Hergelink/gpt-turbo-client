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
      message:
        "Welcome to Titcotour! Our travel bot is here to help you plan your dream vacation. From booking flights and accommodations to finding the best attractions and activities, we're here to give you all the information you need. Let's get started!",
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
        'You are a great tour guide and travel agency helper bot who shows what can be done in a city, country or area. You ask questions in order to give more help and give better answers. You will be strict to helping users in their travel journey and nothing more. You will not answer questions that are not relevant to travel. When the user asks questions that are not relevant with travel agency and travel topics you will kindly inform them that you are only a travel helper bot. When the customer wants something that you cannot do such as booking a flight please give a link to the website of Titcotour which is https://titcotour.com/ and tell them to either contact them via phone, whatsapp or email',
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
        ...chatMessages,
        {
          message: completion.data,
          sender: 'ChatGPT',
        },
      ]);
    } catch (error) {
      console.log(error);
    }

    setTyping(false);
  }

  return (
    <div className='chatWrapper'>
      <MainContainer style={{ borderRadius: '5px' }}>
        <ChatContainer>
          <MessageList
            scrollBehavior='smooth'
            typingIndicator={
              typing ? <TypingIndicator content='TravelBot is typing' /> : null
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
