import Footer from "./Footer";
import { Navigation } from "./Navigation";
import "../styles/styles.css"
import "../styles/admin.css"
export const Layout = (props) => {
    return (
        <div className="wrapper">

            <Navigation />
            
            <main role="main">
                <section className="panel-important">
                    {props.children}
                </section>

            </main>

            <Footer />
        
        </div>
    );  
}
  
  
