// Import the react JS packages
import {useEffect, useState} from "react";
import axios from "axios";
import { API_URL } from "../constants/constants";
import { Layout } from "./Layout";
// Define the Login function.
export const Home = () => {
     const [message, setMessage] = useState('');
     useEffect(() => {
        if(localStorage.getItem('access_token') === null){                   
            window.location.href = '/login'
        }
        else{
         (async () => {
           try {
            const token = localStorage.getItem('access_token')
             const {data} = await axios.get(   
                            API_URL + 'eglise/', {
                            headers: {
                                Authorization: `Bearer ${token}`
                                }}
                           );
             setMessage(data.message);
          } catch (e) {
            console.log('not auth'+ e)
          }
         })()};
     }, []);
     return (
        <Layout>
        <div className="form-signin mt-5 text-center">
          
        </div>
        </Layout>
     )
}