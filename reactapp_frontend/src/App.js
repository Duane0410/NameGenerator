import './static/App.css';
import Page1 from './components/Page1';
import { Routes, Route } from 'react-router-dom';
import RequireAuth from './components/RequireAuth.';
import PersistLogin from './components/PersistLogin';
import Register from './components/Register';
import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import Unauthorized from './components/Unauthorized';
import Layout from './components/Layout';

const ROLES = {
  "Admin": 5001,
  "Leader": 4001,
  "Member": 2001,
  "User": 1001
}

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/unauthorized' element={<Unauthorized />} />
        
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
            <Route path='/' element={<Home />} />
            <Route path='/page1' element={<Page1 />} />
          </Route>
        </Route>

      </Route>
    </Routes>
  );
}

export default App;
