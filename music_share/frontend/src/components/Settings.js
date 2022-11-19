import React from "react";
import { Grid, Button } from "@material-ui/core" ;
import { Link } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";

const Settings = ({data}) => {
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <CreateRoomPage 
                update={true} 
                votesToSkip={data.votesToSkip} 
                guestCanPause={data.guestCanPause} 
                roomCode={data.roomCode}
                ></CreateRoomPage>
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" component={Link} onClick={data.updateSettings}>
                    Close
                </Button>

            </Grid>
        </Grid>
    )
}

export default Settings