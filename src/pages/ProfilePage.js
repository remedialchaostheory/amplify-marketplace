import React from "react";
import { API, graphqlOperation } from "aws-amplify";
// prettier-ignore
import { Table, Button, Notification, MessageBox, Message, Tabs, Icon, Form, Dialog, Input, Card, Tag } from 'element-react'
import { convertCentsToDollars } from "../utils";

const getUser = `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    username
    email
    registered
    orders(sortDirection: DESC, limit: 999) {
      items {
        id
        createdAt
        product {
          id
          owner
          price
          createdAt
          description
        }
        shippingAddress {
          city
          country
          address_line1
          address_state
          address_zip
        }
      }
      nextToken
    }
  }
}
`;

class ProfilePage extends React.Component {
  state = {
    orders: [],
    columns: [
      { prop: "name", width: "150" },
      { prop: "value", width: "330" },
      {
        prop: "tag",
        width: "150",
        render: row => {
          if (row.name === "Email") {
            const emailVerified = this.props.userAttributes.email_verified;
            return emailVerified ? (
              <Tag type="success">Verfied</Tag>
            ) : (
              <Tag type="danger">Unverfied</Tag>
            );
          }
        },
      },
      {
        prop: "operations",
        render: row => {
          switch (row.name) {
            case "Email":
              return (
                <Button type="info" size="small">
                  Edit
                </Button>
              );
            case "Delete Profile":
              return (
                <Button type="danger" size="small">
                  Delete
                </Button>
              );
            default:
              return;
          }
        },
      },
    ],
  };

  componentDidMount() {
    if (this.props.userAttributes) {
      console.log("props user ->", this.props.user);
      console.log(
        "this.props.userAttributes.sub ->",
        this.props.userAttributes.sub,
      );
      this.getUserOrders(this.props.userAttributes.sub);
    }
  }

  getUserOrders = async userId => {
    const input = { id: userId };
    console.log("input ->", input);
    const resp = await API.graphql(graphqlOperation(getUser, input));
    console.log("resp ->", resp);
    this.setState({ orders: resp.data.getUser.orders.items });
  };

  render() {
    const { orders, columns } = this.state;
    const { user, userAttributes } = this.props;
    return userAttributes && (
      <>
        <Tabs activeName="1" className="profile-tabs">
          <Tabs.Pane
            label={
              <>
                <Icon name="document" className="icon" />
                Summary
              </>
            }
            name="1"
          >
            <h2 className="header">Profile Summary</h2>
            <Table
              columns={columns}
              data={[
                {
                  name: "Your Id",
                  value: userAttributes.sub,
                },
                {
                  name: "Username",
                  value: user.username,
                },
                {
                  name: "Email",
                  value: userAttributes.email,
                },
                {
                  name: "Phone Number",
                  value: userAttributes.phone_number,
                },
                {
                  name: "Delete Profile",
                  value: "Sorry to see you go",
                },
              ]}
              showHeader={false}
              rowClassName={row =>
                row.name === "Delete Profile" && "delete-profile"
              }
            />
          </Tabs.Pane>

          <Tabs.Pane
            label={
              <>
                <Icon name="message" className="icon" />
                Orders
              </>
            }
            name="2"
          >
            <h2 className="header">Order History</h2>

            {orders.map(order => (
              <div className="mb-1" key={order.id}>
                <Card>
                  <pre>
                    <p>Order Id: {order.id}</p>
                    <p>Product Description: {order.product.description}</p>
                    <p>Price: ${convertCentsToDollars(order.product.price)}</p>
                    <p>Purchased on {order.createdAt}</p>
                    {order.shippingAddress && (
                      <>
                        Shipping Address
                        <div className="ml-2">
                          <p>{order.shippingAddress.address_line1}</p>
                          <p>
                            {order.shippingAddress.city},
                            {order.shippingAddress.address_state}
                            {order.shippingAddress.country}
                            {order.shippingAddress.address_zip}
                          </p>
                        </div>
                      </>
                    )}
                  </pre>
                </Card>
              </div>
            ))}
          </Tabs.Pane>
        </Tabs>
      </>
    );
  }
}

export default ProfilePage;
