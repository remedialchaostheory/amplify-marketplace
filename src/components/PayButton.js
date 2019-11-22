import React from "react";
import StripeCheckout from "react-stripe-checkout";
// import { Notification, Message } from "element-react";

const stripeConfig = {
  currency: "USD",
  publishableAPIKey: "pk_test_Sh2VtPNSbsjWAzzu6PAOpg3H00untteNHo",
};

const PayButton = () => {
  return (
    <StripeCheckout
      currency={stripeConfig.currency}
      stripeKey={stripeConfig.publishableAPIKey}
    />
  );
};

export default PayButton;
