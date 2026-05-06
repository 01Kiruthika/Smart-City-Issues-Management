import Header from "./components/Header.jsx";
import Aside from "./components/Aside.jsx";
import Main from "./components/Main.jsx";
import Footer from "./components/Footer.jsx";
import './App.css'

const Dashboardlayout = () => {
    return (
        <>
            <div className="Container">  
                <Header />
                <Aside />
                <Main />
                <Footer />
            </div>
        </>
    );
};

export default Dashboardlayout;