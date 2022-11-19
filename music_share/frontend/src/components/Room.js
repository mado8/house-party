import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import { Grid, Button, Typography } from "@material-ui/core" ;
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Settings from "./Settings";
import SettingsButton from "./SettingsButton";
import MusicPlayer from "./MusicPlayer";

const Room = (props) => {

    const [votesToSkip, setVotesToSkip] = useState(1)
    const [guestCanPause, setGuestCanPause] = useState(true)
    const [isHost, setIsHost] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [isSpotifyAuthenticated, setIsSpotifyAuthenticated] = useState(false)
    const { roomCode } = useParams();
    const navigate = useNavigate();
    const [song, setSong] = useState({
        'artist': "",
        'duration': null,
        'id': "",
        'image_url': "",
        'is_playing': null,
        'time': null,
        'title': "",
        'votes': null
    })


    // fetches song data once user is authenticated
    const getSong = async () => {
        await fetch('/spotify/current-song')
        .then((response) => {
            if(!response.ok || response.status === 204) {
                return {}
            } else {
                return response.json()
            }
        })
        .then((data) => {
            setSong(data)
        })
    }


    // fetches user token data to make sure user is logged in to spotify
    const authenticateSpotify = async () => {
        await fetch('/spotify/is-authenticated')
        .then((response) => response.json())
        .then((data) => {
            setIsSpotifyAuthenticated(data.status)
            if(!data.status) {
                fetch('/spotify/get-auth-url')
                .then((response) => response.json())
                .then((data) => {
                    window.location.replace(data.url)
                })
            }
        })
    }


    // fetches room data for host, guest can pause, and votes to skip
    const getRoomDetails = () => {
        fetch('/api/get-room' + '?code=' + roomCode).then((response) => {
            if(!response.ok){
                props.leaveRoomCallback()
                navigate("/")
            }
            return response.json()
        }).then((data) => {
            if(data) {
                setVotesToSkip(data.votes_to_skip)
                setGuestCanPause(data.guest_can_pause)
                setIsHost(data.is_host)
            }
            if(isHost === true) {
                authenticateSpotify()
            }
        })
    }


    // function to update session data if user leaves the room, and 
    // updates data of everyone in room if the host leaves the room.
    const leaveRoom = async () => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json" },
        }
        await fetch('/api/leave-room', requestOptions).then((_response) => {
            props.leaveRoomCallback()
            navigate("/")
        })
    }


    // useEffect hooks to fetch data on host, if guest can pause, 
    // votes to skip, and current song information
    useEffect(() => {
        getRoomDetails()
    })
    useEffect(() => {
        const interval = setInterval(() => {
                getSong()
          }, 1000);
          return () => clearInterval(interval);
    },[])


    // functions to update useState hook and render settings
    const updateSettings = () => setShowSettings(!showSettings)
    const showSettingsButton = () => <SettingsButton data={{'updateSettings': updateSettings}}></SettingsButton>
    const renderSettings = () => {
        return (
            <Settings data={{
                'votesToSkip': votesToSkip, 
                'guestCanPause': guestCanPause, 
                'roomCode': roomCode,
                'updateSettings': updateSettings
            }}></Settings>
        )
    }


    // function to render room page with music controller
    const renderRoomPage = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography variant="h5" component="h5" style={{
                        paddingBottom:'5%',
                        color: '#514b4b'
                    }}>
                    Invite Friends : {roomCode}
                    </Typography>
                </Grid>
                <MusicPlayer data={song}></MusicPlayer>
                {isHost ? showSettingsButton(): null}
                <Grid item xs={12} align="center">
                    <Button variant="contained" to="/" color="secondary" component={Link} onClick={leaveRoom}>
                        Leave Room
                    </Button>
                </Grid>
            </Grid>
        )
    }

    return showSettings ? renderSettings() : renderRoomPage()
}

export default Room