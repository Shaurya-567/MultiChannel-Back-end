const LocalStrategy = require('passport-local').Strategy;
const {User} = require('../model/User');
const crypto = require('crypto');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

exports.isAuth=(req,res,next)=>{
  
    return passport.authenticate('jwt');
    // next();
}
exports.JwtSecretKey=()=>{
    return "SECRET_KEY"
}

exports.processUser=(user)=>{
    return {id:user.id,fullName:user.fullName,addresss:user.addresss,email:user.email,role:user.role,orders:user.orders,thumbnail:user.thumbnail}
}


exports.authPassportServices =(opts)=>{
    passport.use('local',
        new LocalStrategy({usernameField: 'email'},
          async (email, password, done)=> {              
              try{
                const user= await User.findOne({email:email}).exec();
                  if(!user){
                       return done(null,false,{message:"User not found"})
                  }
                  crypto.pbkdf2(
                    password,
                    user.salt,
                    310000,
                    32,
                    "sha256",
                    async (err, hashedPassword) =>{
                   if(!crypto.timingSafeEqual(user.password, hashedPassword)) {
                      return done(null,false,{message:"Invalid password"})
                  }
                    let token =jwt.sign(this.processUser(user),this.JwtSecretKey())
                    return done(null,{user:this.processUser(user),token:token});
              })
                  // const response = await user.save();
              }
              catch(err){
                console.log(err);
                   return done(null,false,{message:JSON.stringify(err)})
              }
          }
        ));


passport.use('jwt',new JwtStrategy(opts, async (jwt_payload, done)=> {
    try{
        const user= await User.findById(jwt_payload.id).exec();
          if(!user){
            console.log("User not found")
            console.log(done);
               return done(null,false,{message:"User not found"})
          }
          else{
            // let token =jwt.sign(processUser(user),JwtSecretKey())
            return done(null, this.processUser(user));
          }
          // const response = await user.save();
      }
      catch(err){
        console.log(err);
           return done(null,false,{message:JSON.stringify(err)})
      }
}));
        
        passport.serializeUser((user, cb)=> {
          process.nextTick(()=> {
            return cb(null, user);
          });
        });
      
        passport.deserializeUser((user, cb)=> {
          process.nextTick(()=> {
            return cb(null, user);
          });
        });

}

exports.cookieExtractor = (req)=> {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['access_token'];
    }
    token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1N2M3MTIxYmI2YzcyMTkxZjllMzdhZiIsImZ1bGxOYW1lIjoiU2hpdiBLIFNhaCIsImFkZHJlc3NzIjpbXSwiZW1haWwiOiJzaGl2a3NhaC5pbkBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsIm9yZGVycyI6W10sInRodW1ibmFpbCI6IiIsImlhdCI6MTcwMjY2MDI4M30.hKlUQC7DBp3YEUMN-Sv2CId1Yhu5Vc8rShmGP8ESx_k';
// token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1N2M3MTIxYmI2YzcyMTkxZjllMzdhZiIsImZ1bGxOYW1lIjoiU2hpdiBLIFNhaCIsImFkZHJlc3NzIjpbXSwiZW1haWwiOiJzaGl2a3NhaC5pbkBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsIm9yZGVycyI6W10sInRodW1ibmFpbCI6IiIsImlhdCI6MTcwMjY1NDc5N30.b7SS3z-GDlbyU0qcFNu0qU-FhtFodOXXozK7qdWJyOE';
    return token;
};