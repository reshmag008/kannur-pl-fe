import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { BACKEND_URL } from '../constants';
import playerBg from '../assets/playerBg1.jpeg'
import ReactDOM from 'react-dom/client'; // Import createRoot from React 18
import { format } from 'path';




interface props{
    playerList:any
}

const PDFCreator: React.FC<props> = ({playerList}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null); // To capture the player card

  const generatePDF = async () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 2; // Margin for all sides
    const contentWidth = pageWidth - margin * 3;
    const contentHeight = pageHeight - margin * 60;
    let pageNumber = 1;

    for (const player of playerList) {
        // Fetch the profile image and convert it to base64 if needed
        const profileImageUrl = `https://storage.googleapis.com/auction-players/${player.profile_image}`;
        const profileImageBase64 = await fetch(profileImageUrl)
            .then((res) => res.blob())
            .then((blob) => new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            }));

        // Create a temporary div to render each player's content
        const tempDiv = document.createElement("div");
        tempDiv.style.width = `${contentWidth * 3}px`; // Increase width for higher-res canvas
        tempDiv.style.height = `${contentHeight * 5}px`; // Increase height for higher-res canvas
        tempDiv.style.marginTop = '20px';
        tempDiv.style.display = 'flex';
        tempDiv.style.justifyContent = 'center';
        tempDiv.style.alignItems = 'center';
        tempDiv.style.backgroundColor = 'white';
        tempDiv.style.overflow = "hidden";

        // Set card styles and content
        tempDiv.innerHTML = `
            <div style="
                border: 1px solid #ccc; 
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
                border-radius: 8px;
                width: 100%; 
                height: 100%;
                background-image: url(${playerBg});
                background-size: cover;
                background-position: center;
                
                ">
                <div style="display:flex">
                    <img src="${profileImageBase64}" alt="Player Image" style="height: 62rem; width: 55rem; margin-left: 700px; object-fit: cover; margin-top: -790px;border-radius:19px;
                    mask-composite: intersect;" />
                </div>
                <div style="text-align:center;">
                    <p style="margin-top:110px; font-size: 40px; color: black; font-weight:bold;">${player.id}. ${player.fullname.toUpperCase()}</p>
                </div>

                <div style="display:flex;">
                    <p style="margin-top:70px; font-size: 68px; color:goldenrod; font-weight:bold;padding-left:750px">Location : ${player.location.toLowerCase()}</p>
                </div>
                
                <div style="display:flex;">
                    <p style="margin-top:20px; font-size: 70px; color:goldenrod; font-weight:bold;padding-left:750px">Role : ${player.player_role}</p>
                </div>
                <div style="display:flex;">
                    <p style="margin-top:20px; font-size: 70px; color:goldenrod; font-weight:bold;padding-left:750px">Batting : ${player.batting_style}</p>
                </div>

                <div style="display:flex;">
                    <p style="margin-top:20px; font-size: 70px; color:goldenrod; font-weight:bold;padding-left:750px">Bowling : ${player.bowling_style} </p>
                </div>
                
                <div style="display:flex;">
                    <p style="margin-top:20px; font-size: 70px; color:goldenrod; font-weight:bold;padding-left:750px">Contact : ${player.contact_no}</p>
                </div>
            </div>
        `;
        

        document.body.appendChild(tempDiv);

        // Capture the temporary content as an image
        const canvas = await html2canvas(tempDiv, { scale: 2, useCORS: true }); // Scale for better quality
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = contentWidth; // Width to fit within margins
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Preserve aspect ratio

        // Add the captured image to the PDF within margins
        if (pageNumber > 1) pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);

        // Optional: Add footer with page number
        pdf.setFontSize(10);
        pdf.setTextColor(150);
        pdf.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        pageNumber++;

        // Remove the temporary div
        document.body.removeChild(tempDiv);
    }

    // Save the PDF
    pdf.save("rainbow.pdf");
};




//   const generatePDF = async () => {
//     const pdf = new jsPDF();
//     const pageWidth = pdf.internal.pageSize.width;
//     const pageHeight = pdf.internal.pageSize.height;
//     let pageNumber = 1;

//     for (const player of playerList) {
//         // Fetch the profile image and convert it to base64 if needed
//         const profileImageUrl = `${BACKEND_URL}/player_images/${player.profile_image}`;
//         const profileImageBase64 = await fetch(profileImageUrl)
//             .then((res) => res.blob())
//             .then((blob) => new Promise((resolve) => {
//                 const reader = new FileReader();
//                 reader.onload = () => resolve(reader.result);
//                 reader.readAsDataURL(blob);
//             }));

