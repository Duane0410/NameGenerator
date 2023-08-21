import logo from './logo.svg';
import './App.css';
import Page1 from './compts/Page1'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Register from './compts/Register'
import Login from './compts/Login'
import 'bootstrap/dist/css/bootstrap.min.css'
import SignIn from './compts/SignIn';



function App() {
  return (
    <BrowserRouter>
       <Routes>
        <Route path='/' element={<Login/>}> </Route>
        <Route path='/signup' element={<Register/>}> </Route>

       </Routes>
    </BrowserRouter>

    // <Page1/>
  );
}

export default App;


