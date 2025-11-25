import React, {  useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { BACKEND_URL, TOTAL_PLAYER } from "../constants";
import playerSvg from "../assets/account-icon.png";
import battingSvg from "../assets/batter.png";
import ballingSvg from "../assets/tennisBall.jpg";
import logo from "../assets/icon.jpeg";
import no5 from '../assets/n05-icon.jpeg'
import PlayerService from "../services/PlayerService";
import bellGif from '../assets/bell.gif';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import congratsJif from '../assets/congratulations.gif';
import clapJif from '../assets/clap.gif'
import playerBg from '../assets/player_display.jpeg'


const PlayerDisplay: React.FC = () => {
  const [socket, setSocket] = useState<any>(null);
  const [currentBidPlayer, setCurrentPlayer] = useState<any>({});
  const [currentCall, setCurrentCall] = useState<any>({});
  const [soldPlayer, setSoldPlayer] = useState<any>({});
  const [allSoldPlayers, setAllSoldPlayer] = useState<any>([])
  const [popUpContent, setPopUpContent] = useState<any>({})
  const [openPopUp, setOpenPopUp] = useState(false);
  const [allTeams, setAllTeams] = useState<any>([])

  const isMobile = window.matchMedia("(max-width: 600px)").matches;



  useEffect(() => {
    const newSocket = io(BACKEND_URL);
    setSocket(newSocket);
    getSoldPlayers();
    GetAllTeams();
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("current_player", (message: any) => {
        console.log("current_player ---- ", message);
        setCurrentPlayer(JSON.parse(message));
      });
      socket.on("team_call", (message: any) => {
        console.log("team_call ---- ", message);
        setCurrentCall(JSON.parse(message));
      });
      socket.on("player_sold", (message: any) => {
        console.log("player_sold ---- ", message);
        let player = JSON.parse(message)
        setSoldPlayer(player);
        setCurrentCall({})
        toast.success(`${player.player_name} sold to ${player.team_name} for ${player.bid_amount}`)
        getSoldPlayers();
        GetAllTeams();
      });
      
      socket.on("team_complete", (message: any) => {
        setOpenPopUp(true);
        setPopUpContent(JSON.parse(message));
      })
      
      
    }
  }, [socket]);

  const GetAllTeams = () => {
    try {
      PlayerService()
        .getAllTeams()
        .then((response: any) => {
          setAllTeams(response?.data);
        });
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };



  const getSoldPlayers = () =>{

    PlayerService().getSoldPlayers().then((response:any)=>{
        setAllSoldPlayer(response?.data?.players);
    })
  }

  return (
    
    <div style={displayMargin}>

<ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark" />

{openPopUp && 
        <div style={overlay}>
            <div style={popUpStyle} >
                <div style={{textAlign:'right',marginTop:'-25px', marginRight:'-30px'}}>
                    <button style={closeButtonStyle} onClick={()=>setOpenPopUp(!openPopUp) }>X</button>
                </div>

                

                <div style={{display:'flex',justifyContent:'center'}}>
                    <img 
                    src={BACKEND_URL + '/team_images/' + popUpContent.team_logo}
                    alt="logo" style={{width: "6rem",
                        height: "6rem",
                        borderRadius: "8px",}} />
                    <span style={{ padding: "10px", 
                        fontWeight:'bold',
                        fontSize:'38px',
                        fontFamily: 'Georgia, serif' 
                    }}>{popUpContent.team_name}</span>
                    
                </div>
                <div style={{display:'flex',justifyContent:'center'}}>
                  <span>Completed Auction</span>
                </div>
                <div style={{display:'flex',justifyContent:'center'}}>
                  <img src={clapJif} alt="logo" style={{  height: "8rem",width: "8rem",padding: "10px",}} />
                </div>

            </div>
            </div>
        }


        
        {/* <div style={{display:'flex', justifyContent:'flex-end', padding:'10px'}}>
            <span style={{
                marginTop: '10px',
                padding: '10px',
                fontFamily: 'cursive',
                fontStyle: 'italic',
                fontSize: 'larger'
            }}>Auction Powered By : </span>
            <img src={no5} alt="logo" style={{width: "8rem",height: "4rem",borderRadius: "50px"}} />
        </div> */}
        
       
        <div style={soldPlayersStyle}>

        {!isMobile && 
          <div>
            {allTeams && allTeams.length>0 &&
              <div style={allTeamStyle}>
                  
                  { allTeams.map((element:any, index:number) => (
                      <div key={index} style={{display:'flex', padding:'10px'}} >
                          {/* <div > */}
                              <img
                              src={BACKEND_URL + '/player_images/' + element.team_logo}
                                  
                                  alt="logo"
                                  style={profileImageStyle1}
                              />
                              <div style={{color:'purple'}}>
                                  <div >
                                      <span style={fullNameText}>{element.team_name.toUpperCase()}</span>
                                  </div>
                                  <div >
                                      <span style={fullNameText}>Total Points : {element.total_points}</span>
                                  </div>
                                  <div >
                                      <span style={fullNameText}>Max Bid Amount : {element.max_bid_amount}</span>
                                  </div>
                                  <div >
                                      <span style={fullNameText}>Player Count : {element.player_count}/{TOTAL_PLAYER}</span>
                                  </div>
                              </div>

                          {/* </div> */}

                      </div>
                  ))}
              </div>
          }
          </div>
          }

            <div >
                {/* { currentCall && Object.keys(currentCall).length>0 && (
                    <div style={teamCallStyle}>
                        <div style={{border: "1px solid purple",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 1.1)",
                                borderRadius: "8px",color:'green',paddingLeft:'10px', paddingRight:'10px',display:'flex',height:'100px',
                                marginLeft:'100px'}}>
                            
                            <img
                                src={bellGif}
                                alt="logo"
                                style={profileImageStyle1}
                            />
                            <h2> Current Bid {currentCall.amount} by {currentCall.team_name} </h2>
                        </div>
                    
                    </div>
                )} */}
                {currentBidPlayer && currentBidPlayer.id && (
                    <div style={players__card__wrap}>
                    <div style={cardHeader}>
                        
                        <img src={BACKEND_URL + '/player_images/' + currentBidPlayer.profile_image} alt="logo" style={profileImageStyle} />
                        <div style={cardBodyTextStyle}>
                        <div style={{ display: "flex" }}>
                            <span style={fullNameText}>{currentBidPlayer.fullname}</span>
                        </div>

                        <div style={{ display: "flex" }}>
                            <span style={spanText}> Reg#:{currentBidPlayer.id}</span>
                        </div>

                        <div style={{ display: "flex" }}>
                            <span style={spanText}> {currentBidPlayer.location}</span>
                        </div>

                        <div style={{ display: "flex" }}>
                            <span
                            style={{
                                marginTop: "10px",
                                fontWeight: "bold",
                                fontSize: "16px",
                            }}
                            >
                            {currentBidPlayer.player_role}
                            </span>
                        </div>

                        <div style={{ display: "flex" }}>
                            <span
                            style={{
                                marginTop: "10px",
                                fontWeight: "bold",
                                fontSize: "16px",
                            }}
                            >
                            {currentBidPlayer.batting_style}
                            </span>
                        </div>

                        <div style={{ display: "flex" }}>
                            <span
                            style={{
                                marginTop: "10px",
                                fontWeight: "bold",
                                fontSize: "16px",
                            }}
                            >
                            {currentBidPlayer.bowling_style}
                            </span>
                        </div>

                        <div style={{ display: "flex" }}>
                            <span style={spanText}>
                            Contact : {currentBidPlayer.contact_no}
                            </span>
                        </div>

                        
                        </div>
                    </div>
                    <div style={cardFooter}></div>
                    </div>
                )}
            </div>



          {allSoldPlayers && allSoldPlayers.length>0 &&
              <div style={soldPlayerListStyle}>
                  
                  { allSoldPlayers.map((element:any, index:number) => (
                      <div key={index} style={{display:'flex', padding:'10px'}} >
                          {/* <div > */}
                              <img
                              src={BACKEND_URL + '/player_images/' + element.profile_image}
                                  alt="logo"
                                  style={profileImageStyle1}
                              />
                              <div style={{color:'purple'}}>
                                  <div >
                                      <span style={fullNameText}>{element.id}.{element.fullname.toUpperCase()}</span>
                                  </div>
                                  <div >
                                      <span style={fullNameText}>{element.player_role}</span>
                                  </div>
                                  <div >
                                      <span style={fullNameText}>Team : {element.team_id}</span>
                                  </div>
                                  <div >
                                      <span style={fullNameText}>Points : {element.bid_amount}</span>
                                  </div>
                              </div>

                          {/* </div> */}

                      </div>
                  ))}
              </div>
          }
           
        </div>




    </div>
  );
};


const teamCallStyle : React.CSSProperties = {
    display:'flex',
    justifyContent:'center',
    // marginLeft:'65px',
    padding:'10px'

}

const imageStyle: React.CSSProperties = {
  height: "7rem",
  width: "7rem",
//   objectFit: "cover",
padding:'10px'
};

const playerListContainer: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(26rem, 1fr))",
  gap: "2rem",
  maxWidth: "120rem",
  margin: "0 auto",
  padding: "2rem",
};

