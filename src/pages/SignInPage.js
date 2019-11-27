import React from "react";
import { Authenticator, AmplifyTheme } from "aws-amplify-react";
import { Auth, API, graphqlOperation } from "aws-amplify";
// prettier-ignore
import { Table, Button, Notification, MessageBox, Message, Tabs, Icon, Form, Dialog, Input, Card, Tag } from 'element-react'
import { convertCentsToDollars, formatOrderDate } from "../utils";

class SignInPage extends React.Component {
  state = {};

  render() {
    return (
      <div>
        Sign in here
        <Authenticator />
      </div>
    );
  }
}

export default SignInPage;
