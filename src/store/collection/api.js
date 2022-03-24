import {
  collections_loaded,
  collections_add_tokens,
  collections_loading,
  collections_add_assets,
} from "./collectionActions";
import { set_error } from "../error/errorActions";
import { resolveError } from "../../utils/resolver";

import data_collections from "../../data/collections.json";
import data_collections_cnft from "../../data/collections-cnft.json";
import { contractAddress } from "../../cardano/market-contract/validator";

import {
  getAsset,
  getAssets,
  saveAsset,
  getCollectionAssets,
  getLockedAssets,
} from "../../database/assets";
import {
  getLockedUtxos,
  getAssetDetails,
  getTxMetadata,
  getLockedUtxosByAsset,
} from "../../cardano/blockfrost-api";
import Cardano from "../../cardano/serialization-lib/index";
import {
  assetsToValue,
  fromAscii,
  fromHex,
  getSellOffer,
  lovelacePercentage,
  toBytesNum,
  toHex,
  fromBech32,
  arrayToBytes,
} from "../../utils/converter";

export const load_collection = (callback) => async (dispatch) => {
  let all_collections = {};

  for (let collection_id in data_collections) {
    let tmp = data_collections[collection_id];
    tmp.is_martify_verified = true;

    if (tmp.style) {
      if (tmp.style.banner)
        tmp.style.banner_path = `/images/collections/${tmp.id}/${tmp.style.banner}`;
      if (tmp.style.logo)
        tmp.style.logo_path = `/images/collections/${tmp.id}/${tmp.style.logo}`;
    }
    all_collections[collection_id] = tmp;
  }

  for (let collection_id in data_collections_cnft) {
    let tmp = data_collections_cnft[collection_id];
    if (tmp.id in all_collections) {
      all_collections[tmp.id].policy_ids = [
        ...all_collections[tmp.id].policy_ids,
        ...tmp.policy_ids,
      ];
    } else {
      tmp.is_cnft_verified = true;
      all_collections[collection_id] = tmp;
    }
  }

  for (let collection_id in all_collections) {
    all_collections[collection_id].policy_ids = [
      ...new Set(all_collections[collection_id].policy_ids),
    ];
  }

  dispatch(collections_loaded(all_collections));
  callback({ all_collections });
};

export const get_listings =
  (policy_id, page, count, lastVisible, callback) => async (dispatch) => {
    try {
      dispatch(collections_loading(true));

      let output = {
        policy_id: policy_id,
        listing: {},
      };

      const assets = await getCollectionAssets(
        policy_id,
        page,
        count,
        lastVisible
      );

      if (assets) {
        output.listing = assets.reduce((map, asset) => {
          map[asset.details.asset] = asset;
          return map;
        }, {});

        if (output.policy_id && output.listing) {
          dispatch(collections_add_tokens(output));
        }
      }

      callback({ success: true, data: assets });
    } catch (error) {
      callback({ success: false, error });
      dispatch(collections_loading(false));
      dispatch(
        set_error({
          message: resolveError(error.message, "Retrieving Collection Assets"),
          detail: error,
        })
      );
    }
  };

export const get_assets = (assetIds, callback) => async (dispatch, state) => {
  try {
    dispatch(collections_loading(true));

    let output = {
      assets: {},
    };

    let assets = await getAssets(
      assetIds.filter((assetId) => {
        let policyId = assetId.slice(0, 56);
        if (policyId in state().collection.policies_assets) {
          if (assetId in state().collection.policies_assets[policyId]) {
            return false;
          }
        }
        return true;
      })
    );

    for (let i in assets) {
      let asset = assets[i];
      if (asset) {
        if (asset.details) {
          output.assets[asset.details.asset] = asset;
        }
      }
    }

    dispatch(collections_add_assets(output));

    callback({ success: true });
  } catch (error) {
    callback({ success: false, error });
    dispatch(collections_loading(false));
    dispatch(
      set_error({
        message: resolveError(error.message, "Retrieving Assets"),
        detail: error,
      })
    );
  }
};

export const get_asset = (asset_id, callback) => async (dispatch) => {
  try {
    dispatch(collections_loading(true));

    let asset = await getAsset(asset_id);

    if (asset) add_token(asset, dispatch);

    callback({ success: true });
  } catch (error) {
    callback({ success: false, error });
    dispatch(collections_loading(false));
    dispatch(
      set_error({
        message: resolveError(error.message, "Retrieving Asset"),
        detail: error,
      })
    );
  }
};

