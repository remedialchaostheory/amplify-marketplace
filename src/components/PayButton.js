import React from "react";
import { API, graphqlOperation } from "aws-amplify";
import { getUser } from "../graphql/queries";
import { createOrder } from "../graphql/mutations";
import StripeCheckout from "react-stripe-checkout";
import { Notification, Message } from "element-react";
import { history } from "../App";

const stripeConfig = {
  currency: "USD",
  publishableAPIKey: "pk_test_Sh2VtPNSbsjWAzzu6PAOpg3H00untteNHo",
};

// TODO: Add dialog ? to indicate that nothing will be sent to user
const PayButton = ({ product, userAttributes }) => {
  const getOwnerEmail = async ownerId => {
    try {
      const input = { id: ownerId };
      const resp = await API.graphql(graphqlOperation(getUser, input));
      return resp.data.getUser.email;
    } catch (err) {
      console.error(`Error fetching product owner's email`, err);
    }
  };

  const createShippingAddress = source => ({
    city: source.address_city,
    country: source.address_country,
    address_line1: source.address_line1,
    address_state: source.address_state,
    address_zip: source.address_zip,
  });

  const handleCharge = async token => {
    // TODO : fix bug where charge will fail if address_state is not supplied (e.g. some countries outside of USA)
    try {
      const ownerEmail = await getOwnerEmail(product.owner);
      console.log("ownerEmail ->", ownerEmail);
      const resp = await API.post("orderlambda", "/charge", {
        body: {
          token,
          charge: {
            currency: stripeConfig.currency,
            amount: product.price,
            description: product.description,
          },
          email: {
            customerEmail: userAttributes.email,
            ownerEmail,
            shipped: product.shipped,
          },
        },
      });
      console.log("resp ->", resp);
      if (resp.charge.status === "succeeded") {
        let shippingAddress = null;
        if (product.shipped) {
          console.log("product.shipped ->", product.shipped);
          shippingAddress = createShippingAddress(resp.charge.source);
        }
        console.log("shippingAddress ->", shippingAddress);
        const input = {
          orderUserId: userAttributes.sub,
          orderProductId: product.id,
          shippingAddress,
        };
        console.log("input ->", input);
        const order = await API.graphql(
          graphqlOperation(createOrder, { input }),
        );
        console.log("order ->", order);
        Notification({
          title: "Success",
          message: `${resp.message}`,
          type: "success",
          duration: 3000,
        });
        setTimeout(() => {
          history.push("/");
          Message({
            type: "info",
            message: "Check your verified email for order details",
            duration: 5000,
            showClose: true,
          });
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      Notification.error({
        title: "Error",
        message: `${err.message || "Error processing order"}`,
      });
    }
  };

  return (
    <StripeCheckout
      token={handleCharge}
      email={userAttributes.email}
      name={product.description}
      amount={product.price}
      currency={stripeConfig.currency}
      stripeKey={stripeConfig.publishableAPIKey}
      shippingAddress={product.shipped}
      billingAddress={product.shipped}
      locale="auto"
      allowRememberMe={false}
    />
  );
};

export default PayButton;
