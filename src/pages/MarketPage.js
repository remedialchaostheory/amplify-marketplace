import React from "react";
import { API, graphqlOperation } from "aws-amplify";
import { getMarket } from "../graphql/queries";
import { input } from "@aws-amplify/ui";
import { Loading, Tabs, Icon } from "element-react";
import { Link } from "react-router-dom";
import NewProduct from "../components/NewProduct";
import Product from "../components/Product";

class MarketPage extends React.Component {
  state = {
    market: null,
    isLoading: true,
    isMarketOwner: false,
  };

  componentDidMount() {
    this.handleGetMarket();
  }

  handleGetMarket = async () => {
    const input = {
      id: this.props.marketId,
    };
    const resp = await API.graphql(graphqlOperation(getMarket, input));
    console.log({ resp });
    this.setState({ market: resp.data.getMarket, isLoading: false }, () => {
      this.checkMarketOwner();
    });
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
    const { market, isLoading, isMarketOwner } = this.state;

    return isLoading ? (
      <Loading fullscreen={true} />
    ) : (
      <>
        {/* Back button */}
        <Link className="link" to="/">
          Back to Markets List
        </Link>
        {/* Market Metadata */}
        <span className="items-center pt-2">
          <h2 className="mb-mr">{market.name}</h2>- {market.owner}
        </span>
        <div className="items-center pt-2">
          <span style={{ color: "var(--lightSquidInk)", paddingBottom: "1em" }}>
            <Icon name="date" className="icon" />
            {market.createdAt}
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
              <NewProduct marketId={this.props.marketId} />
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
            {/* <div className="product-list">
              {market.products.items.map(product => (
                <Product product={product} />
              ))}
            </div> */}
          </Tabs.Pane>
        </Tabs>
      </>
    );
  }
}

export default MarketPage;
