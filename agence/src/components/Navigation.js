import { NavLink } from "react-router-dom";
import React, { useState, useEffect} from 'react';

export function Navigation() {
   const [isAuth, setIsAuth] = useState(false);



    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (token !== null || token !== undefined) {
            setIsAuth(true);
        }
        }, [isAuth]);

    const navs = [
        {
            path:"/",
            name: "Accueil",
            icon: "home"
        },
        {
            path:"/compte",
            name: "Mon compte",
            icon: "more"
        },
        {
            path:"/famille",
            name: "Famille",
            icon: "profile"
        },
        {
            path:"/login",
            name: "Login",
            icon: "profile_round"
        },
    ]
    const navAuth = [
        {
            path:"/",
            name: "Accueil",
            icon: "home"
        },
        {
            path:"/compte",
            name: "Mon compte",
            icon: "more"
        },
        {
            path:"/baptheme",
            name: "Baptheme",
            icon: "profile"
        },
        {
            path:"/famille",
            name: "Famille",
            icon: "profile"
        },
        {
            path:"/logout",
            name: "Logout",
            icon: "profile_round"
        },
    ]
     return ( 
        
        <>            
            <header role="banner">
            <h1>Admin Panel</h1>
                <ul className="utilities">
                    <br />
                    <li className="users">
                        <NavLink exact to="/compte">
                            Mon Compte
                        </NavLink>
                    </li>
                    <li className="logout warn">
                        <NavLink exact to="/logout">
                            Se déconnecter
                        </NavLink>
                    </li>
                </ul>
            </header>

            <nav role='navigation'>
            <ul className="main">

                {
                    isAuth && 
                    navAuth.map((item) => (
                        <li>
                            <NavLink exact to={item.path.toString()}>
                                {item.name}
                            </NavLink>
                        </li>
                    ))

                }
               
       
            </ul>
            </nav>

        </>



     );
}


