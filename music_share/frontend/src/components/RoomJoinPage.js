import React, { useState } from 'react';
import { 
    Button, 
    Grid, 
    Typography, 
    TextField,
} from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom'

const RoomJoinPage = () => {
    const navigate = useNavigate()
    const [roomCode, setRoomCode] = useState("");
    const [error, setError] = useState(""); 


    // handles form input and changes useState hook to code value
    const handleTextChange = (e) => {
        setRoomCode(e.target.value)
    }


    // fetching room to see if it is a valid code, if successful => redirect
    const handleEnterRoom = () => {
        const requestOptions = {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                code: roomCode,
            })
        };
        fetch('/api/join-room', requestOptions).then((response) => {
            if(response.ok) {
                navigate(`/room/${roomCode}`)
            } else {
                setError('Room not found.')
            }
        }).catch((error) => {
            console.log(error)
        })
    }


    // renders room join page
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant='h4' component="h4">
                    Join a Room
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <TextField 
                style={{color: '#fff'}}
                error={error}
                label="code"
                placeholder="Enter a Room Code"
                value={roomCode}
                helperText={error}
                // variant="outlined"
                onChange={handleTextChange}/>
            </Grid>
            <Grid item xs={12} align="center" style={{paddingTop: '5%'}}>
                <Button variant="contained" color="primary" onClick={handleEnterRoom} component={Link}>Enter Room</Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" to='/' component={Link}>Back</Button>
            </Grid>
        </Grid>
    )
}

export default RoomJoinPage;