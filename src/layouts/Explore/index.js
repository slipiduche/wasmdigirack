import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";

import { get_listed_assets } from "../../store/collection/api";
import ListingDisplayListing from "../../components/ListingDisplayListing";
import { Spinner } from "react-spinner-animated";

import "react-spinner-animated/dist/index.css";

import "bulma-checkradio/dist/css/bulma-checkradio.min.css";

import "./style.css";

import "./bulma.css";

const Explore = () => {
  let firstTime = 0;
  const ITEMS_PER_PAGE = 5;
  const dispatch = useDispatch();
  const [isFetching, setIsFetching] = useState(false);
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [collections, setCollections] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, sethasMore] = useState(true);

  useEffect(() => {
    if (firstTime == 0) {
      //console.log("firstload");
      firstTime = 1;
    }
    // if (state_wallet.data) {
    //   console.log(state_wallet.data)

    // }
    // if (state_collection) {
    //   console.log(state_collection)

    // }

    if (!isFetching && listings.length === 0) {
      loadNext();
    }
  });

  const loadNext = () => {
    //console.log(`hasmore?:${hasMore}---isfetching?${isFetching}`);
    if (hasMore && !isFetching) {
      //console.log("next");
      setIsFetching(true);
      dispatch(
        get_listed_assets(ITEMS_PER_PAGE, page, (res) => {
          if (res.data) {
            //console.log(res.data);
            setListings([...listings, ...res.data]);
            setFilteredListings([...filteredListings, ...res.data]);
            sethasMore(res.data.length > 0);
            // console.log('aqui')
            // console.log(res.data.length)
            if (res.data.length > 0) {
              const nextPage = page + 1;
              //console.log(nextPage);
              setPage(nextPage);
            }

            let counter = 0;
            let list_collections = {};
            for (var i in res.data) {
              let this_listing = res.data[i];
              if ("id" in this_listing.collection) {
                list_collections[this_listing.collection.meta.name] = {
                  policy_ids: this_listing.collection.policy_ids,
                  label: this_listing.collection.meta.name,
                  rank:
                    "is_martify_verified" in this_listing.collection ? 1 : 2,
                  index: counter,
                };
              } else {
                list_collections[this_listing.collection.policy_id] = {
                  policy_ids: [this_listing.collection.policy_id],
                  label: this_listing.collection.policy_id,
                  rank: 3,
                  index: counter,
                };
              }
              counter += 1;
            }

            setCollections({
              ...collections,
              ...list_collections,
            });
            setIsFetching(false);
          }
        })
      );
    }
  };

  return (
    <div className="bg-white">
      <div className="h-[1vh] wallet_assets_container">
        <div className="flex flex-col items-center w-full">
          <h1 className="text-center font-bold text-xl sm:text-2xl lg:text-3xl max-w-[27ch] mb-4">
            Marketplace
          </h1>
        </div>
      </div>
      <div className="section explore">
        <div className="columns">
          {/* <div className="column is-one-quarter-tablet one-fifth-desktop is-one-fifth-widescreen is-one-fifth-fullhd">
            <Filter
              collections={collections}
              listings={listings}
              setFilteredListings={setFilteredListings}
            />
          </div> */}
          <div className="column">
            {/* <ListingSection
              listings={filteredListings}
              isFetching={isFetching}
            /> */}
            <div className="column">
              {isFetching && page == 1 ? (
                <section className="hero is-medium">
                  <div className="hero-body">
                    <div className="flex flex-col items-center w-full">
                      <div className="container has-text-centered">
                        <Spinner center={false} speed={5} text={"Loading..."} />
                      </div>
                    </div>
                  </div>
                </section>
              ) : (
                <InfiniteScroll
                  className="infinite-scroll-container"
                  dataLength={listings.length}
                  next={loadNext}
                  hasMore={hasMore}
                  loader={
                    <progress
                      className="progress is-small is-primary"
                      max="100"
                    ></progress>
                  }
                  endMessage={
                    <div style={{ textAlign: "center" }}>
                      <span className="icon has-text-info">
                        <i className="fas fa-info-circle"></i>
                      </span>
                      <b>Yay! You have seen it all</b>
                    </div>
                  }
                  scrollableTarget="body"
                >
                  <ListingSection listings={filteredListings} />
                </InfiniteScroll>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Filter = ({ collections, listings, setFilteredListings }) => {
  const [collectionsMultiSelect, setCollectionsMultiSelect] = useState(false);
  const [collectionsIndexSelected, setCollectionsIndexSelected] = useState([]);
  const [collectionsSelected, setCollectionsSelected] = useState({});
  const [searchText, setSearchText] = useState("");

  function click_item(collection) {
    let tmp_collectionsSelected = { ...collectionsSelected };
    let tmp_collectionsIndexSelected = [...collectionsIndexSelected];

    if (tmp_collectionsIndexSelected.includes(collection.index)) {
      var index = tmp_collectionsIndexSelected.indexOf(collection.index);
      if (index !== -1) {
        tmp_collectionsIndexSelected.splice(index, 1);
        delete tmp_collectionsSelected[collection.index];
      }
    } else {
      tmp_collectionsIndexSelected.push(collection.index);
      tmp_collectionsSelected[collection.index] = collection;
    }

    if (Object.keys(tmp_collectionsSelected).length > 0) {
      let list_policy = [];
      for (let i in tmp_collectionsSelected) {
        list_policy.push(...tmp_collectionsSelected[i].policy_ids);
      }

      // filter listings
      let tmp_listings = [];
      for (let i in listings) {
        let this_listing = listings[i];
        if (list_policy.includes(this_listing.details.policyId)) {
          tmp_listings.push(this_listing);
        }
      }
      setFilteredListings(tmp_listings);
    } else {
      setFilteredListings(listings);
    }

    setCollectionsSelected(tmp_collectionsSelected);
    setCollectionsIndexSelected(tmp_collectionsIndexSelected);
    setCollectionsMultiSelect(tmp_collectionsIndexSelected.length > 0);
  }

  const searchingFor = (searchText) => {
    return (x) => {
      let return_this = false;
      if (searchText === "") {
        return_this = true;
      } else if (searchText !== "") {
        if (x.policy_ids.includes(searchText)) {
          return_this = true;
        }
        if (x.label.toLowerCase().includes(searchText.toLowerCase())) {
          return_this = true;
        }
      }
      return return_this;
    };
  };

  let matchCollections = Object.keys(collections)
    .map(function (key, index) {
      return collections[key];
    })
    .filter(searchingFor(searchText));

  return (
    <div className="card filter">
      <header className="card-header">
        <p className="card-header-title">Collections</p>
      </header>
      <div className="card-content">
        <div className="content">
          <div className="field">
            <div className="control has-icons-left">
              <input
                className="input"
                type="text"
                placeholder={"Filter"}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-search fa-xs"></i>
              </span>
            </div>
          </div>
          {matchCollections
            .sort((a, b) => {
              return a.rank - b.rank;
            })
            .map((this_collection, i) => {
              return (
                <div className="field" key={i}>
                  {collectionsMultiSelect ? (
                    <>
                      <input
                        className="is-checkradio"
                        id={this_collection.label}
                        type="checkbox"
                        checked={collectionsIndexSelected.includes(
                          this_collection.index
                        )}
                        onChange={() => click_item(this_collection)}
                      />
                      <label
                        className="filter_label"
                        htmlFor={this_collection.label}
                      >
                        {this_collection.label}
                      </label>
                    </>
                  ) : (
                    <label
                      className="filter_label"
                      onClick={() => click_item(this_collection)}
                    >
                      {this_collection.label}
                    </label>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

const ListingSection = ({ listings, isFetching }) => {
  return (
    <>
      {isFetching ? (
        <section className="hero is-medium">
          <div className="hero-body">
            <div className="container has-text-centered">
              <Spinner center={false} speed={5} text={"Loading..."} />
            </div>
          </div>
        </section>
      ) : listings.length > 0 ? (
        <ListingDisplayListing listings={listings} />
      ) : (
        <section className="hero is-medium">
          <div className="hero-body">
            <div className="container has-text-centered">
              <h1>
                <span
                  className="icon"
                  style={{ fontSize: "100px", marginBottom: "50px" }}
                >
                  <i className="far fa-times-circle"></i>
                </span>
              </h1>
              <p className="title">No Assets</p>
              <p className="subtitle">No Assets Listed on the Market.</p>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Explore;
