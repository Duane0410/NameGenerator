import { useEffect, useState } from 'react';
import process from 'process'

const apiKey = process.env.REACT_APP_API_KEY

function useOpenAI(category='Stone') {
    const [messages, setMessages]= useState([
    {
        message:"Hello",
        sender: "Chatgpt"
    }])
    
    const handle = async (message) => {
        const newMessage = {
            message : message,
            sender:"user"
        }
        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
        await process(newMessages);
    }

    async function process(chat) {
        let apim = chat.map((mesobj) => {
            let role = "";
            if (mesobj.sender === "chatgpt") {
                role = "assistant"
            } else {
                role = "user"
            }
            return { role: role, content: mesobj.message }
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
        
        await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers:{
                "Authorization": "Bearer " + apiKey,
                "Content-Type" : "application/json" 
            },
            body: JSON.stringify(apireq)
        }).then((data) => {
            return data.json();
        }).then((data) => {
            console.log('Data - ', data);
            if (data?.choices[0]?.message?.content) {
                setMessages(
                [...chat, {
                    message: data.choices[0].message.content,
                    sender: "chatgpt"
                }])
            } else {
                console.log('Rate limit error');
            }
            console.log('OpenAI message - ',messages)
        }).catch((error) => {
            console.log(error)
        });
   }

    useEffect(() => {
        const prompt = `List 100 ${category} names sorting according to dictionary alphabetically make sure that it is an array of strings the strings should be in "", do not give any extra text nor index for the list also put the string in box brackets([]). Names should not refer to any human or real-world entiy/event to avoid any controveries (E.g. hitler) and should begin with a capital alphabet`
        handle(prompt)
    }, [category])
   
    return messages
}

export default useOpenAI;