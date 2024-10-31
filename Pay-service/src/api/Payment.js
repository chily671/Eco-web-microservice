// host static files
//app.use(express.static("client"));
const {
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
  PAYPAL_API,
  STRIPE_SECRET_KEY
} = require("../config");

const stripe = require("stripe")(STRIPE_SECRET_KEY);
module.exports = async (app, channel) => {
  /**
   * Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
   * see https://developer.paypal.com/api/rest/authentication/
   */
  const generateAccessToken = async () => {
    try {
      console.log("PAYPAL_CLIENT_ID", PAYPAL_CLIENT_ID);
      console.log("PAYPAL_CLIENT_SECRET", PAYPAL_CLIENT_SECRET);
      if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
        throw new Error("MISSING_API_CREDENTIALS");
      }
      const auth = Buffer.from(
        PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET
      ).toString("base64");
      const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error("Failed to generate Access Token:", error);
    }
  };

  /**
   * Create an order to start the transaction.
   * see https://developer.paypal.com/docs/api/orders/v2/#orders_create
   */
  const createOrder = async (cart) => {
    // use the cart information passed from the front-end to calculate the purchase unit details
    console.log(
      "shopping cart information passed from the frontend createOrder() callback:",
      cart
    );

    //let userData = await Users.findOne({_id:req.user.id});
    //let products = await Product.find({id:userData.cartData.id})
    //let total = userData.cartData[itemId] * products.new_price;
    const accessToken = await generateAccessToken();
    const url = `${PAYPAL_API}/v2/checkout/orders`;
    const payload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: cart.total,
          },
        },
      ],
    };

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
        // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
        // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
      },
      method: "POST",
      body: JSON.stringify(payload),
    });

    return handleResponse(response);
  };
  async function handleResponse(response) {
    try {
      const jsonResponse = await response.json();
      return {
        jsonResponse,
        httpStatusCode: response.status,
      };
    } catch (err) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
  }

  /**
   * Capture payment for the created order to complete the transaction.
   * see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
   */
  const captureOrder = async (orderID) => {
    const accessToken = await generateAccessToken();
    const url = `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
        // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
        // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
      },
    });

    return handleResponse(response);
  };

  app.post(`/api/orders`, async (req, res) => {
    try {
      // use the cart information passed from the front-end to calculate the order amount detals
      console.log(req.body);
      const { jsonResponse, httpStatusCode } = await createOrder(req.body);
      res.status(httpStatusCode).json(jsonResponse);
      console.log(jsonResponse);
      console.log("create order");
    } catch (error) {
      console.error("Failed to create order:", error);
      res.status(500).json({ error: "Failed to create order." });
    }
  });

  app.post(`/api/orders/:orderID/capture`, async (req, res) => {
    try {
      const { orderID } = req.params;
      const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
      res.status(httpStatusCode).json(jsonResponse);
      console.log("capture order");
    } catch (error) {
      console.error("Failed to create order:", error);
      res.status(500).json({ error: "Failed to capture order." });
    }
  });

  // Stripe
  app.post("/create-checkout-session", async (req, res) => {
    const {order} = req.body;
    console.log("order" + order);
    const productsID = Object.keys(order.products);
    console.log("productsID: " + productsID);
    const cartItem = await fetch(`http://localhost:5000/product/${productsID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json());
    const product = cartItem;
    console.log(product);
    const imageUrl = `http://localhost:5000${product.image.replace('product/', '')}`;
    const lineItems = [{
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          images: [imageUrl],
        },
        unit_amount: Math.round(product.price),
      },
      quantity: order.products[product.id],
  }]

  console.log( lineItems);
  
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `http://localhost:3000/success`,
      cancel_url: `http://localhost:3000`,
    });

    res.json({ id: session.id });
});

  // serve index.html
  app.get("/", (req, res) => {
    res.sendFile(path.resolve("./client/checkout.html"));
  });
};
