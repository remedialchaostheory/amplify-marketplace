import React from "react";
import { Authenticator, AmplifyTheme } from "aws-amplify-react";
import { Auth, API, graphqlOperation } from "aws-amplify";
// prettier-ignore
import { Table, Button, Notification, MessageBox, Message, Tabs, Icon, Form, Dialog, Input, Card, Tag } from 'element-react'
import { convertCentsToDollars, formatOrderDate } from "../utils";
import { history } from "../App";

class SignInPage extends React.Component {
  state = {};

  render() {
    return (
      <Authenticator
        onStateChange={authState => {
          // TODO : save previous page and redirect back to it on sign in
          authState === "signedIn" && history.push("/");
        }}
      />
    );
  }
}

export default SignInPage;
