import React from 'react';
import banner from '../assets/banner.jpeg'
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';


const Home: React.FC = () => {
    const navigate = useNavigate();
    return (
        <>
         <Header />
        <img style={imageStyle} src={banner} alt="Logo"  onClick={() => navigate("/player-list")} />
         <Footer/>
        </>
    )
}

const imageStyle : React.CSSProperties = {
    objectFit:'cover',
    width : '100%'
}

const isMobile = window.matchMedia("(max-width: 600px)").matches;
    if (isMobile) {
        imageStyle.marginTop = '75px'
    }



export default Home;