export const get_listed_assets =
  (count, page, callback) => async (dispatch) => {
    try {
      // await Cardano.load();
      // const contractVersion = process.env.REACT_APP_MARTIFY_CONTRACT_VERSION;

      // const listed = await getLockedUtxos(
      //   contractAddress(contractVersion).to_bech32(),
      //   { count, page }
      // );
      // //console.log(listed);
      // const listedLength = listed.length > 100 ? 100 : listed.length;
      // //console.log(listedLength);
      let listed_assets = [];
      // for (let index = 0; index < listedLength; index++) {
      //   const asset = listed[index]["amount"]["1"]["unit"];
      //   //console.log(asset);
      //   const assetDetails = await getAssetDetails(asset);
      //   //console.log(assetDetails);
      //   const txhash0 = listed[index]["tx_hash"];
      //   //console.log("txmetadata:");
      //   const txmetadata = await getTxMetadata(txhash0);
      //   //console.log(txmetadata);
      //   let saleDetails, sellerAddressHex, royaltiesAddressHex;
      //   for (const key in txmetadata) {
      //     switch (txmetadata[key].label) {
      //       case "100":
      //         saleDetails = txmetadata[key].json_metadata;
      //         break;

      //       case "406":
      //         sellerAddressHex = txmetadata[key].json_metadata;
      //         break;
      //       case "407":
      //         royaltiesAddressHex = txmetadata[key].json_metadata;
      //         break;
      //     }
      //   }
      //   const datumHash = listed[index]["data_hash"];
      //   //saleDetails = txmetadata["0"]["json_metadata"];
      //   //console.log(saleDetails);
      //   //sellerAddressHex = txmetadata["1"]["json_metadata"];
      //   //console.log(sellerAddressHex);
      //   //console.log(royaltiesAddressHex);
      //   const sellerAddressBytes = arrayToBytes(sellerAddressHex.sa32);
      //   const sellerAddress = Cardano.Instance.Address.from_bytes(
      //     fromHex(sellerAddressBytes)
      //   );
      //   const sellerAddress32 = await sellerAddress.to_bech32();

      //   //console.log(sellerAddress32);

      //   const royaltiesAddressBytes = arrayToBytes(royaltiesAddressHex.ra32);

      //   const royaltiesAddress = Cardano.Instance.Address.from_bytes(
      //     fromHex(royaltiesAddressBytes)
      //   );
      //   const royaltiesAddress32 = await royaltiesAddress.to_bech32();
      //   //console.log(royaltiesAddress32);
      //   const assetObject = {
      //     status: {
      //       datum: saleDetails,
      //       datumHash: datumHash,
      //       submittedBy: sellerAddress32,
      //       artistAddress: royaltiesAddress32,
      //       locked: true,
      //     },
      //     details: assetDetails,
      //   };
      //   //console.log(assetObject);
      //   listed_assets.push(assetObject);
      // }

      listed_assets = await getLockedAssets(count, lastVisible);

      if (listed_assets) {
        let listed_assets_by_policy = {};

        for (let i in listed_assets) {
          let asset = listed_assets[i];

          if (asset) {
            if (asset.details) {
              if (!(asset.details.policyId in listed_assets_by_policy)) {
                listed_assets_by_policy[asset.details.policyId] = {
                  policy_id: asset.details.policyId,
                  listing: {},
                };
              }
              listed_assets_by_policy[asset.details.policyId].listing[
                asset.details.asset
              ] = asset;
            }
          }
        }

        for (let policy_id in listed_assets_by_policy) {
          dispatch(collections_add_tokens(listed_assets_by_policy[policy_id]));
        }
      }

      callback({ success: true, data: listed_assets });
    } catch (error) {
      callback({ success: false, error });
      dispatch(
        set_error({
          message: resolveError(error.message, "Retrieving Listed Assets"),
          detail: error,
        })
      );
    }
  };

export const asset_add_offer =
  (wallet, asset, price, callback) => async (dispatch) => {
    try {
      if (!("offers" in asset)) {
        asset.offers = {};
      }

      let offer = {
        t: new Date().getTime(),
        p: price,
      };

      asset.offers[wallet.data.address] = offer;

      await saveAsset(asset);

      add_token(asset, dispatch);

      callback({ success: true, type: "offer-success" });
    } catch (error) {
      dispatch(
        set_error({
          message: resolveError(error.message, "Adding Offer"),
          detail: error,
        })
      );
    }
  };

export const opencnft_get_top_projects =
  (time, callback) => async (dispatch) => {
    fetch("https://api.opencnft.io/1/rank?window=" + time, {})
      .then((res) => res.json())
      .then((res) => {
        callback({ success: true, data: res.ranking });
      })
      .catch((err) => {
        console.error(err);
      });
  };

export const opencnft_get_policy =
  (policy_id, callback) => async (dispatch) => {
    fetch(`https://api.opencnft.io/1/policy/${policy_id}`, {})
      .then((res) => res.json())
      .then((res) => {
        callback({ success: true, data: res });
      })
      .catch((err) => {
        console.error(err);
      });
  };

export const opencnft_get_asset_tx =
  (asset_id, callback) => async (dispatch) => {
    fetch(`https://api.opencnft.io/1/asset/${asset_id}/tx`, {})
      .then((res) => res.json())
      .then((res) => {
        callback({ success: true, data: res });
      })
      .catch((err) => {
        console.error(err);
      });
  };

function add_token(asset, dispatch) {
  let output = {
    policy_id: asset.details.policyId,
    listing: {
      [asset.details.asset]: asset,
    },
  };
  dispatch(collections_add_tokens(output));
}
