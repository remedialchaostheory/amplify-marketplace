import React from "react";
import { API, graphqlOperation } from "aws-amplify";
// prettier-ignore
import { onCreateProduct, onUpdateProduct, onDeleteProduct } from "../graphql/subscriptions";
import { input } from "@aws-amplify/ui";
import { Loading, Tabs, Icon } from "element-react";
import { Link } from "react-router-dom";
import NewProduct from "../components/NewProduct";
import Product from "../components/Product";
import { formatProductDate } from "../utils";

const getMarket = `query GetMarket($id: ID!) {
  getMarket(id: $id) {
    id
    name
    products(sortDirection: DESC, limit: 999) {
      items {
        id
        description
        price
        shipped
        owner
        file {
          key
        }
        createdAt
      }
      nextToken
    }
    tags
    owner
    createdAt
  }
}
`;

class MarketPage extends React.Component {
  state = {
    market: null,
    isLoading: true,
    isMarketOwner: false,
    isEmailVerified: false,
  };

  componentDidMount() {
    this.handleGetMarket();
    if (this.props.user) {
      console.log("creating subscriptions");
      this.createSubscriptions();
    }
  }

  componentWillUnmount() {
    if (this.props.user) {
      this.createProductListener.unsubscribe();
      this.updateProductListener.unsubscribe();
      this.deleteProductListener.unsubscribe();
    }
  }

  createSubscriptions = () => {
    const { user } = this.props;
    const userId = user.attributes.sub;
    const input = {
      owner: userId,
    };
    console.log("{ input} ->", { input });

    this.createProductListener = API.graphql(
      graphqlOperation(onCreateProduct, input),
    ).subscribe({
      next: productData => {
        const createdProduct = productData.value.data.onCreateProduct;
        const prevProducts = this.state.market.products.items.filter(
          item => item.id !== createdProduct.id,
        );
        const updatedProducts = [createdProduct, ...prevProducts];
        const market = { ...this.state.market };
        market.products.items = updatedProducts;
        this.setState({ market });
      },
    });

    this.updateProductListener = API.graphql(
      graphqlOperation(onUpdateProduct, input),
    ).subscribe({
      next: productData => {
        const updatedProduct = productData.value.data.onUpdateProduct;
        const updatedProductIndex = this.state.market.products.items.findIndex(
          item => item.id === updatedProduct.id,
        );
        const updatedProducts = [
          ...this.state.market.products.items.slice(0, updatedProductIndex),
          updatedProduct,
          ...this.state.market.products.items.slice(updatedProductIndex + 1),
        ];
        const market = { ...this.state.market };
        market.products.items = updatedProducts;
        this.setState({ market });
      },
    });

    this.deleteProductListener = API.graphql(
      graphqlOperation(onDeleteProduct, input),
    ).subscribe({
      next: productData => {
        const deletedProduct = productData.value.data.onDeleteProduct;
        const updatedProducts = this.state.market.products.items.filter(
          item => item.id !== deletedProduct.id,
        );
        const market = { ...this.state.market };
        market.products.items = updatedProducts;
        this.setState({ market });
      },
    });
  };

  handleGetMarket = async () => {
    const input = {
      id: this.props.marketId,
    };
    const resp = await API.graphql(graphqlOperation(getMarket, input));
    console.log({ resp });
    this.setState({ market: resp.data.getMarket, isLoading: false }, () => {
      this.checkMarketOwner();
      this.checkEmailVerified();
    });
  };

  checkEmailVerified = params => {
    const { userAttributes } = this.props;
    if (userAttributes) {
      this.setState({ isEmailVerified: userAttributes.email_verified });
    }
  };

  checkMarketOwner = () => {
    const { user } = this.props;
    const { market } = this.state;
    if (user) {
      console.log("market ->", market);
      console.log("user ->", user);
      this.setState({ isMarketOwner: user.attributes.email === market.owner });
    }
  };

  render() {
    const { market, isLoading, isMarketOwner, isEmailVerified } = this.state;
    const { userAttributes } = this.props;

    return isLoading ? (
      <Loading fullscreen={true} />
    ) : (
      <>
        {/* Back button */}
        <Link className="link" to="/">
          Back to Markets List
        </Link>
        {/* Market Metadata */}
        <div className="MarketPage-heading">
          <span className="items-center pt-2">
            <h2 className="MarketPage-heading-title">{market.name}</h2>
          </span>
          <p className="MarketPage-heading-owner" style={{ fontWeight: "300" }}>
            by {market.owner}
          </p>
        </div>
        <div className="items-center pt-2">
          <span
            style={{
              color: "var(--lightSquidInk)",
              paddingBottom: "1em",
            }}
          >
            <Icon name="date" className="icon" />
            {formatProductDate(market.createdAt)}
          </span>
        </div>

        {/* New Product */}
        <Tabs type="border-card" value={isMarketOwner ? "1" : "2"}>
          {isMarketOwner && (
            <Tabs.Pane
              label={
                <>
                  <Icon name="plus" className="icon" />
                  Add Product
                </>
              }
              name="1"
            >
              {isEmailVerified ? (
                <NewProduct
                  marketId={this.props.marketId}
                  userId={userAttributes.sub}
                />
              ) : (
                <Link to="/profile" className="header">
                  Verify Your Email Before Adding Products
                </Link>
              )}
            </Tabs.Pane>
          )}

          {/* Product List */}
          <Tabs.Pane
            label={
              <>
                <Icon name="menu" className="icon" />
                Products ({market.products.items.length})
              </>
            }
            name="2"
          >
            <div className="product-list">
              {market.products.items.map(product => (
                <Product key={product.id} product={product} />
              ))}
            </div>
          </Tabs.Pane>
        </Tabs>
      </>
    );
  }
}

export default MarketPage;