const cardHeaderTextStyle: React.CSSProperties = {
  gap: "2rem",
  cursor: "pointer",
  color: "white",
  textAlign: "left",
  fontSize: "30px",
  textShadow: "1px 1px 0 #999, 2px 2px 0 #999, 3px 3px 0 #999",
};

const cardBodyTextStyle: React.CSSProperties = {
  color: "white",
  textAlign: "left",
  fontSize: "26px",
};

const imageStyle1: React.CSSProperties = {
  height: "7rem",
  width: "7rem",
  padding: "10px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "none",
};

const spanText: React.CSSProperties = {
  marginTop: "8px",
  fontWeight: "bold",
  fontSize: "16px",
  paddingLeft: "10px",
};

const fullNameText: React.CSSProperties = {
  marginTop: "10px",
  fontWeight: "bold",
  fontSize: "20px",
  paddingLeft: "10px",
};

const svgStyle: React.CSSProperties = {
  height: "1rem",
  width: "1rem",
  objectFit: "cover",
  padding: "10px",
  filter:
    "invert(85%) sepia(20%) saturate(150%) hue-rotate(200deg) brightness(120%) contrast(120%)",
};

const profileImageStyle: React.CSSProperties = {
  height: "19rem",
  width: "15rem",
  padding: "5px",
  alignItems: "flex-start",
  display: "grid",
  marginTop: "-10px",
  objectFit: "cover",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  borderRadius: "15px",
  marginLeft: "7px",
  filter: "grayscale(50%)",
  //   border: "5px solid transparent",
};

