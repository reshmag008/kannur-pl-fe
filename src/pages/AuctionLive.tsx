import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { BACKEND_URL, TOTAL_PLAYER, roomId } from "../constants";
import PlayerService from "../services/PlayerService";
import bellGif from '../assets/bell.gif';
import congratsJif from '../assets/congratulations.gif';
import clapJif from '../assets/clap.gif'
import playerBg from '../assets/auction_live_card.jpeg'


const AuctionLive: React.FC = () => {

    const [socket, setSocket] = useState<any>(null);
    const [currentBidPlayer, setCurrentPlayer] = useState<any>({});
    const [currentBid, setCurrentBid] = useState<any>({});
    const [currentCall, setCurrentCall] = useState<any>({});
    const [soldPlayer, setSoldPlayer] = useState<any>({});
    const [allSoldPlayers, setAllSoldPlayer] = useState<any>([])
    const [popUpContent, setPopUpContent] = useState<any>({})
    const [openPopUp, setOpenPopUp] = useState(false);
    const [allTeams, setAllTeams] = useState<any>([])


    useEffect(() => {
        const newSocket = io(BACKEND_URL,{
            transports: ["polling", "websocket"],
            withCredentials: true,
            reconnection: true,
        });
        setSocket(newSocket);
        getSoldPlayers();
        GetAllTeams();
        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket) {

            socket.emit("join-room", roomId);

            socket.on("current_player", (data: any) => {
                console.log("Received in player diaplay:", data);
            });

            socket.on('current_bid', (message:any)=>{
                console.log("message== ", message);
                setCurrentBid(message)
            })

            // socket.join(roomId);
            socket.on("current_player", (message: any) => {
                console.log("current_player ---- ", message);
                setSoldPlayer({});
                setCurrentCall({})
                setCurrentPlayer(JSON.parse(message));
            });
            socket.on("team_call", (message: any) => {
                console.log("team_call ---- ", message);
                setSoldPlayer({});
                setCurrentCall(JSON.parse(message));
            });
            socket.on("player_sold", (message: any) => {
                console.log("player_sold ---- ", message);
                let player = JSON.parse(message)
                setSoldPlayer(player);
                setCurrentCall({})
                // toast.success(`${player.player_name} sold to ${player.team_name} for ${player.bid_amount}`)
                getSoldPlayers();
                GetAllTeams();
            });

            socket.on("team_complete", (message: any) => {
                setOpenPopUp(true);
                setPopUpContent(JSON.parse(message));
            })

            socket.on("close_popup", (message: any) => {
                setOpenPopUp(false);
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

    const capitalizeFirst = (str: any) => {
        if (!str) return "";
        str = str.toLowerCase();
        return str.charAt(0).toUpperCase() + str.slice(1);
    }



    const getSoldPlayers = () => {

        PlayerService().getSoldPlayers().then((response: any) => {
            setAllSoldPlayer(response?.data?.players);
        })
    }



    return (
        <div>
            <div >
                            {currentBidPlayer && currentBidPlayer.id && (
                                <div style={players__card__wrap}>
                                {/* <div style={cardHeader}> */}
                                  <div style={{display:'flex'}}>
                                    <img  src={`https://storage.googleapis.com/auction-players/${currentBidPlayer.profile_image}`} alt="logo" style={profileImageStyle}/>
                                  {/* <img src={BACKEND_URL + '/player_images/' + currentBidPlayer.profile_image} alt="logo" style={profileImageStyle} /> */}
            
                                </div>
            
                                    <div style={{ display: 'flex', textAlign: 'center', width: '41px', marginLeft: '117px' }}>
                                      <span style={idText}>{currentBidPlayer.id} </span>
                                    </div>
            
                                    <div style={{ display: 'flex', textAlign: 'center', width: '129px', marginLeft: '10px',marginTop:'-23px' }}>
                                      <span style={idText1}>{currentBidPlayer.fullname.toUpperCase()} </span>
                                    </div>
                                    
                                    <div style={{ display: "flex" ,marginLeft:'235px', marginTop:'-138px', width:'180px'}}>
                                        <span style={spanText}>{currentBidPlayer.player_role}</span>
                                    </div>
            
                                    <div style={{ display: "flex" ,marginLeft:'235px', marginTop:'0px', width:'780px'}}>
                                        <span
                                        style={spanText}
                                        >
                                        {currentBidPlayer.batting_style}
                                        </span>
                                    </div>
            
                                    <div style={{ display: "flex",marginLeft:'235px', marginTop:'0px', width:'780px' }}>
                                        <span
                                        style={spanText}
                                        >
                                        {currentBidPlayer.bowling_style}
                                        </span>
                                    </div>
            
                                    <div style={{display: 'flex', marginLeft:'235px', marginTop:'-2px', width:'780px'}}>
                                        <span style={spanText}> {capitalizeFirst(currentBidPlayer.location)}</span>
                                    </div>
            
            
                                    <div style={{ display: "flex",marginLeft:'203px', marginTop:'-1px', width:'780px' }}>
                                        <span style={spanText}>
                                        {currentBidPlayer.contact_no}
                                        </span>
                                    </div>
            
                                    
                                    
                                {/* </div> */}
                                <div style={cardFooter}></div>
                                </div>
                            )}
                        </div>

                        {currentCall && currentCall.team_name &&

                        <div style={{display:'flex', alignItems:'center'}}>
                            <img src={bellGif} alt="logo" style={bellGifStyle} />
                            <div>Current Bid : {currentCall.team_name} | Points : {currentCall.amount} </div>
                        </div>
                        }


                        {soldPlayer && soldPlayer.team_name &&
                            <div style={{display:'flex', alignItems:'center'}}>
                            <img src={bellGif} alt="logo" style={bellGifStyle} />
                            <div>Player Sold to {soldPlayer.team_name} for {soldPlayer.amount} points</div>
                        </div>
                        }


                        <div>
                                  {allSoldPlayers && allSoldPlayers.length>0 &&
                                      <div style={soldPlayerListStyle}>
                                          
                                          { allSoldPlayers.map((element:any, index:number) => (
                                              <div key={index} style={{display:'flex', padding:'10px'}} >
                                                <img  src={`https://storage.googleapis.com/auction-players/${element.profile_image}`} alt="logo" style={profileImageStyle1}/>
                                                      {/* <img
                                                      src={BACKEND_URL + '/player_images/' + element.profile_image}
                                                          alt="logo"
                                                          style={profileImageStyle1}
                                                      /> */}
                                                      <div style={{color:'black'}}>
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
                        
                        
                                              </div>
                                          ))}
                                      </div>
                                  }
                                  </div>

        </div>
    )
}


const teamCallStyle : React.CSSProperties = {
    display:'flex',
    justifyContent:'center',
    // marginLeft:'65px',
    padding:'10px'

}

const bellGifStyle: React.CSSProperties = {
  height: "2rem",
  width: "2rem",
  objectFit: "cover",
padding:'5px'
};



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
  backgroundImage: "linear-gradient(to bottom, purple, black)", // 👈 important
  WebkitBackgroundClip: "text",
  backgroundClip: "text", // 👈 add this for non-webkit browsers
  WebkitTextFillColor: "transparent",
  // marginTop: "65px",
  fontWeight: "bold",
  fontSize: "10px",
  // paddingLeft: "10px",
  // marginLeft : '30px',
  // color : 'darkblue',
  // width:'780px',
  // textAlign : 'center'
};

const idText: React.CSSProperties = {
   background: "linear-gradient(to bottom, purple, black)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  // marginTop: '-471px',
  fontWeight: 'bold',
  fontSize: '15px',
  // paddingLeft : '277px',
  color: "darkblue",
  width: "881px",
  height: "96px",
  // marginLeft : '-114px',
  marginTop : '-68px'
}

const idText1: React.CSSProperties = {
   background: "linear-gradient(to bottom, purple, black)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  // marginTop: '-471px',
  fontWeight: 'bold',
  fontSize: '14px',
  // paddingLeft : '277px',
  // color: "darkblue",
  width: "129px",
  height: "96px",
  // marginLeft : '-114px',

}


const fullNameText: React.CSSProperties = {
  marginTop: "10px",
  fontWeight: "bold",
  fontSize: "15px",
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
  height: "6rem",
  width: "6rem",
  // padding: "5px",
  // alignItems: "flex-start",
  // display: "grid",
  marginTop: "47px",
  objectFit: "cover",
  // boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  borderRadius: "4px",
  marginLeft: "16px",
  // filter: "grayscale(50%)",
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
  marginLeft: "180px",
  width : '324px',
  marginTop : '168px',
  height : '180px'
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
  backgroundColor:'black',
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
  backgroundColor:'white',
  border: "1px solid purple",
 boxShadow: "0 2px 4px rgba(0, 0, 0, 1.1)",
  borderRadius: "8px",
//   width:'30%',
  margin: '10px',
  // marginLeft: '-280px'
}

const allTeamStyle :  React.CSSProperties = {
  // display: "grid",
  // gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))",
  // border: "1px solid purple",
//  boxShadow: "0 2px 4px rgba(0, 0, 0, 1.1)",
  // borderRadius: "8px",
  width:'60%',
  marginTop:'-121px',
  marginLeft : '500px'
}

const teamCardContainer: React.CSSProperties = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "8px",
  width: "224px",
  margin: "20px auto",
  cursor: "pointer",
  borderBlockColor: 'green'
};


const teamStyle :  React.CSSProperties = {
 
  border: "1px solid purple",
//  boxShadow: "0px 2px 4px rgba(0, 0, 0, 1.1)",
  borderRadius: "8px",
  width:'316px',
  padding : "20px",
  // marginTop:'764px',
  // marginLeft : '-606px'
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
    players__card__wrap.marginTop = '0px';
    players__card__wrap.marginLeft = '0px';
    players__card__wrap.margin = '10px';
//   playerCountStyle.fontSize = "12px"; // Adjust font size for mobile view
//   playerCountStyle.padding = "10px";

//   playerListContainer.gridTemplateColumns =
//     "repeat(auto-fit, minmax(18rem, 1fr))";
//   playerListContainer.padding = "0rem";
//   displayMargin.marginTop = '0px';

//   soldPlayersStyle.gridTemplateColumns = '1fr';
//   imageStyle.height = "6rem";
//   imageStyle.width = "6rem";

//   playCardHeading.padding = '0px';
//   playCardHeading.marginTop = '5px';

//   profileImageStyle.height = "8rem";
//   profileImageStyle.width = "7rem";

//   players__card__wrap.marginLeft = 'max-content'
//   players__card__wrap.width = "100%"

//   teamCallStyle.width = '75%';

//   soldPlayerListStyle.width = '100%'



}


export default AuctionLive;
