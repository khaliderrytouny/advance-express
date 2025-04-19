const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 300 ;
const DBconnect = require('./Confing/DBconnect');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const corstOption = require('./Confing/corsOption')
const path = require('path')


DBconnect();

app.use(cors(corstOption));
app.use(cookieParser());
app.use(express.json());
app.use('/',express.static(path.join(__dirname,'./Public')));
app.use('/', require('./routes/root'));
app.use('/auth',require('./routes/authrouter'));
app.use('/users',require('./routes/userrouter'));




app.all('/{*any}',(req,res)=>{
    if (req.accepts("html")) {
        res.status(404).sendFile(path.join(__dirname,'./views','404.html'));
    } else if (req.accepts("json")){
        res.status(404).json({message : 'Page not found'});
    }else{
        res.status(404).type('txt').send('Page not found')
    }
});





















mongoose.connection.once('open',()=>{
    console.log('success connection to mongoDB !!');
    app.listen(port , ()=>{
        console.log(`Connected to port ${port}`);
        
    });
});
mongoose.connection.on("error",(err)=>{
    console.log(err);
    
})