const profileImageStyle1: React.CSSProperties = {
    height: "5rem",
    width: "5rem",
    padding: "5px",
    alignItems: "flex-start",
    display: "grid",
    // marginTop: "-10px",
    objectFit: "cover",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    // borderRadius: "50px",
    marginTop: "7px",
    filter: "grayscale(50%)",
    //   border: "5px solid transparent",
  };


const players__card__wrap: React.CSSProperties = {
  // width: "57%",
  gap: "2rem",
  // backgroundImage: "linear-gradient(to top,  #000033 , #800080)",
  backgroundImage : `url(${playerBg})`,
  border: "1px solid #ccc",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
//   margin: "0/ auto",
  marginLeft: "299px",
};

const cardHeader: React.CSSProperties = {
  display: "flex",
};

const cardFooter: React.CSSProperties = {
  display: "flex",
  backgroundColor: "purple",
  marginBottom: "10px",
};

const playerCountStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const displayMargin : React.CSSProperties = {
    marginTop : '-150px',
    padding:'10px'
}

const soldPlayersStyle : React.CSSProperties = {
  display:'grid',
  gridTemplateColumns: '20% 50% 30%',
  gap: '2rem'
}

const playCardHeading : React.CSSProperties = {
    fontSize: "30px",
    fontFamily: "auto",
    marginTop: "20px",
    textAlign: "center",
    padding:'10px'
}

const soldPlayerListStyle : React.CSSProperties = {
  border: "1px solid purple",
 boxShadow: "0 2px 4px rgba(0, 0, 0, 1.1)",
  borderRadius: "8px",
  width:'29%',
  marginTop: '48px',
  marginLeft: '-540px'
}

const allTeamStyle :  React.CSSProperties = {
  border: "1px solid purple",
 boxShadow: "0 2px 4px rgba(0, 0, 0, 1.1)",
  borderRadius: "8px",
  width:'150%',
  marginTop:'48px'
}

const popUpStyle: React.CSSProperties = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
};

const closeButtonStyle :  React.CSSProperties = {
  backgroundColor: 'red' ,
  color: 'white',
  padding: '5px 15px',
  borderRadius: '60%',
  outline: '0',
  border: '0',
  textTransform: 'uppercase',
  cursor: 'pointer'
}


const overlay : React.CSSProperties={
  position: 'fixed',
top: '0',
left: "0",
width: "100%",
height:" 100%",
backgroundColor: 'rgba(18, 15, 17, 0.85)', /* Semi-transparent black */
zIndex: '1000'
}

const jifStyle : React.CSSProperties = {
height: "8rem",
width: "20rem",
padding: "10px",

}

const isMobile = window.matchMedia("(max-width: 600px)").matches;
if (isMobile) {
  playerCountStyle.fontSize = "12px"; // Adjust font size for mobile view
  playerCountStyle.padding = "10px";

  playerListContainer.gridTemplateColumns =
    "repeat(auto-fit, minmax(18rem, 1fr))";
  playerListContainer.padding = "0rem";
  displayMargin.marginTop = '0px';

  soldPlayersStyle.gridTemplateColumns = '1fr';
  imageStyle.height = "6rem";
  imageStyle.width = "6rem";

  playCardHeading.padding = '0px';
  playCardHeading.marginTop = '5px';

  profileImageStyle.height = "8rem";
  profileImageStyle.width = "7rem";

  players__card__wrap.marginLeft = 'max-content'
  players__card__wrap.width = "100%"

  teamCallStyle.width = '75%';

  soldPlayerListStyle.width = '100%'



}

export default PlayerDisplay;
