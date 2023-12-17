const express = require('express');
const { initialPaymentStripe} = require('../controller/Payment');

const router =express.Router();

router.post("/stripe-create-payment-intent",initialPaymentStripe);


exports.router=router;