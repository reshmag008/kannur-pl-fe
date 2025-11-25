import { BACKEND_URL } from "../constants";
import axios from 'axios'


export const TeamService = () => ({

    getAllTeams: () => {
        return(axios.get(BACKEND_URL + "/teams" ))
    },

    addTeam : (params:any) =>{
        return(axios.post(BACKEND_URL + "/teams", params))
    }

   
});

export default TeamService;