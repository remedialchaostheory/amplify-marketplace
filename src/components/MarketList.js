import React from "react";
import { graphqlOperation } from 'aws-amplify';
import { Connect } from 'aws-amplify-react';
import { listMarkets } from "../graphql/queries";
import { Loading, Card, Icon, Tag } from "element-react";
import { Link } from 'react-router-dom';
import Error from "./Error";

const MarketList = () => {
  return (
      <Connect
        query={graphqlOperation(listMarkets)}
      >
        {({data, loading, errors }) => {
          if (errors.length > 0) return <Error errors={errors} />;
          if (loading || !data.listMarkets) return <Loading fullscreen={true} />;
          console.log('data ->', data);
          return (
              <>
                <h2 className="header">
                  <img src="https://icon.now.sh/store_mall_director/527FFF"
                       alt="Store Icon"
                       className="large-icon"
                  />
                  Markets
                </h2>
                {data.listMarkets.items.map(market => (
                    <div key={market.id} className="my-2">
                      <Card
                          bodyStyle={{
                            padding: '0.7em',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                      >
                        <div>
                          <span className="flex">
                            <Link className="link" to={`/markets/${market.id}`}>
                              {market.name}
                            </Link>
                            <span style={{ color: 'var(--darkAmazonOrange)' }}>
                              {market.products.length}
                            </span>
                            <img src="https://icon.now.sh/shopping_cart/f60" alt="Shopping Cart" />
                          </span>
                          <div style={{ color: 'var(--lightSquidInk' }}>
                            {market.owner}
                          </div>
                        </div>
                        <div>
                          {market.tags && market.tags.map(tag => (
                              <Tag key={tag} type="danger" className="mx-1">
                                {tag}
                              </Tag>
                          ))}
                        </div>
                      </Card>
                    </div>
                ))}
              </>
          )
        }}
      </Connect>
  )
};

export default MarketList;