//         // Define the card background URL
//         const playerBgUrl = playerBg ? `url(${playerBg})` : "linear-gradient(to top, #DE3163, #000080)";

//         // Create a temporary div to render each player's content
//         const tempDiv = document.createElement("div");
//         tempDiv.style.width = `${pageWidth * 4}px`; // Increase size for high-res canvas capture
//         tempDiv.style.height = `${pageHeight * 4}px`;
//         tempDiv.style.display = 'flex';
//         tempDiv.style.justifyContent = 'center';
//         tempDiv.style.alignItems = 'center';
//         tempDiv.style.backgroundColor = 'white';

//         // Set card styles and content
//         tempDiv.innerHTML = `
//             <div style="
//                 display: flex; 
//                 flex-direction: column; 
//                 justify-content: center;
//                 align-items: center;
//                 border: 1px solid #ccc; 
//                 box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
//                 border-radius: 8px;
//                 width: 100%; 
//                 height: 100%;
//                 background-image: ${playerBgUrl};
//                 background-size: cover;
//                 gap: 2rem;
//                 padding: 2rem;
//                 margin:20px;
//                 ">
//                 <div style="display: flex; justify-content: center; padding-top: 1rem;">
//                     <img src="${profileImageBase64}" alt="Player Image" style="width: 150px; height: 150px; border-radius: 50%;" />
//                 </div>
//                 <div style="padding: 1rem; text-align: center;">
//                     <h3 style="margin: 0; font-size: 2rem; color: #fff;">${player.fullname.toUpperCase()}</h3>
//                     <p style="margin: 0.5rem 0; font-size: 1.2rem; color: #fff;">ID: ${player.id}</p>
//                     <p style="margin: 0.5rem 0; font-size: 1.2rem; color: #fff;">Location: ${player.location}</p>
//                     <p style="margin: 0.5rem 0; font-size: 1.2rem; color: #fff;">Role: ${player.player_role}</p>
//                     <p style="margin: 0.5rem 0; font-size: 1.2rem; color: #fff;">Batting Style: ${player.batting_style}</p>
//                     <p style="margin: 0.5rem 0; font-size: 1.2rem; color: #fff;">Bowling Style: ${player.bowling_style}</p>
//                     <p style="margin: 0.5rem 0; font-size: 1.2rem; color: #fff;">WhatsApp: ${player.whatsapp_no}</p>
//                 </div>
//             </div>
//         `;

//         document.body.appendChild(tempDiv);

//         // Capture the temporary content as an image
//         const canvas = await html2canvas(tempDiv, { scale: 2, useCORS: true }); // Scale to increase resolution
//         const imgData = canvas.toDataURL('image/png');

//         // Add the captured image to the PDF covering the full page
//         if (pageNumber > 1) pdf.addPage();
//         pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);

//         // Optional: Add footer with page number
//         pdf.setFontSize(10);
//         pdf.setTextColor(150);
//         pdf.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
//         pageNumber++;

//         // Remove the temporary div
//         document.body.removeChild(tempDiv);
//     }

//     // Save the PDF
//     pdf.save("playerList.pdf");
// };



 
  return (
    <div>
      <button onClick={generatePDF}>Generate PDF</button>
      {/* <button onClick={downloadPDF} disabled={!pdfUrl}>Download PDF</button> */}
    </div>
  );



};

const playerListContainer: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(23rem, 1fr))',
    gap: '2rem',
    // maxWidth: '120rem',
    margin: '0 auto',
    padding: '2rem',
    backgroundColor:'white'
}

const cardIconTextStyle: React.CSSProperties = {
    padding: '10px',
    cursor: 'pointer',
    color: 'yellow',
    textAlign: 'left',
    fontSize: '50px',
    textShadow: "1px 1px 0 #f00, 2px 2px 0 #f00, 3px 3px 0 #f00",
    fontWeight:"bolder",
    fontStyle:'italic'
  };

const cardSubHeader : React.CSSProperties = {
    fontSize: '25px',
    fontFamily: 'auto',
    marginTop: '11px',
    // textAlign: 'center',
    border: "2px solid #ccc",
    borderRadius: "8px",
    // width: "130px",
    backgroundColor: "antiquewhite",
    color : "black",
    padding:"3px",
    marginLeft:"125px",
    height:"fit-content"
}


const cardHeaderTextStyle: React.CSSProperties = {
    gap: '2rem',
    cursor: 'pointer',
    // color: 'yellow',
    textAlign: 'center',
    fontSize: '23px',
    // textShadow: '1px 1px 0 #999, 2px 2px 0 #999, 3px 3px 0 #999',
    fontFamily: "Arial,Helvetica, sans-serif",
    justifyContent:'center'
    
  };

  const cardBodyTextStyle: React.CSSProperties = {
    color: 'black',
    textAlign: 'left',
    fontSize: '25px',
    paddingLeft:"10px"
  };

