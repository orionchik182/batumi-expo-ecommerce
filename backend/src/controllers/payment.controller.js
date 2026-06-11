import { ENV } from "../config/env.js";
import Stripe from "stripe";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY);

export async function createPaymentIntent(req, res) {
  try {
    const { cartItems, shippingAddress } = req.body;
    const user = req.user;

    // Validate cart items
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Calculate total from server-side (don't trust client - ever!)
    let subtotal = 0;
    const validatedItems = [];

    for (const item of cartItems) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        return res
          .status(404)
          .json({ error: `Product not found: ${item.product.name}` });
      }
      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ error: `Not enough stock for ${product.name}` });
      }

      subtotal += product.price * item.quantity;

      validatedItems.push({
        product: product._id.toString(),
        name: product.name,
        image: product.images[0],
        quantity: item.quantity,
        price: product.price,
      });
    }

    const tax = subtotal * 0.08;
    const shipping = 10.0;
    const total = subtotal + tax + shipping;

    if (total <= 0) {
      return res
        .status(400)
        .json({ error: "Total amount must be greater than 0" });
    }

    // find or create stripe customer
    let customer;
    if (user.stripeCustomerId) {
      // find the customer
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    } else {
      // create the customer
      customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user._id.toString(),
          clerkId: user.clerkId,
        },
      });
      await User.findByIdAndUpdate(user._id, {
        stripeCustomerId: customer.id,
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // convert to cents
      currency: "usd",
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        clerkId: user.clerkId,
        userId: user._id.toString(),
        orderItems: JSON.stringify(validatedItems),
        shippingAddress: JSON.stringify(shippingAddress),
        totalPrice: total.toFixed(2),
      },
      // in the webhooks section we will use this metadata
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Payment Intent Creation Error:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
}

export async function handleStripeWebhook(req, res) {
  const signature = req.headers["stripe-signature"];
  let event;

  if (!signature) {
    return res.status(400).send("Missing stripe-signature header");
  }

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      ENV.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook verification failed: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    console.log("Payment Intent Succeeded:", paymentIntent.id);

    try {
      const { clerkId, userId, orderItems, shippingAddress, totalPrice } =
        paymentIntent.metadata;

      // Check if order already exists (prevent duplicates)
      const existingOrder = await Order.findOne({
        "paymentResult.id": paymentIntent.id,
      });
      if (existingOrder) {
        console.log("Order already exists", paymentIntent.id);
        return res.json({ received: true });
      }

      // create order
      const order = await Order.create({
        user: userId,
        clerkId,
        orderItems: JSON.parse(orderItems),
        shippingAddress: JSON.parse(shippingAddress),
        paymentResult: {
          id: paymentIntent.id,
          status: "succeeded",
        },
        totalPrice: parseFloat(totalPrice),
      });

      // update product stock
      const items = JSON.parse(orderItems);
      for (const item of items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }

      console.log("Order created successfully", order._id);
    } catch (error) {
      console.error("Error creating order from webhook:", error);
      return res.status(500).json({ error: "Failed to process webhook" });
    }
  }
  res.json({ received: true });
}
