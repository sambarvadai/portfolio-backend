const exp = require('express');
const cors = require('cors');
//const fetch = require('node-fetch');
require('dotenv').config();

const app = exp();
app.disable('etag');
const port = process.env.PORT || 3000;
app.use(cors({
  origin:"*"
}));
//Define route for OpenCage
app.get('/api/geocode',async (req,res)=>{
    const {q} = req.query;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(q)}&key=${process.env.OPENCAGE_API_KEY}`;
    try{
        const response = await fetch(url);
        const data = await response.json();
        res.status(200).json(data);
    }
    catch(error){
        console.error("Issue detected in OpenCage API")
        res.status(500).json({error: "Server or OpenCage API error"});
    }
});
app.get('/api/timezone',async(req,res)=>{
    const {lat,lng} = req.query;
    const url = `https://api.timezonedb.com/v2.1/get-time-zone?key=${process.env.TZDB_KEY}&format=json&by=position&lat=${lat}&lng=${lng}`;
    try{
        const response = await fetch(url);
        const data = await response.json();
        res.status(200).json(data);
    }
    catch(error){
        console.error("Issue detected in timezone API");
        res.status(500).json({error:"Server or TimezoneDB API Error"});
    }
    });
  
    app.get('/ping', (req, res) => {
        res.send('pong');
      });
    
      app.get('/api/spotify/now-playing', async (req, res) => {
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + Buffer.from(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
          })
        }); // ← closes fetch()
      
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;
      
        const nowPlayingResponse = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          }
        });
      
        if (nowPlayingResponse.status === 204) {
          return res.status(204).json({ message: "No song is currently playing" });
        }
      
        const data = await nowPlayingResponse.json();
        const songName = data?.item?.name;
        res.json({ song: songName });
      
      }); 
      
    app.listen(port,()=>{console.log("Server started successfully on port",port)});