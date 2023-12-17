const stripe = require("stripe")('sk_test_51OMupNSD3SBgteJyY5UiZdE9IEi7FF9NBE8bZzt1Gdyk0xbEdSQw0KA5BxENJvDRjIFkrCa7nhEbSF8POYUIFIIY00mjp6PbAK');
const {calculateOrderAmount} = require("./scripts/Stripeprocess");
exports.initializeStripe = async(currentOrder)=>{
    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(currentOrder.totalAmount),
        currency: "inr",
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
          enabled: true,
        },
        metadata:{
            orderId:currentOrder.id
        }
      });
return paymentIntent.client_secret;

}