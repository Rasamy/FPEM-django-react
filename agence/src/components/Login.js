// Import the react JS packages 
import axios from "axios";
import {useState} from "react";
import { API_URL } from "../constants/constants";
import "../styles/login.css";

// Define the Login function.
export const Login = () => {
     const [username, setUsername] = useState('');
     const [password, setPassword] = useState('');
     // Create the submit method.
     const submit = async e => {
          e.preventDefault();
          const user = {
                username: username,
                password: password
               };
          // Create the POST requuest
          const {data} = await axios.post( API_URL+ 'token/',user ,{headers: {'Content-Type': 'application/json'}});

         // Initialize the access & refresh token in localstorage.      
         localStorage.clear();
         localStorage.setItem('access_token', data.access);
         localStorage.setItem('refresh_token', data.refresh);

         const data_user = await axios.get(   
            API_URL + 'token/user/', {
            headers: {
                Authorization: `Bearer ${data.access}`
                }}
            );
        localStorage.setItem("user",JSON.stringify(data_user.data));
        
         axios.defaults.headers.common['Authorization'] = 
                                         `Bearer ${data['access']}`;
        
         window.location.href = '/'
    }
    return(
       
    <div className="container">
        <div className="row">
            <div className="col-lg-3 col-md-2"></div>
            <div className="col-lg-6 col-md-8 login-box">
                <div className="col-lg-12 login-key">
                    <i className="fa fa-key" aria-hidden="true"></i>
                </div>
                <div className="col-lg-12 login-title">
                    ADMIN PANEL
                </div>

                <div className="col-lg-12 login-form">
                    <div className="col-lg-12 login-form">
                        <form onSubmit={submit}>
                            <div className="form-group">
                                <label className="form-control-label">USERNAME</label>
                                <input type="text" className="form-control" value={username} onChange={e => setUsername(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-control-label">PASSWORD</label>
                                <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
                            </div>

                            <div className="col-lg-12 loginbttm">
                                <div className="col-lg-6 login-btm login-text">
                                </div>
                                <div className="col-lg-6 login-btm login-button">
                                    <button type="submit" className="btn btn-outline-primary">Se connecter</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-lg-3 col-md-2"></div>
            </div>
        </div>
      </div>
   
     )
}