const n05IconStyle : React.CSSProperties = {
    display:'flex', justifyContent:'end', marginLeft:"95px"
}

const imageStyle1 : React.CSSProperties = {
    height : '7rem',
    width: '7rem',
    padding:'5px',
    // borderRadius: '13px',
    // objectFit: 'cover',
    // border: 'none'
    // marginLeft:"-15px",
    // marginTop:"-122px"
}

const spanText :  React.CSSProperties = {
    marginTop: '-126px', 
    fontWeight: 'bold', 
    fontSize: '16px',
    paddingLeft : '87px',
    color:'white'
    // paddingTop : '8px'
}

const spanText1 :  React.CSSProperties = {
    marginTop: '4px', 
    fontWeight: 'bold', 
    fontSize: '16px',
    paddingLeft : '88px',
    color : 'white'
    // paddingTop : '8px'
}

const fullNameText :  React.CSSProperties = {
    marginTop: '-149px', 
    fontWeight: 'bold', 
    fontSize: '14px',
    paddingLeft : '85px',
    color:"white"
}

const idText :  React.CSSProperties = {
    marginTop: '-193px', 
    fontWeight: 'bold', 
    fontSize: '21px',
    paddingLeft : '26px',
    color:"white"
}

const svgStyle :React.CSSProperties = {
    height : '1rem',
    width: '1rem',
    objectFit:'cover',
    padding:'10px',
    filter: 'invert(85%) sepia(20%) saturate(150%) hue-rotate(200deg) brightness(120%) contrast(120%)'

}

const profileImageStyle : React.CSSProperties = {
    height: '11.5rem',
    width: '6.5rem',
    // padding: '5px',
    alignItems: 'flex-start',
    // display: 'grid',
    marginLeft: '216px',
    objectFit:'cover',
    // borderRadius : "50%"
    marginTop:"289px",
    borderImage: "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 10%)",
//   WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,2) 10%)",
//   maskImage: "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%)"
  
}

const players__card__wrap :  React.CSSProperties = {
    gap: '2rem',
    // backgroundImage: 'linear-gradient(to top,  #DE3163	, #000080	)',
    // backgroundImage :"linear-gradient(#194564,#4c8dba, #194564)",
    backgroundImage : `url(${playerBg})`,
    border: '1px solid #ccc', 
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
    borderRadius: '8px', 
    margin: '0 auto',
    marginTop:'25px',
    // backgroundColor:"#d4af37"
    width:"351px",
    height:"497px",
    // overflow: 'hidden'
  }

const no5Style : React.CSSProperties = {
    height : "3rem",
    width : "4rem",
    // borderRadius : "50%",
    padding:"5px",
    marginLeft:"15px",
    marginTop:"-35px"

}

const cardHeader :  React.CSSProperties = {
    display: 'flex',
    justifyContent:'flex-start'
}

const cardFooter :  React.CSSProperties = {
    display: 'flex',
    backgroundColor : 'purple',
    marginBottom:'10px'
}

const playerCountStyle : React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor:'#d4af37'
}

const inputContainerStyle: React.CSSProperties = {
    flexBasis: "48%",
    height: "2rem",
    border: "2px solid #ccc",
    borderRadius: "8px",
    margin:'5px',
    // width : '80%'
  };

const cardTitleStyle : React.CSSProperties = {
    fontSize: '30px',
    fontFamily: 'auto',
    marginTop:'8px',
    textAlign: 'center',
    background: "linear-gradient(to top, #f32170, #ff6b08,#cf23cf, #eedd44)",
    WebkitTextFillColor: "transparent",
    WebkitBackgroundClip: "text",
    marginLeft:"10px"
    
}

const isMobile = window.matchMedia("(max-width: 600px)").matches;
    if (isMobile) {
        playerCountStyle.fontSize = '12px'; // Adjust font size for mobile view
        playerCountStyle.padding = '10px'

        playerListContainer.gridTemplateColumns =  'repeat(auto-fit, minmax(18rem, 1fr))'
        playerListContainer.padding =  '0rem'

        players__card__wrap.margin = '10px'

        cardIconTextStyle.fontSize = "35px"
        cardIconTextStyle.marginTop = "15px";

        cardSubHeader.fontSize = '20px';
        cardTitleStyle.fontSize = '26px';

        spanText.paddingLeft = '5px';
        n05IconStyle.marginLeft = '80px'
        no5Style.marginTop = '5px'

    }


export default PDFCreator;
