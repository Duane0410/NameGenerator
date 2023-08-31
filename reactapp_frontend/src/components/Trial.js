import React, { useEffect, useState } from 'react'
import useOpenAI from '../hooks/useOpenAI'

const Trial = () => {

    const messages = useOpenAI('Roman gods')
    console.log('Message here - ', messages)
    const [names, setNames] = useState()
    // // const names = messages[2].message.split('')
    // const riverArray = JSON.parse(messages[2].message);
    // console.log('Rivers - ', riverArray)
    // const riverString = "Here is your response \n \n [\"Amazon\",\n \"Nile\",\n \"Mississippi\",\n \"Yangtze\",\n \"Ganges\",\n \"Congo\",\n \"Mekong\",\n \"Lena\",\n \"Ob\",\n \"Parana\",\n \"Yenisei\",\n \"Huang He\", \n \"Orinoco\",\n \"Niger\",\n \"Amur\",\n \"Indus\",\n \"Volga\",\n \"Danube\",\n \"Murray\",\n \"Tocantins\",\n \"Tigris\",\n \"Zambezi\",\n \"Rhine\",\n \"Sao Francisco\",\n \"Sacramento\",\n \"Syr Darya\",\n \"Japurá\",\n \"Magdalena\",\n \"Irrawaddy\",\n \"Oyapock\",\n \"Colorado\",\n \"Kuskokwim\",\n \"Nizhnyaya Tunguska\",\n \"Salween\",\n \"Arkansas\",\n \"Purus\",\n \"Essequibo\",\n \"Pechora\",\n \"Tapajós\",\n \"Churchill\",\n \"Vyatka\",\n \"Vistula\",\n \"Saskatchewan\",\n \"Narmada\",\n \"Indigirka\",\n \"Belaya\",\n \"Kama\",\n \"Angara\",\n \"Green\",\n \"Don\",\n \"Middle Ob\",\n \"Indigirskaya\",\n \"Amu Darya\",\n \"Mbomou\",\n \"São Francisco\",\n \"Great Bear\",\n \"Brazos\",\n \"Kasai\",\n \"Cooper Creek\",\n \"Tunguska\",\n \"Lemmenjoki\",\n \"Peace\",\n \"Cahabon\",\n \"Similkameen\",\n \"Macal\",\n \"Ili\",\n \"Gambela\",\n \"Sassandra\",\n \"Río Negro\",\n \"Mekrou\",\n \"Marowijne\",\n \"Basarabia\",\n \"Red Deer\",\n \"Drain\",\n \"Meghna\",\n \"Huallaga\",\n \"Piney\",\n \"Saint John\",\n \"Wonosobo\",\n \"Zambrana\",\n \"Savannah\",\n \"Sutlej\",\n \"Krishna\",\n \"Sumpul\",\n \"Gállego\",\n \"Milk\",\n \"Sepik\",\n \"Anabar\",\n \"Chumbal\",\n \"San Antonio\",\n \"Morava\",\n \"Kamenka\",\n \"Paranapanema\",\n \"Okavango\",\n \"Awash\",\n \"Piave\"]";

    useEffect(() => {
      if (messages[2]?.message) {
      // if(riverString) {
        try {
          const index = messages[2].message.indexOf('[') - 1
          const namesString = messages[2].message.substring(index)
          console.log('String - ', namesString)
          setNames(JSON.parse(namesString));
          // const index = riverString.indexOf('[') - 1
          // setNames(JSON.parse(riverString.substring(index)))
          console.log('Names - ', names);
        } catch (error) {
          console.error("Error parsing JSON: ", error);
        }
      } else {
        console.log('Error retrieving names!')
      }
    }, [messages])
    


  return (
    <div>
        <h1>Generate</h1>
        {names
          ?<ul>
            {Array.from(names).map((name,index) => 
                <li key={index}>
                    {name}
                </li>)}
          </ul>
          : <p>Loading...</p>
        }
    </div>
  )
}

export default Trial