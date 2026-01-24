import React, { useEffect, useRef, useState } from 'react';
import PlayerService from '../services/PlayerService';
import { usePDF } from 'react-to-pdf';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from "react-js-loader";
import TeamService from '../services/TeamService';
import playerPhoto from '../assets/playerPhoto.png'
import playerBg from '../assets/playerBg.jpeg'
import { BACKEND_URL } from '../constants';
import PDFCreator from './PDFCreator';
import InfiniteScroll from "react-infinite-scroll-component";
import SoldPng from '../assets/sold.png';
import ktcaLogo from '../assets/ktca_logo.png';
import bklogo from '../assets/bk_logo.jpeg'




const PlayerList: React.FC = () => {



const ref = useRef();
    const [isLoading, setIsLoading] = useState(false)
    const [players, setPlayers] = useState<any>([]);
    const [soldCount, setSoldCount] = useState(0);
    const [unSoldCount, setUnSoldCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const { toPDF, targetRef } = usePDF({filename: 'kbs_players.pdf'});
    const [selectedTeamId, setSelectedTeamId] = useState('')
    const [allTeams, setAllTeams] = useState<any>();
    const [offset, setOffset] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
        const [selectedTeamName, setSelectedTeamName] = useState('')


    const [items, setItems] = useState<any>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const calledRef = useRef(false);


useEffect(() => {
  if (selectedTeamId) {
    setSelectedTeamId(selectedTeamId)
    console.log("Team selected:", selectedTeamId);
    GetAllPlayers();
  }
}, [selectedTeamId]);


    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 600);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);





    useEffect(()=>{
        if (calledRef.current) return;
  calledRef.current = true;
        GetAllPlayers();
        GetAllTeams();
        setPlayers([]);
    },[])

    const GetAllTeams = () =>{
        TeamService().getAllTeams().then((response:any)=>{
            setAllTeams(response?.data)
        })
    }
   const GetAllPlayers = async () => {
    setPlayers([]);
        setIsLoading(true);
        try {
            let teamId = selectedTeamId;
            console.log("teamId==GetAllPlayers ",teamId)
            let params = {
                offset : page,
                teamId : teamId
            }
            PlayerService().getAllPlayers(params).then((response:any)=>{
                setIsLoading(false);
                // setPlayers(response?.data?.players);
                
                let playerList = response?.data?.players;
                
                setSoldCount(response?.data?.soldPlayerCount);
                setUnSoldCount(response?.data?.unSoldPlayerCount);
                setPendingCount(response?.data?.pendingPlayerCount);
                if (playerList && playerList.length === 0) {
                setHasMore(false);
                return;
                }
                if(playerList && playerList.length > 0){
                setItems((prev:any) => [...prev, ...playerList]);
                setPlayers((prev:any) => [...prev, ...playerList]);
                setPage(prev => prev + 10);
                if(params.teamId){
                    setHasMore(false);
                }
                }

            })
        } catch (error) {
            setIsLoading(false);
            console.error('Error fetching players:', error);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) =>{
        console.log("selectedItem-- ", event.target.value);
        setSelectedTeamId(event.target.value);
        allTeams.forEach((element:any) => {
            if(element.id ==  event.target.value){
                console.log("elem== ", element.team_name)
            setSelectedTeamName(element.team_name)
            }
            
        });
        
        

    }

    const downloadPdf = () =>{
        const pdfUrl = "Sample.pdf";
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = "document.pdf"; // specify the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const getPreviousPlayers = () =>{
        setOffset((prevOffset) => prevOffset - 4);

    }

    const getNextPlayers = () =>{
        setOffset((prevOffset) => prevOffset - 4);

    }

    const capitalizeFirst = (str: any) => {
    if (!str) return "";
    str = str.toLowerCase();
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  

return (

  

    <div style={{ backgroundColor: "#0f2f45" }}>

      <div style={{display:'flex'}}>
        <Header/>
        </div>

        {isLoading && <Loader type="spinner-cub" bgColor={'#194564'} color={'white'} title={"Loading Players..."} size={50} /> }

    {/* <div style={topBarStyle}>
      {isLoading && (
        <Loader
          type="spinner-cub"
          bgColor="#194564"
          color="white"
          title="Loading Players..."
          size={40}
        />
      )}


      <span style={statsStyle}>
        Total Players: {players?.length || 0} |
        Unsold: {unSoldCount} |
        Sold: {soldCount} |
        Pending: {pendingCount}
      </span>

      <select
        style={selectStyle}
        value={selectedTeamId}
        onChange={handleChange}
      >
        <option value="">-- Select Team --</option>
        {allTeams?.map((team: any) => (
          <option key={team.id} value={team.id}>
            {team.team_name}
          </option>
        ))}
      </select>

      <PDFCreator playerList={players} />
    </div> */}
            {players.map((player:any, index:number) => (
            <div style={containerStyle}>
            <img
                src={playerBg}
                alt="Kannur Premier League 2026 Poster"
                style={imageStyle}
            />

            <img
                src={ktcaLogo}
                alt="KTCA Logo"
                style={ktcalogoStyle}
            />


             <img
            src={`https://storage.googleapis.com/auction-players/${player.profile_image}`}
            alt="Team Logo"
            style={overlayImageStyle}
        />

             <div style={idOverlayStyle}>
                {player.id}
            </div>

            

            <div style={roleOverlayStyle}>
                {player.player_role}
            </div>

            <div style={battingOverlayStyle}>
                {player.batting_style}
            </div>

            <div style={bowlingOverlayStyle}>
                {player.bowling_style}
            </div>

            <div style={locationOverlayStyle}>
                {capitalizeFirst(player.location)}
            </div>

            <div style={contactOverlayStyle}>
                {player.contact_no}
            </div>

            <div style={nameOverlayStyle}>
                {player.fullname.toUpperCase()}
            </div>

            <img
                src={bklogo}
                alt="BK Logo"
                style={bklogoStyle}
            />

           


            </div>
            ))}

    </div>
  );
};

const topBarStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  backgroundColor: "#0f2f45",
  color: "white",
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "12px",
  position: "sticky",
  top: 0,
  zIndex: 1000,
};

const statsStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 500,
};

const selectStyle: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: "6px",
  border: "none",
  outline: "none",
};

const buttonStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
};


const containerStyle: React.CSSProperties = {
  position: "relative",      // REQUIRED for overlay
  width: "100%",
  maxWidth: "420px",
  margin: "20px auto",
};

const imageStyle: React.CSSProperties = {
  width: "100%",
  height: "auto",
  display: "block",
  borderRadius: "12px",
};


const idOverlayStyle: React.CSSProperties = {
  position: "absolute",                 // REQUIRED
  bottom: "37%",                        // relative to image height
  left: "51%",
  transform: "translateX(-50%)",
  color: "white",
  fontWeight: 700,
  fontSize: "clamp(14px, 7vw, 34px)",   // responsive font
  textAlign: "center",
  padding: "6px 14px",
  borderRadius: "20px",
  maxWidth: "90%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  zIndex: 2,
  width : '49px'
};

const nameOverlayStyle: React.CSSProperties = {
  position: "absolute",                 // REQUIRED
  bottom: "5%",                        // relative to image height
  left: "70%",
  transform: "translateX(-50%)",
  color: "white",
  fontWeight: 700,
  fontSize: "clamp(11px, 1.3vw, 30px)",   // responsive font
  textAlign: "center",
  padding: "6px 14px",
  borderRadius: "20px",
  maxWidth: "90%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  zIndex: 2,
  width : '251px'
};

const roleOverlayStyle: React.CSSProperties = {
  position: "absolute",                 // REQUIRED
  bottom: "27%",                        // relative to image height
  left: "86%",
  transform: "translateX(-50%)",
  color: "#006D5B",
  fontWeight: 'bolder',
  fontSize: "clamp(16px, 0vw, 30px)",   // responsive font
  textAlign: "left",
  // padding: "6px 14px",
  // borderRadius: "20px",
  maxWidth: "90%",
  whiteSpace: "nowrap",
  // overflow: "hidden",
  // textOverflow: "ellipsis",
  zIndex: 2,
  width : '99px'
};


