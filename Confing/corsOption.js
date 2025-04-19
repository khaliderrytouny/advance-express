const Origin = require('./allowOrigine');

const corstOption = {
   origin : (origin , callBack)=>{
    if (Origin.indexOf(origin) !== -1 || !origin) {
        callBack(null,true);
    } 
   else {
        callBack(new Error('Cors not Allow !!!'))
   }
    
   },
   credetials : true ,
   optionsSuccessStatus : 200
}


module.exports= corstOption ;