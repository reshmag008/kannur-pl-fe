import { BACKEND_URL } from "../constants";
import axios from 'axios'


export const S3Service = () => ({

    GetPresignedUrl: (params:any) => {
        return(axios.post(BACKEND_URL + "/upload",params ))
    },

   
});

export default S3Service;
