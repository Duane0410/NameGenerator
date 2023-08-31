import { useEffect, useState } from 'react';
// import '@chatscope/chat-ui-kit-react';
// import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
// import {MainContainer, ChatContainer, MessageList, Message, MessageInput} from '@chatscope/chat-ui-kit-react';

// const API_KEY = "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";
// const API_KEY = "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";
const API_KEY = "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";
// const API_KEY = "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";

function useOpenAI(category='rivers') {
   const[messages,setMessages]= useState([
    {
      message:"Hello",
      sender: "Chatgpt"
    }
   ])
   const handle= async (message) => {
    const newMessage = {
      message : message,
      sender:"user"
    //   direction: "outgoing"
    }
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    await process(newMessages);
   }

   async function process(chat) {
    let apim = chat.map((mesobj) => {
      let role = "";
      if(mesobj.sender === "chatgpt"){
        role="assistant"
      }
      else{
        role="user"
      }
      return{ role: role, content: mesobj.message }
    });

    const systemMessage = {
      role: "system",
      content: "keep it as simple as possible"
    }

    const apireq = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apim
      ] 
    }
    
    await fetch("https://api.openai.com/v1/chat/completions",{
      method: "POST",
      headers:{
        "Authorization": "Bearer " + API_KEY,
         "Content-Type" : "application/json" 
      },
      body: JSON.stringify(apireq)
    }).then((data)=>{
      return data.json();
    }).then((data)=>{
      console.log('Data - ', data);
      if (data?.choices[0]?.message?.content) {
        setMessages(
          [...chat, {
            message: data.choices[0].message.content,
            sender: "chatgpt"
          }]
        )
      } else {
        console.log('Rate limit error');
      }
      console.log('OpenAI message - ',messages)
    });
   }

    useEffect(() => {
        handle(`list 100 ${category} names make sure that it is an array of strings do not give any extra text nor index for the list`)
    }, [])
   
   
  return messages
//     <div>
//       <div >
//     <MainContainer>
//       <ChatContainer>
//         <MessageList>
            
//             {
//             messages.map((message, i) => {
//                 return <Message key={i} model={message}/>
//             })
//             }

//         </MessageList>
//         <MessageInput placeholder='type message' onSend={handle}/>
//       </ChatContainer>
//     </MainContainer>
//     </div>
//     </div>
//   );
}

export default useOpenAI;