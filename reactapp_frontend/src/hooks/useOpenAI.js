import { useEffect, useState } from 'react';

const API_KEY = "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";

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
        handle(`list first 5 ${category} names sorting according to dictionary wise alphabetically  make sure that it is an array of strings do not give any extra text nor index for the list`)
    }, [])
   
   
  return messages
}

export default useOpenAI;