const battingOverlayStyle: React.CSSProperties = {
  position: "absolute",                 // REQUIRED
  bottom: "23%",                        // relative to image height
  left: "86%",
  transform: "translateX(-50%)",
  color: "#006D5B",
  fontWeight: 'bolder',
  fontSize: "clamp(16px, 0vw, 30px)",   // responsive font
  textAlign: "left",
  // padding: "6px 14px",
  // borderRadius: "20px",
  maxWidth: "90%",
  whiteSpace: "nowrap",
  // overflow: "hidden",
  // textOverflow: "ellipsis",
  zIndex: 2,
  width : '99px'
};


const bowlingOverlayStyle: React.CSSProperties = {
  position: "absolute",                 // REQUIRED
  bottom: "19%",                        // relative to image height
  left: "86%",
  transform: "translateX(-50%)",
  color: "#006D5B",
  fontWeight: 'bolder',
  fontSize: "clamp(16px, 0vw, 30px)",   // responsive font
  textAlign: "left",
  // padding: "6px 14px",
  // borderRadius: "20px",
  maxWidth: "90%",
  whiteSpace: "nowrap",
  // overflow: "hidden",
  // textOverflow: "ellipsis",
  zIndex: 2,
  width : '99px'
};

const locationOverlayStyle: React.CSSProperties = {
  position: "absolute",                 // REQUIRED
  bottom: "15.5%",                        // relative to image height
  left: "86%",
  transform: "translateX(-50%)",
  color: "#006D5B",
  fontWeight: 'bolder',
  fontSize: "clamp(14px, 0vw, 30px)",   // responsive font
  textAlign: "left",
  // padding: "6px 14px",
  // borderRadius: "20px",
  maxWidth: "90%",
  whiteSpace: "nowrap",
  // overflow: "hidden",
  // textOverflow: "ellipsis",
  zIndex: 2,
  width : '100px'
};



const contactOverlayStyle: React.CSSProperties = {
  position: "absolute",                 // REQUIRED
  bottom: "10%",                        // relative to image height
  left: "74%",
  transform: "translateX(-50%)",
  color: "#006D5B",
  fontWeight: 700,
  fontSize: "clamp(16px, 0vw, 30px)",   // responsive font
  textAlign: "left",
  padding: "6px 14px",
  borderRadius: "20px",
  maxWidth: "90%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  zIndex: 2,
  width : '110px'
};

// const overlayImageStyle: React.CSSProperties = {
//   position: "absolute",
//   top: "12%",
//   left: "50.5%",
//   transform: "translateX(-50%)",
//   width: "clamp(90px, 34vw, 251px)",
//   height: "auto",
//   aspectRatio: "127 / 173",
//   objectFit: "cover",
//   backgroundColor: "white",
//   borderRadius: "12px",
//   zIndex: 2,

//   // enhancements
//   boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
//   border: "2px solid rgba(255,255,255,0.8)",
//   transition: "transform 0.3s ease, box-shadow 0.3s ease",
// };

const overlayImageStyle: React.CSSProperties = {
  position: "absolute",
  top: "60.3%",
  left: "24%",
  transform: "translate(-50%, 0)",

  width: "clamp(90px, 59vw, 136px)",
  aspectRatio: "127 / 173",
  objectFit: "cover",

  backgroundColor: "white",
  borderRadius: "23px",
  zIndex: 2,

  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  border: "2px solid rgba(255,255,255,0.8)",
};


const ktcalogoStyle : React.CSSProperties = {
  position: "absolute",
  top: "2.5%",
  left: "89.5%",
  transform: "translateX(-50%)",
  width: "clamp(48px, 34vw, 20px)",
  height: "auto",
  aspectRatio: "127 / 168",
  // objectFit: "cover",
  // backgroundColor: "white",
  // borderRadius: "12px",
  zIndex: 2,

  // enhancements
  // boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  // border: "2px solid rgba(255,255,255,0.8)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
};


const bklogoStyle : React.CSSProperties = {
  position: "absolute",
  top: "91%",
  left: "6.5%",
  transform: "translateX(-50%)",
  width: "clamp(37px, 34vw, 20px)",
  height: "auto",
  aspectRatio: "127 / 168",
  objectFit: "cover",
  // backgroundColor: "white",
  borderRadius: "25px",
  zIndex: 2,

  // enhancements
  // boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  // border: "2px solid rgba(255,255,255,0.8)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
};


export default PlayerList;
