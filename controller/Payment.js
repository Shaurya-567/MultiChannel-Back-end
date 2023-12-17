const {initializeStripe} = require("../payment/stripe/StripePayment");
exports.initialPaymentStripe=async (req,res)=>{
    const currentOrder = req.body.currentOrder;
    const initializeStripeScript= await initializeStripe(currentOrder);
res.status(200).json({message:"Success initializeStripe",clientSecret:initializeStripeScript});
}