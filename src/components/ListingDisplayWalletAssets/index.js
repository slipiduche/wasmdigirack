import React, { useState } from "react";
import AssetCard from "../WalletAssetCardM";
import WalletAssetCard from "../../components/WalletAssetCard/WalletAssetCard";
//import "../../layouts/Explore/bulmacustom1.css"

const ListingDisplayWalletAssets = ({ walletAssets, state_wallet }) => {
  // search and filter
  const [searchText, setSearchText] = useState("");

  const searchingFor = (searchText) => {
    return (x) => {
      let return_this = false;

      if (x.details.onchainMetadata === null) {
        return false;
      }

      if (searchText === "") {
        return_this = true;
      } else if (
        searchText !== "" && x.details.onchainMetadata.name
          ? x.details.onchainMetadata.name
              .toLowerCase()
              .includes(searchText.toLowerCase())
          : false
      ) {
        return_this = true;
      }
      return return_this;
    };
  };

  let matchedtokens = walletAssets.filter(searchingFor(searchText));

  const filtered_listing = matchedtokens.map((this_nft, i) => {
    // return <AssetCard asset={this_nft} key={i} />;
    return (
      <div className="mx-4">
        <WalletAssetCard
          key={i}
          state_wallet={state_wallet}
          asset={this_nft}
          // assetM={assetMetadata}
          width={330}
        />
      </div>
    );
  });

  return (
    <div className="block">
      <div className="field is-grouped">
        <div className="control has-icons-left is-expanded">
          <input
            className="input"
            type="text"
            placeholder={"Search"}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <span className="icon is-small is-left">
            <i className="fa fa-search"></i>
          </span>
        </div>
        {/* <div className="control">
          <span className="select">
            <select
              value={sortby}
              onChange={(event) => setSortby(event.target.value)}
            >
              {sort_options.map((option, i) => {
                return (
                  <option value={option.value} key={i}>
                    {option.label}
                  </option>
                );
              })}
            </select>
          </span>
        </div> */}
      </div>

      <div className="columns is-multiline mt-4">{filtered_listing}</div>
    </div>
  );
};

export default ListingDisplayWalletAssets;
