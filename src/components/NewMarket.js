import React from "react";
// prettier-ignore
import { API, graphqlOperation } from "aws-amplify";
import { createMarket } from "../graphql/mutations";
import { Form, Button, Dialog, Input, Select, Notification } from 'element-react'

class NewMarket extends React.Component {
  state = {
    name: "",
    addMarketDialog: false,
  };

  handleAddMarket = async () => {
  };
  render() {
    return (
        <React.Fragment>
          <div className="market-header">
            <h1 className="market-title">
              Create your own Marketplace
              <Button
                  type="text"
                  icon="edit"
                  className="market-title-button"
                  onClick={() => this.setState({ addMarketDialog: true })}
              />

            </h1>
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
                  />
                </Form.Item>
              </Form>
            </Dialog.Body>
            <Dialog.Footer>
              <Button onClick={() => this.setState({ addMarketDialog: false })}>
                Cancel
              </Button>
              <Button
                  type="primary"
                  disabled={!this.state.name}
                  onClick={this.handleAddMarket}
              >
                Add
              </Button>
            </Dialog.Footer>
          </Dialog>
        </React.Fragment>
    )
  }
}

export default NewMarket;
