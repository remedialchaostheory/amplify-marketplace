import React from "react";
import { API, graphqlOperation } from "aws-amplify";
import { createMarket } from "../graphql/mutations";
// prettier-ignore
import { Form, Button, Dialog, Input, Select, Notification, } from "element-react";
import { UserContext } from "../App";
import "./NewMarket.css";

class NewMarket extends React.Component {
  // TODO: add custom tags which will add to a table for later querying the current list
  state = {
    name: "",
    tags: [
      "Arts",
      "Animals",
      "Crafts",
      "Cute",
      "Entertainment",
      "Learning",
      "Music",
      "Technology",
    ],
    selectedTags: [],
    options: [],
    addMarketDialog: false,
  };

  handleAddMarket = async user => {
    try {
      console.log(this.state.name);
      // console.log("user ->", user);
      this.setState({ addMarketDialog: false });
      const input = {
        name: this.state.name,
        tags: this.state.selectedTags,
        owner: user.attributes.email,
      };
      const resp = await API.graphql(graphqlOperation(createMarket, { input }));
      console.log({ resp });
      console.info(`Created market: id ${resp.data.createMarket.id}`);
      this.setState({ name: "", selectedTags: [] });
    } catch (err) {
      console.error("Error adding new market", err);
      Notification.error({
        title: "Error",
        message: `${err.message || "Error adding market"}`,
      });
    }
  };

  handleFilterTags = query => {
    const options = this.state.tags
      .map(tag => ({ value: tag, label: tag }))
      .filter(tag => tag.label.toLowerCase().includes(query.toLowerCase()));
    this.setState({ options });
  };

  handleNewMarketButton = user => {
    if (user) {
      this.setState({ addMarketDialog: true });
    } else {
      Notification({
        title: "Sign in",
        message: "Please sign in before adding a new market",
        type: "info",
      });
    }
  };

  render() {
    return (
      <UserContext.Consumer>
        {({ user }) => (
          <>
            <div className="market-header">
              <h1 className="market-title">Welcome to Marketplace</h1>

              <div className="NewMarket-search-container">
                <Form
                  inline={true}
                  onSubmit={this.props.handleSearch}
                  className="NewMarket-search-form"
                >
                  <Form.Item>
                    <Input
                      placeholder="Search Markets..."
                      value={this.props.searchTerm}
                      className="search-field"
                      icon="circle-cross"
                      onIconClick={this.props.handleClearSearch}
                      onChange={this.props.handleSearchChange}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="info"
                      icon="search"
                      className="search-icon"
                      onClick={this.props.handleSearch}
                      loading={this.props.isSearching}
                    />
                  </Form.Item>
                </Form>
                <span className="add-market-button">
                  <Button
                    type="text"
                    icon="plus"
                    className="add-market-button"
                    onClick={() => this.handleNewMarketButton(user)}
                  >
                    New
                  </Button>
                </span>
              </div>
            </div>

            <Dialog
              title="Create New Market"
              visible={this.state.addMarketDialog}
              onCancel={() => this.setState({ addMarketDialog: false })}
              size="large"
              customClass="dialog"
            >
              <Dialog.Body>
                <Form labelPosition="top">
                  <Form.Item label="Add Market Name">
                    <Input
                      placeholder="Market Name"
                      trim={true}
                      onChange={name => this.setState({ name })}
                      value={this.state.name}
                    />
                  </Form.Item>
                  <Form.Item label="Add Tags">
                    <Select
                      multiple={true}
                      filterable={true}
                      placeholder="Market Tags"
                      onChange={selectedTags => this.setState({ selectedTags })}
                      remoteMethod={this.handleFilterTags}
                      remote={true}
                    >
                      {this.state.options.map(option => (
                        <Select.Option
                          key={option.value}
                          label={option.label}
                          value={option.value}
                        />
                      ))}
                    </Select>
                  </Form.Item>
                </Form>
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  onClick={() => this.setState({ addMarketDialog: false })}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  disabled={!this.state.name}
                  onClick={() => this.handleAddMarket(user)}
                >
                  Add
                </Button>
              </Dialog.Footer>
            </Dialog>
          </>
        )}
      </UserContext.Consumer>
    );
  }
}

export default NewMarket;
