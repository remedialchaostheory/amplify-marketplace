import React from "react";
import { Auth, Hub } from 'aws-amplify';
import { Authenticator, AmplifyTheme } from "aws-amplify-react";
import "./App.css";

class App extends React.Component {
  state = {
    user: null,
  };

  componentDidMount() {
    this.getUserData();
    Hub.listen('auth', this, 'onHubCapsule');
  }

  getUserData = async () => {
    const user = await Auth.currentAuthenticatedUser();
    user ? this.setState({ user }) : this.setState({ user: null });
  };


  onHubCapsule = capsule => {
    switch (capsule.payload.event) {
      case "signIn":
        console.log('signed in');
        this.getUserData();
        break;
      case "signUp":
        console.log('signed up');
        break;
      case "signOut":
        console.log('signed out');
        this.setState({ user: null })
        break;
      default:
        return;
    }
  };

  render() {
    const { user } = this.state;

    return !user ? (
        <Authenticator theme={theme} />
    ) : <div>App</div>;
  }
}

const theme = {
  // ...AmplifyTheme,
  // button: {
  //   ...AmplifyTheme.button,
  //   backgroundColor: "var(--)"
  // }
};

// export default withAuthenticator(App, true , [], theme);
export default App;
