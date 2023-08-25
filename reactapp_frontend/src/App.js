import './static/App.css';
import './static/home-style.css';
import { Routes, Route } from 'react-router-dom';
import RequireAuth from './components/RequireAuth.';
import PersistLogin from './components/PersistLogin';
import Register from './components/Register';
import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import Unauthorized from './components/Unauthorized';
import Layout from './components/Layout';
import Page2 from './compts/Page1';
import SignIn from './compts/SignIn';
import Resources from './components/Resources';
import NameGenerate from './components/NameGenerate';
import UpdateName from './components/UpdateName';
import ViewCard from './components/ViewCard';

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

        {/* <Route path='/' element={<Home />} /> */}
        
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
            <Route path='/' element={<Home />} />
            <Route path='/resources' element={<Resources />} />
            <Route path='/view' element={<ViewCard />} />
          
            <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Leader, ROLES.Member]} />}>
              <Route path='/generate' element={<NameGenerate />} />
              <Route path='/update' element={<UpdateName />} />
            </Route>
          </Route>
        </Route>
      </Route>

      <Route path='/Page2' element={<Page2 />} />
      <Route path='/SignIn' element={<SignIn />} />

    </Routes>
  );
}

export default App;
