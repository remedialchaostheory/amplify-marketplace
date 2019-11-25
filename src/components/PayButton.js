import React from "react";
import { API, graphqlOperation } from "aws-amplify";
import { getUser } from "../graphql/queries";
import StripeCheckout from "react-stripe-checkout";
// import { Notification, Message } from "element-react";

const stripeConfig = {
  currency: "USD",
  publishableAPIKey: "pk_test_Sh2VtPNSbsjWAzzu6PAOpg3H00untteNHo",
};

const PayButton = ({ product, user }) => {
  const getOwnerEmail = async ownerId => {
    try {
      const input = { id: ownerId };
      const resp = await API.graphql(graphqlOperation(getUser, input));
      return resp.data.getUser.email;
    } catch (err) {
      console.error(`Error fetching product owner's email`, err);
    }
  };

  const handleCharge = async token => {
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
            customerEmail: user.attributes.email,
            ownerEmail,
            shipped: product.shipped,
          },
        },
      });
      console.log("resp ->", resp);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <StripeCheckout
      token={handleCharge}
      email={user.attributes.email}
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
