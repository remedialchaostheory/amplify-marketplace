import React from "react";
import { Authenticator } from "aws-amplify-react";
import { Notification } from "element-react";
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
