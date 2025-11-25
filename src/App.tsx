import React, { useEffect, useState } from 'react';
import './App.css';
import AppRouter from './AppRouter';



function App() {

  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.matchMedia("(max-width: 600px)").matches);
    }
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  
  return (
      <div style={isMobileView? {} : divStyle} >
        <AppRouter/>
      </div>
  );
}

const divStyle : React.CSSProperties = {
  // marginTop : '6rem',
  // marginBottom: '5rem',
}


export default App;
