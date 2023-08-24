import React from 'react'
//import 'bootstrap/dist/css/bootstrap.min.css'
import  Card from './Card.js'
import './home-style.css'


function Vmtable ()
{
    return (
        <div >
            <div className='heading'>
                <h1>VMs</h1>
                <button className='logout'>Back</button>
            </div>
            <div className='generate'>
            <div >
                <button>
                    Generate a name
                </button>
                </div><div>
                <textarea>

                </textarea>
                </div><div>
                <button>
                    Accept
                </button>
            </div>
            </div>
           
            <div className='tbl'>
            <table>
            <thead>
                <th>Team-id</th>
                <th>Resource</th>
                <th>Name</th>
            </thead>
            <tbody>
                <tr>
                    <td>
                     
                     </td>
                     <td>
                         
                     </td>
                     <td>
                         
                     </td>
                </tr>
               
            </tbody>
           </table>
           <table>
            <tr>
            <th>Delete</th>
            <th>Update</th>
            </tr>
            <tr>
              <td>
              <img src={require('./delete.jpeg')} alt='img' height='30px' width='30px' ></img>
              </td>  
              <td>
              <img src={require('./edit.jpeg')} alt='img' height='30px' width='30px' ></img>
              </td>  
            </tr>            
           </table>
            </div>
           
        </div>
    )
}
export default Vmtable