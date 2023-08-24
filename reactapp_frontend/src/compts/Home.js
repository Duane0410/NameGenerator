import React from 'react'
//import 'bootstrap/dist/css/bootstrap.min.css'
import  Card from './Card.js'
import './home-style.css'

function Home ()
{
    return (
        <div >
            <div className='heading'>
                <h1>Welcome User</h1>
                <button className='logout'>Logout</button>
            </div>
           <div className='background'>
            <div className='card-sapce'>
            <Card
            title="VM"
            imageUrl=''
            body="A virtual machine, commonly shortened to just VM, is no different than any other physical computer like a laptop, smart phone, or server. It has a CPU, memory, disks to store your files, and can connect to the internet if needed. "
            />
            </div>
          
            <div className='card-sapce'>
            <Card
            title="S3 Buckets"
            imageUrl=''
            body="A virtual machine, commonly shortened to just VM, is no different than any other physical computer like a laptop, smart phone, or server. It has a CPU, memory, disks to store your files, and can connect to the internet if needed. "
            />
            </div>
            <div className='card-sapce'>
            <Card
            title="Database Instances"
            imageUrl=''
            body="A virtual machine, commonly shortened to just VM, is no different than any other physical computer like a laptop, smart phone, or server. It has a CPU, memory, disks to store your files, and can connect to the internet if needed. "
            />
            </div>
           </div>
              
            <div className='add'>
                <button >Add a resource</button>
            </div>

        </div>
    )
}
export default Home