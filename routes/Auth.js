const express = require('express');
const { createUser, loginUser, checkAuthUser,resetPasswordRequest,resetPassword,signOut} = require('../controller/Auth');
const passport = require('passport');

const router =express.Router();



router.post("/signup",createUser)
.post("/login",passport.authenticate('local'),loginUser)
.get("/checkAuth",passport.authenticate('jwt'),checkAuthUser)
.post("/reset-password-request",resetPasswordRequest)
.post("/reset-password",resetPassword).get("/signOut",signOut);

exports.router=router;