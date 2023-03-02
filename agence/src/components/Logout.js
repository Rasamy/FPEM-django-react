import {useEffect, useState} from "react"
import axios from "axios";

export const Logout = () => {
    useEffect(() => {
       (async () => {
           localStorage.clear();
           axios.defaults.headers.common['Authorization'] = null;
           window.location.href = '/login'
          
         })();
    }, []);
    return (
       <div></div>
     )
}
