import React, { useEffect, useState } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from './Room'
import { Grid, Button, ButtonGroup, Typography } from '@material-ui/core' 
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom'

const Homepage = () => {
    const [roomCode, setRoomCode] = useState(null)

    const getUserRoom = async () => {
       return await fetch("/api/user-in-room")
       .then((response) => response.json())
       .then((data) => {
         setRoomCode(data.code)
       });
    }

    useEffect(() => {
        getUserRoom();
    },[])

    const clearRoomCode = () => {
        setRoomCode(null)
    }

    const homepage = () => {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant="h3" component="h3" style={{color: '#fff'}}>House Party</Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="primary" to="/join" component={ Link }> Join a Room </Button>
                        <Button color="secondary" to="/create" component={ Link }> Create a Room </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        )
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={roomCode ? ( <Navigate to={`/room/${roomCode}`}/>) : homepage() }/>
                <Route path="/join" element={<RoomJoinPage/>}></Route>
                <Route path="/create" element={
                <CreateRoomPage 
                    update={false} 
                    votesToSkip={2} 
                    guestCanPause={null} 
                    // updateCallback={null}
                />
                }></Route>
                <Route
                    path="/room/:roomCode"
                    element={<Room leaveRoomCallback={clearRoomCode} />}
                ></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Homepage