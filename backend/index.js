const express = require('express');
const cors = require('cors');

const app = express();

//read config
require('dotenv').config();
console.log('Environment: ', process.env.NODE_ENV);

app.use(express.json());
app.use(cors());

const appRouter = require('./appRouter');
app.use('/api/contacts', appRouter);

app.use((req, res, next) => {
    console.log('Unhandled request. url: ', req.url, ', method: ', req.method);
    res.status(404).json({"msg": "The page could not be found"});
});

app.use((error, req, res, next) => {
    console.error('An error occured: ', error);
    
    // console.log('get error info');
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    console.log('status: ', status, ', message: ', message, ', data: ', data);

    res.status(500).json({"msg": "An internal error occured"});
    // return res.status(status).json( { 
    //     message: message,
    //     data: data
    // });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log("Server listens on port ", PORT);
} )
