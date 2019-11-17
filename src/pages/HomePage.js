import React from "react";
import { API, graphqlOperation } from 'aws-amplify';
import { searchMarkets } from "../graphql/queries";
import NewMarket from "../components/NewMarket";
import MarketList from "../components/MarketList";

class HomePage extends React.Component {
  state = {
    searchTerm: "",
    searchResults: [],
    isSearching: false,
  };

  handleSearchChange = searchTerm => this.setState({ searchTerm });

  handleClearSearch = () => this.setState( { searchTerm: "", searchResults: [] });

  handleSearch = async event => {
    try {
      event.preventDefault();
      this.setState({ isSearching: true });
      const resp = await API.graphql(graphqlOperation(searchMarkets, {
        filter: {
          or: [
            { name: { matchPhrasePrefix: this.state.searchTerm } },
            { owner: { matchPhrasePrefix: this.state.searchTerm } },
            { tags: { matchPhrasePrefix: this.state.searchTerm } },
          ]
        },
        // sort: {
        //   field: "createdAt",
        //   direction: "desc",
        // }
      }));
      console.log('resp ->', resp);
      this.setState({
        searchResults: resp.data.searchMarkets.items,
        isSearching: false,
      });
    } catch (err) {
      console.error(err);
    }
  };
  render() {
    return (
        <React.Fragment>
          <NewMarket
              searchTerm={this.state.searchTerm}
              isSearching={this.state.isSearching}
              handleSearchChange={this.handleSearchChange}
              handleClearSearch={this.handleClearSearch}
              handleSearch={this.handleSearch}
          />
          <MarketList searchResults={this.state.searchResults}/>
        </React.Fragment>
    )
  }
}

export default HomePage;
