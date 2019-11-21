import React from "react";
import { graphqlOperation } from "aws-amplify";
import { Connect } from "aws-amplify-react";
import { Link } from "react-router-dom";
import { Loading, Card, Icon, Tag } from "element-react";
import { listMarkets } from "../graphql/queries";
import { onCreateMarket } from "../graphql/subscriptions";
import Error from "./Error";

const MarketList = ({ searchResults }) => {
  const onNewMarket = (prevQuery, newData) => {
    let updatedQuery = { ...prevQuery };
    const updatedMarketList = [
      newData.onCreateMarket,
      ...prevQuery.listMarkets.items,
    ];
    updatedQuery.listMarkets.items = updatedMarketList;
    return updatedQuery;
  };
  return (
    <Connect
      query={graphqlOperation(listMarkets)}
      subscription={graphqlOperation(onCreateMarket)}
      onSubscriptionMsg={onNewMarket}
    >
      {({ data, loading, errors }) => {
        if (errors.length > 0) return <Error errors={errors} />;
        if (loading || !data.listMarkets) return <Loading fullscreen={true} />;
        const markets =
          searchResults.length > 0 ? searchResults : data.listMarkets.items;
        // console.log("markets ->", markets);
        return (
          <>
            {searchResults.length > 0 ? (
              <h2 className="text-green">
                <Icon type="success" name="check" className="icon" />
                {searchResults.length} Results
              </h2>
            ) : (
              <h2 className="header">
                <img
                  src="https://icon.now.sh/store_mall_directory/527FFF"
                  alt="Store Icon"
                  className="large-icon"
                />
                Markets
              </h2>
            )}
            <div className="markets-container">
              {markets.map(market => (
                <div key={market.id} className="my-2">
                  <Card
                    bodyStyle={{
                      display: "grid",
                      padding: "1em",
                      alignItems: "center",
                      justifyContent: "space-between",
                      rowGap: "2rem",
                    }}
                  >
                    <div>
                      <span className="flex">
                        <Link className="link" to={`/markets/${market.id}`}>
                          {market.name}
                        </Link>
                        <span style={{ color: "var(--darkAmazonOrange)" }}>
                          {market.products.length}
                        </span>
                        <img
                          src="https://icon.now.sh/shopping_cart/f60"
                          alt="Shopping Cart"
                        />
                      </span>
                      <div
                        style={{
                          color: "var(--lightSquidInk",
                          fontSize: "12px",
                        }}
                      >
                        {market.owner}
                      </div>
                    </div>
                    <div>
                      {market.tags &&
                        market.tags.map(tag => (
                          <Tag key={tag} className="mr-1 light-grey">
                            {tag}
                          </Tag>
                        ))}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </>
        );
      }}
    </Connect>
  );
};

export default MarketList;
