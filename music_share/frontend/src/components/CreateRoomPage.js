import React, { useState } from "react";
import { 
    Button, 
    Grid, 
    Typography, 
    TextField, 
    FormHelperText, 
    FormControl, 
    Radio, 
    RadioGroup, 
    FormControlLabel,
    Collapse,
    Card
} from '@material-ui/core';
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom"
import Alert from '@material-ui/lab/Alert';

const CreateRoomPage = (props) => {

    let defaultVotes = (props.votesToSkip !== undefined ? props.votesToSkip: 2)
    const [guestCanPause, setGuestCanPause] = useState(true)
    const [votesToSkip, setVotesToSkip] = useState(defaultVotes)
    const [successMsg, setSuccessMsg] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    let navigate = useNavigate();


    // handle change functions to grab data from user forms
    const HandleVotesChange = (e) => { setVotesToSkip(e.target.value) }
    const HandleGuestCanPauseChange = (e) => setGuestCanPause(e.target.value === "true" ? true : false )


    // makes a post request using user data in form to create a room
    const HandleCreateRoom = () => {
        const requestOptions =  {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                guest_can_pause: guestCanPause,
                votes_to_skip: votesToSkip,
            }),
        };
        fetch('/api/create-room', requestOptions).then((response) => 
            response.json()
        ).then((data) => {
            navigate("/room/" + data.code)
        })
    }


    // updates existing room to data reflected in form on settings page
    const handleUpdateRoom = () => {
        const requestOptions =  {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                guest_can_pause: guestCanPause,
                votes_to_skip: votesToSkip,
                code: props.roomCode
            }),
        };
        fetch('/api/update-room', requestOptions).then((response) => {
            if(response.ok) {
                setSuccessMsg('Updated Successfully')
            } else {
                setErrorMsg('Updating ...')
            }
        })
    }


    // displays back button if component is used for "create a room"
    const returnBackButton = () => {
        return (
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" to='/' component={Link}> Back </Button>
            </Grid>
        )
    }


    // function to save current selected value of radio and display it as the default option
    const handleRadio = () => {
        if(props.guestCanPause !== null) {
            return props.guestCanPause.toString()
        } else {
            return 'true'
        }
    }


    // returns either a create a room or settings page form
    return (
        <Card style={{backgroundColor: '#676262', color: '#fff'}}>
            <Grid container spacing={1} style={{padding: '30px'}}>
                <Grid item xs={12} align="center">
                    <Collapse in={errorMsg != "" || successMsg != ""}>
                        {successMsg != '' ? (
                        <Alert severity="success" onClose={() => setSuccessMsg('')}>{successMsg}</Alert> 
                        ) : (
                        <Alert severity="error" onClose={() => setErrorMsg('')}>{errorMsg}</Alert>
                        )}
                    </Collapse>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">
                        {props.update ? 'Settings' : 'Create a Room'}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl component="fieldset">
                        <FormHelperText>
                            <div align="center">
                                Control of Playback State
                            </div>
                        </FormHelperText>
                        <RadioGroup 
                            row 
                            defaultValue={handleRadio} 
                            onChange={HandleGuestCanPauseChange}
                        >
                            <FormControlLabel 
                                value='true' 
                                control={<Radio color="primary"></Radio>}
                                label="Play/Pause"
                                labelPlacement="bottom"
                            ></FormControlLabel>
                            <FormControlLabel 
                                value='false' 
                                control={<Radio color="secondary"></Radio>}
                                label="No Control"
                                labelPlacement="bottom"
                            ></FormControlLabel>
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl>
                        <TextField 
                        onChange={HandleVotesChange}
                        required={true} 
                        color="primary"
                        type="number"
                        defaultValue={defaultVotes} 
                        inputProps={{
                            min:1,
                            style: {textAlign: "center"},
                        }}
                        sx={{
                            borderBottom: '#fff',
                            color: '#fff',
                        }}
                        />
                        <FormHelperText>
                            <p align="center"> Votes Required to Skip Song</p>
                        </FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={ props.update? handleUpdateRoom : HandleCreateRoom }>{props.update? 'Update' : 'Create a Room'}</Button>
                </Grid>
                {props.update ? null : returnBackButton()}
            </Grid>
        </Card>
    )
}

export default CreateRoomPage;