import React, {Component} from 'react'

class Page1 extends Component
{

    constructor()
    {
        super()
        this.state={
            email:'',
            password:'',
            login:false,
            store:null
        }
    }

    componentDidMount()
    {
        this.storeCollector()
    }

    storeCollector()
    {
        let store=JSON.parse(localStorage.getItem("login"))
        if (store && store.value)
        {
            this.setState({login:true, store:store})
        }
    }

    login()
    {
        fetch('http://localhost:5500/post',
             { 
                method:'POST',
                body:JSON.stringify(this.state)
            })
            .then((Response)=>{
                Response.json().then((result)=>{
                    console.warn("result",result)
                    localStorage.setItem('login',JSON.stringify({
                        login:true,
                        store:result.token
                    }))
                   this.storeCollector()
                }) 
            })
    }

    post()
    {
        let token="Bearer "+ this.state.store.token
        fetch('https://jsonplaceholder.typicode.com/posts',
        { 
           method:'POST',
           body:JSON.stringify(this.state.post),
           headers:{
"Authorization":token
           }
       })
       .then((Response)=>{
           Response.json().then((result)=>{
               console.warn("result",result)
             
           }) 
       })
    }

    render()
    {
        return(
            <div>
                <h1>JWT AUTHENTICATION</h1>
                {
                    !this.state.login?
                    <div>
                    <input type='text' onChange={(event)=>{this.setState({email:event.target.value})}}/><br/><br/>
                    <input type='password' onChange={(event)=>{this.setState({password:event.target.value})}}/><br/><br/>
                    <button onClick={()=>{this.login()}}>Login</button>
                </div>:
                <div>
                    <textarea onChange={(event)=>this.setState({post:event.target.value})}></textarea>
                    <button onClick={()=>{this.post()}}>POST</button>
                    </div>
                }
            </div>
        )
    }
}

export default Page1