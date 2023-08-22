import './static/App.css';
import Page1 from './components/Page1'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import 'bootstrap/dist/css/bootstrap.min.css'
import Home from './components/Home'



function App() {
  return (
    <Router>
       <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/signup' element={<Register/>} />
        <Route path='/home' element={<Home />} />
        <Route path='/page1' element={<Page1 />} />

       </Routes>
    </Router>

    // <Page1/>
  );
}

export default App;
