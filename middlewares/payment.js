const stripe = require('stripe')('INSERT_YOUR_STRIPE_SECRET_KEY_HERE');

const payWithStripe = async (card, totalPrice) => {
    try{
        let token = await stripe.tokens.create({
            card
        });
        let charge = await stripe.charges.create({
            amount: totalPrice*100,
            currency: 'usd',
            source: token.id,
            description: 'My First Test Charge (created for API docs)',
        });

        return {
            id: charge.id,
            status: 'OK',
            stripeStatus: true
        }
    } catch (e) {
        return {
            status: 'EXCEPTION',
            message: e.message
        }
    }
}

// ssl-commerz

const SSLCommerzPayment = require('sslcommerz-lts')
const store_id = 'INSERT_STORE_ID_HERE'
const store_passwd = 'INSERT_STORE_PASSWORD_HERE'
const is_live = false //true for live, false for sandbox

const port = 3030

// init

const createAndGetSession = async(total_amount, success_url) => {
    try {
        console.log('Create and get session');
        let data = {
            total_amount: Number(total_amount),
            currency: 'USD',
            tran_id: 'id-' + new Date().getTime(), // use unique tran_id for each api call
            success_url, 
            fail_url: 'INSERT_FAIL_URL_HERE',
            cancel_url: 'INSERT_CANCEL_URL_HERE',
            ipn_url: '',
            shipping_method: 'Courier',
            product_name: 'Computer.',
            product_category: 'Electronic',
            product_profile: 'general',
            cus_name: 'Customer Name',
            cus_email: 'customer@example.com',
            cus_add1: 'Dhaka',
            cus_add2: 'Dhaka',
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: '01711111111',
            cus_fax: '01711111111',
            ship_name: 'Customer Name',
            ship_add1: 'Dhaka',
            ship_add2: 'Dhaka',
            ship_city: 'Dhaka',
            ship_state: 'Dhaka',
            ship_postcode: 1000,
            ship_country: 'Bangladesh',
        };
        let sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        let apiResponse = await sslcz.init(data);

        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.desc.filter(obj => obj.gw === 'bkash')[0].redirectGatewayURL;
        
        return {
            status: apiResponse.status,
            GatewayPageURL,
            message: apiResponse.status
        }
        
    } catch (e) {
        return {
            status: null,
            GatewayPageURL: null,
            message: 'Payment Failed'
        }
    }
}

module.exports = {
    payWithStripe,
    createAndGetSession
}