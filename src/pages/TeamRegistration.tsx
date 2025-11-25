import React, { useEffect, useState } from "react";
import TeamService from "../services/TeamService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import S3Service from "../services/s3Service";
import PlayerService from "../services/PlayerService";

const TeamRegistration: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    team_name: "",
    team_logo: "",
  });

  const [errors, setErrors] = useState({
    team_name: "",
    // team_logo: "",
  });

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    console.log("name== ", name);
    console.log("value== ", value);
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const validateForm = (): boolean => {
    let valid = true;
    const { team_name, team_logo } = formData;
    const newErrors = {
      team_name: "",
      // team_logo: "",
    };

    if (!team_name.trim()) {
      newErrors.team_name = "Team name is required";
      valid = false;
    }

    // if (!selectedImage.trim()) {
    //   newErrors.team_logo = "Please Upload Logo";
    //   valid = false;
    // }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted successfully:", formData);
      formData.team_logo = formData.team_name.replace(/[^A-Z0-9]/ig, "_") + '.jpeg'
      // Perform form submission here
      TeamService()
        .addTeam(formData)
        .then((response: any) => {
          console.log("response== ", response.data);
          // getPresignedUrl();
          teamImageUpload(response.data.id)
        });
    }
  };

  const teamImageUpload = async (teamId:any) => {
    const formFileData = new FormData()
    if(selectedImage){
      formFileData.append('file_name', formData.team_name.replace(/[^A-Z0-9]/ig, "_") + '.jpeg',)
      formFileData.append('team_id', teamId)
      formFileData.append('file', selectedImage)
    }

    // PlayerService().PlayerImageUpload(formFileData).then((response:any)=>{
    //   console.log("response== ", response);
    //   resetData();
    // })

     await PlayerService().PlayerImageGoogleStorageCloudUpload(formFileData);
     resetData();
   
  }



  const getPresignedUrl = () => {
    let file = selectedImage;
    console.log("selectedImage== ", selectedImage);
    console.log("file== ", file);
    let params = {
      key: formData.team_name.replace(/[^A-Z0-9]/ig, "_") + '.jpeg',
      contentType: selectedImage?.type,
      bucket: "palloor-teams",
    };

    S3Service()
      .GetPresignedUrl(params)
      .then((response: any) => {
        console.log("upload url for  Player response== ", response);
        alert("Registered");
        resetData();
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", response.data, true);
        if (file !== null) xhr.setRequestHeader("Content-Type", file.type);
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              return "success";
            } else {
              console.error("Error occurred while uploading file.");
              return "failed";
            }
          }
        };
        let res = xhr.send(file);
        console.log("res== ", res);
      });
  };

  const resetData = () => {
    setFormData({
      team_name: "",
      team_logo: "",
    });
  };

  return (
    <>
      <Header />

      <div style={formContainerStyle}>
        <h3 style={{ color: "#194564", padding: "10px" }}>Team Registration</h3>

        <form onSubmit={handleSubmit}>
          <div style={formColumnStyle}>
            <input
              style={inputContainerStyle}
              placeholder="Team Name"
              type="text"
              id="team_name"
              name="team_name"
              value={formData.team_name}
              onChange={handleChange}
            />
            <span style={errorStyle}>{errors.team_name}</span>

            <input
              style={inputContainerStyle}
              placeholder="Select Image"
              id="team_logo"
              name="team_logo"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

          </div>

          <div style={formColumnStyle}>
              {selectedImage && (
                <div style={teamImageStyle}>
                  <h3>Preview:</h3>
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected"
                    style={{ maxWidth: "100%" }}
                  />
                </div>
              )}
            </div>

          <button style={buttonStyle} type="submit">Register</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

const buttonStyle : React.CSSProperties = {
  backgroundColor: '#194564' ,
  color: 'white',
  padding: '5px 15px',
  borderRadius: '5px',
  outline: '0',
  border: '0',
  textTransform: 'uppercase',
  margin: '50px 0px',
  cursor: 'pointer',
  boxShadow: '0px 2px 2px lightgray',
  transition: 'background-color 250ms ease',
  opacity:  1,
}

const formContainerStyle: React.CSSProperties = {
  // width: "100%",
  border: "1px solid green",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
  textAlign: "center",
  margin : '20px'
};

const teamImageStyle: React.CSSProperties = {
  height: "17rem",
  width: "12rem",
  padding: "5px",
  alignItems: "flex-start",
  display: "grid",
  marginTop: "-10px",
  objectFit: "cover",
};

const formColumnStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  padding: "10px",
};

const inputContainerStyle: React.CSSProperties = {
  flexBasis: "48%",
  height: "2rem",
  border: "2px solid #ccc",
  borderRadius: "8px",
  margin: "5px",
  width: "30%",
};

const errorStyle: React.CSSProperties = {
  color: "red",
};

const isMobile = window.matchMedia("(max-width: 600px)").matches;
if (isMobile) {
  formContainerStyle.margin = '20px';
  formColumnStyle.display = 'grid';
  inputContainerStyle.width='100%';
  formColumnStyle.padding = '0px';
  inputContainerStyle.marginBottom = '20px'
}

export default TeamRegistration;
