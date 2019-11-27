import React from "react";
import { Authenticator, AmplifyTheme } from "aws-amplify-react";
import { Auth, API, graphqlOperation } from "aws-amplify";
// prettier-ignore
import { Table, Button, Notification, MessageBox, Message, Tabs, Icon, Form, Dialog, Input, Card, Tag } from 'element-react'
import { convertCentsToDollars, formatOrderDate } from "../utils";
import { history } from "../App";

class SignInPage extends React.Component {
  state = { signedIn: false };

  handleSignIn = authState => {
    // TODO: feature - save previous page and redirect back to it on sign in
    if (authState === "signedIn") {
      this.setState({ signedIn: true });
      if (this.state.signedIn) {
        Notification({
          title: "Success",
          message: "Sign in successful",
          type: "success",
        });
      }
      history.push("/");
    }
  };

  render() {
    return (
      <Authenticator
        onStateChange={authState => this.handleSignIn(authState)}
      />
    );
  }
}

export default SignInPage;
