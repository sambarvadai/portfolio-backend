const exp = require('express');
//const fetch = require('node-fetch');
require('dotenv').config();

const app = exp();
const port = process.env.PORT || 3000;

//Define route for OpenCage
app.get('/api/geocode',async (req,res)=>{
    const {q} = req.query;
    console.log("Using TZDB key:", process.env.OPENCAGE_API_KEY);
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
    console.log("Using TZDB key:", process.env.TZDB_KEY);
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
    app.listen(port,()=>{console.log("Server started successfully on port",port)});