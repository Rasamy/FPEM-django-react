import {useEffect, useState} from "react";
import axios from "axios";
import { API_URL } from "../constants/constants";
import { Layout } from "../components/Layout";
import "../styles/compte.css";

export const Compte = () => {
 
     const [compte, setCompte] = useState(null);
     useEffect(() => {
        if(localStorage.getItem('access_token') === null){                   
            window.location.href = '/login'
        }
        else{
         (async () => {
          
           try {
            const token = localStorage.getItem('access_token')
      
            const user = localStorage.getItem("user");
            setCompte(JSON.parse(user));
          } catch (e) {
            console.log('not auth'+ e)
          }
         })()};
     }, []);
    
     return (
        <Layout>
            <div className="compte container mt-5">
    
              <div className="row d-flex justify-content-center">
                  
                  <div className="col-md-7">
                      
                      <div className="card p-3 py-4">
                          
                          <div className="text-center">
                              <img src="https://i.imgur.com/bDLhJiP.jpg" alt="ph" width="100" className="rounded-circle" />
                          </div>
                          
                          <div className="text-center mt-3">
                              <span className="bg-secondary p-1 px-4 rounded text-white">{compte?.username }</span>
                              <h5 className="mt-2 mb-0">{compte?.first_name} {compte?.last_name}</h5>
                              <span>Modérateur</span>
                              
                              {/* <div className="px-4 mt-1">
                                  <p className="fonts"></p>
                              
                              </div> */}
                              
                              <ul className="social-list">
                                  <li><i className="fa fa-facebook"></i></li>
                                  <li><i className="fa fa-dribbble"></i></li>
                                  <li><i className="fa fa-instagram"></i></li>
                                  <li><i className="fa fa-linkedin"></i></li>
                                  <li><i className="fa fa-google"></i></li>
                              </ul>
                              
                              <div className="buttons">
                                  
                                  <button className="btn btn-outline-primary px-4">Message</button>
                                  <button className="btn btn-primary px-4 ms-3">Contact</button>
                              </div>
                              
                              
                          </div>
                          
                        
                          
                          
                      </div>
                      
                  </div>
                  
              </div>
              
          </div>

        </Layout>
     )
}