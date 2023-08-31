import './static/App.css';
import './static/home-style.css';
import { Routes, Route } from 'react-router-dom';
import RequireAuth from './components/authentication/RequireAuth.';
import PersistLogin from './components/authentication/PersistLogin';
import Register from './components/authentication/Register';
import Login from './components/authentication/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import Unauthorized from './components/authentication/Unauthorized';
import Layout from './components/Layout';
import Resources from './components/resource-controlls/Resources';
import UpdateName from './components/resource-controlls/UpdateName';
import ViewCard from './components/ViewCard';
import CreateResource from './components/resource-controlls/CreateResource';
import Teams from './components/team-controlls/Teams';
import CreateUpdateTeam from './components/team-controlls/CreateUpdateTeam';
import CreateUpdateType from './components/type-controlls/CreateUpdateType';
import Trial from './components/Trial';

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

        {/* <Route path='/' element={<Home />} />
        <Route path='/type-controll' element={<CreateUpdateType />} /> */}
        <Route path='/trial' element={<Trial />} />
        
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
            <Route path='/' element={<Home />} />
            <Route path='/resources' element={<Resources />} />
            <Route path='/view' element={<ViewCard />} />
          
            <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Leader, ROLES.Member]} />}>
              <Route path='/create' element={<CreateResource />} />
              <Route path='/update' element={<UpdateName />} />
              <Route path='/type-controll' element={<CreateUpdateType />} />
            </Route>
          </Route>
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path='/teams' element={<Teams />} />
          <Route path='/team-controll' element={<CreateUpdateTeam />} />
        </Route>

      </Route>
    </Routes>
  );
}

export default App;
