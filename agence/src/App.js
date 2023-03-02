import 'bootstrap/dist/css/bootstrap.min.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";     
    
//core
import "primereact/resources/primereact.min.css";

//icons
import "primeicons/primeicons.css"; 
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {Login} from "./components/Login";
import {Home} from "./components/Home";
import {Logout} from './components/Logout';
import { About } from './pages/About';
import {PersonneList} from './components/PersonneList'
import { Famille } from './components/Famille';
import { Bapteme } from './pages/bapteme';
function App() {

    return(
      <Router>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/logout" element={<Logout/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/personne" element={<PersonneList/>}/>
          <Route path="/famille" element={<Famille/>}/>
          <Route path="/baptheme" element={<Bapteme/>}/>
        </Routes>
      </Router>
    )
}
export default App;
