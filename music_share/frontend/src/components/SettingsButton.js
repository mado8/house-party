import React from "react";
import { Grid, Button } from "@material-ui/core" ;

const SettingsButton = ({data}) => {
    return (
        <Grid item xs={12} align="center" style={{paddingTop:'5%'}}>
            <Button variant="contained" color="primary" onClick={data.updateSettings}>
                Settings
            </Button>
        </Grid>
    )
}

export default SettingsButton