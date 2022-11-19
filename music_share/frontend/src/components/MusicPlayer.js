import React, { Component, useState } from "react";
import {
  Grid,
  Typography,
  Card,
  IconButton,
  LinearProgress,
} from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious'
import Alert from '@material-ui/lab/Alert';

const MusicPlayer = ({data}) => {
    const songProgress = (data.time / data.duration) * 100;
    const [error, setError] = useState('')

    const handlePause = () => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                "Content-Type": 'application/json'
            }
        }
        fetch('/spotify/pause', requestOptions)
        .then((response) => {
            if(response.status !== 204) {
                setError('play/pause is unauthorized.')
            }
        })
    }

    const handlePlay = () => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                "Content-Type": 'application/json'
            }
        }
        fetch('/spotify/play', requestOptions)
        .then((response) => {
            if(response.status !== 204) {
                setError('Play/Pause is unauthorized.')
            }
        })
    }

    const handleSkip = () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            }
        }
        fetch('/spotify/skip-next', requestOptions)
        .then((response) => {
            if(response.status !== 200) {
                setError('Skip to next song not allowed.')
            }
        })
    }

    const handleSkipPrev = () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            }
        }
        fetch('/spotify/skip-prev', requestOptions)
        .then((response) => {
            if(response.status !== 200) {
              console.log(response.status)
                setError('Skip to previous song not allowed.')
            }
        })
    }

    const renderImage = () => {
      if(data.image_url !== undefined) {
        return data.image_url
      } else {
        return 'https://bigtex.com/wp-content/uploads/2018/05/placeholder-640x640.png'
      }
    }

    return (
        <Card style={{backgroundColor: '#676262', color: '#fff'}}>
          {error !== "" ? <Alert variant='solid' severity="warning" onClose={() => setError('')}>{error}</Alert> : null}
        <Grid container alignItems="center">
          <Grid item align="center" xs={4}>
            {<img src={renderImage()} height="120%" width="120%" />}
          </Grid>
          <Grid item align="center" xs={8}>
            <Typography component="h5" variant="h5" style={{color: '#fff'}}> 
              {data.title ? data.title : 'No Song Playing'}
            </Typography>
            <Typography color="textSecondary" variant="subtitle1" style={{color: '#cccccc'}}>
              {data.artist ? data.artist : 'not available'}
            </Typography>
            <div>
            <IconButton onClick={handleSkipPrev}>
                <SkipPreviousIcon style={{color: '#cccccc'}}/>
              </IconButton>
              <IconButton onClick={data.is_playing ? handlePause: handlePlay} style={{color: '#cccccc'}}>
                {data.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
              <IconButton onClick={handleSkip}>
                <SkipNextIcon style={{color: '#cccccc'}}/>
              </IconButton>
            </div>
            <div>
            <Typography color="textSecondary" variant="subtitle1" style={{
              fontSize:".8em", 
              border: '1px solid #cccccc',
              borderRadius: '5px', 
              width: '40%', 
              color: '#cccccc'}}>
              {'Votes to skip next: ' + data.votes + ' / ' + data.votes_required}
            </Typography>
            </div>
          </Grid>
        </Grid>
        <LinearProgress variant="determinate" value={songProgress} />
      </Card>
    )
}   

export default MusicPlayer