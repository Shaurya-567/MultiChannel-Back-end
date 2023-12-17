const express = require('express');
const dotenv = require('dotenv');
const server =express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');

const productRouter = require("./routes/Products");
const morgan = require('morgan');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
// const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');
const categoriesRouter= require("./routes/Categories");
const brandsRouter = require("./routes/Brands");
const userRouter = require("./routes/User");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const orderRouter = require("./routes/Order");
const paymentRouter = require("./routes/Payment");
const {transporter} =require("./mail/Mail");
const {isAuth, authPassportServices,cookieExtractor,JwtSecretKey} =require("./middlewares/Middleware");
// Process ENV variables
dotenv.config();
const PORT = process.env.PORT || 5004;
const MONGO_URL = process.env.MONGO_URL || "";

// Config Database Configuration
mongoConnection().catch(err => console.error(err));
async function mongoConnection(){
    await mongoose.connect(MONGO_URL);
    console.log('database connection established');
} 
// middleware
server.use(cors({
    exposedHeaders:['X-Total-Count']
}));
// server.use(express.raw({type:"application/json"}))
server.use(express.json());
server.use(helmet({
  contentSecurityPolicy: false,
  xDownloadOptions: false,
}));
server.use(express.urlencoded());
server.use(cookieParser());

// server.use(expressCspHeader({
//   directives: {
//     'connect-src':[SELF ,'https://632b-2409-40d2-100d-888e-11c5-e5e6-38b3-e5c4.ngrok-free.app'],
//       'default-src': [SELF,'https://632b-2409-40d2-100d-888e-11c5-e5e6-38b3-e5c4.ngrok-free.app/'],
//       'script-src': [SELF, INLINE ,'https://632b-2409-40d2-100d-888e-11c5-e5e6-38b3-e5c4.ngrok-free.app/'],
//       'style-src': [SELF,'https://632b-2409-40d2-100d-888e-11c5-e5e6-38b3-e5c4.ngrok-free.app/'],
//       'img-src': ['data:','https://632b-2409-40d2-100d-888e-11c5-e5e6-38b3-e5c4.ngrok-free.app/'],
//       'worker-src': [NONE],
//       'block-all-mixed-content': false
//   }
// }));
const opts = {}
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = JwtSecretKey();
server.use(session({
    secret: 'secret',
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  }));
server.use(passport.initialize());
server.use(passport.session());
server.use(express.static(path.resolve(__dirname,'client')));

server.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
server.use(morgan("common"));



// routes
server.use("/api/auth", authRouter.router);
server.use("/api/user", userRouter.router);
server.use("/api/products",isAuth(), productRouter.router);
server.use("/api/brand",isAuth(), brandsRouter.router);
server.use("/api/category",isAuth(), categoriesRouter.router);
server.use("/api/cart", isAuth(),cartRouter.router);
server.use("/api/order",isAuth(), orderRouter.router);
server.use("/api/payment",isAuth(), paymentRouter.router);//reset-password

server.use("*",(req,res)=>{
  try{
    // res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' https://js.stripe.com/ 'unsafe-inline' 'unsafe-eval'; style-src 'self' https://js.stripe.com/; ")
    res.sendFile(path.join(__dirname,"/client/index.html"));
  }
  catch(e){
    console.log(e);
    res.status(404);
  }

  
})
// server.use('*',(req,res,next)=>{
//   console.log("Another");
//   res.redirect("/app/");
// })
// console.log(LocalStrategy(req, res, next));
authPassportServices(opts);
server.listen(PORT,() => {
    console.log(`Server listening on ${PORT}`);
})