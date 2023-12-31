import './static/App.css';
import './static/home-style.css';
import { Routes, Route } from 'react-router-dom';
import RequireAuth from './components/user-controlls/RequireAuth.';
import PersistLogin from './components/user-controlls/PersistLogin';
import Register from './components/user-controlls/Register';
import Login from './components/user-controlls/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import Unauthorized from './components/user-controlls/Unauthorized';
import Layout from './components/Layout';
import Resources from './components/resource-controlls/Resources';
import UpdateResource from './components/resource-controlls/UpdateResource';
import ViewCard from './components/ViewCard';
import CreateResource from './components/resource-controlls/CreateResource';
import Teams from './components/team-controlls/Teams';
import CreateUpdateTeam from './components/team-controlls/CreateUpdateTeam';
import ConfigSettings from './components/user-controlls/ConfigSettings';
import Menu from './components/Menu';
import NoPage from './components/NoPage';
import CreateType from './components/type-controlls/CreateType';
import UpdateType from './components/type-controlls/UpdateType';

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

            <Route path='/' element={<Menu />} >
                <Route path='/unauthorized' element={<Unauthorized />} />

                <Route element={<PersistLogin />}>
                    <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
                        <Route path='/' element={<Home />} />
                        <Route path='/resources' element={<Resources />} />
                        <Route path='/view' element={<ViewCard />} />
                        <Route path='/set-schedule' element={<ConfigSettings />} />
                        
                        <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Leader, ROLES.Member]} />}>
                            <Route path='/create' element={<CreateResource />} />
                            <Route path='/update' element={<UpdateResource />} />
                            <Route path='/create-type' element={<CreateType />} />
                            <Route path='/update-type' element={<UpdateType />} />
                        </Route>
                    </Route>
                </Route>

                <Route element={<PersistLogin />}>
                    <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                        <Route path='/teams' element={<Teams />} />
                        <Route path='/team-controll' element={<CreateUpdateTeam />} />
                    </Route>
                </Route>
            </Route>

            <Route path='*' element={<NoPage />} />
        </Route>
    </Routes>
  );
}

export default App;
