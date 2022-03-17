import { useDispatch } from "react-redux";
import { compose } from "redux";
import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import {
  availableWallets,
  connectWallet,
  loadAssets,
} from "../../store/wallet/api";
import AssetCard from "../../components/AssetCard/AssetCard";
import "./WalletAssets.css";

const WalletAssets = ({
  state_wallet,
  availableWallets,
  connectWallet,
  loadAssets,
}) => {
  const dispatch = useDispatch;
  const [walletAddress, setWalletAddress] = useState("");
  const [walletAssets, setWalletAssets] = useState([]);
  useEffect(() => {
    if (state_wallet.data.address) {
      setWalletAddress(state_wallet.data.address);
    }
    if (state_wallet.data.assets) {
      let validAssets = [];
      for (const key in state_wallet.data.assets) {
        if (Object.hasOwnProperty.call(state_wallet.data.assets, key)) {
          validAssets.push(state_wallet.data.assets[key]);
        }
      }
      setWalletAssets(validAssets);
    }
  }, [loadAssets, state_wallet]);

  return (
    <div className="bg-white">
      <div className="h-[35vh] wallet_asset_container"></div>

      <div className="lg:container mx-auto px-4">
        <div className="flex justify-center w-full">
          <div className="w-full max-w-[120px] sm:max-w-[150px] lg:max-w-[200px] 2xl:max-w-[302px] relative -top-[60px] md:-top-[75px] lg:-top-[100px] 2xl:-top-[151px] -mb-[60px] md:-mb-[75px] lg:-mb-[100px] 2xl:-mb-[151px]">
            <img
              src={require("../../images/WalletAssets/profileimage.png")}
              alt="profile"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        <div className="flex flex-col items-center w-full mt-4">
          <h1 className="text-center font-bold text-xl sm:text-2xl lg:text-3xl max-w-[27ch] mb-4">
            Native Assets
          </h1>
          <p className="text-center text-base sm:text-lg lg:text-xl max-w-[30ch]">
            in wallet:{" "}
            <span className="text-gold">...{walletAddress.slice(85)}</span>
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 mt-16 rounded-[30px] border-2 border-gray-400">
            <p className="text-center sm:text-lg lg:text-xl max-w-[30ch]">
              {walletAssets.length}
            </p>
            <p className="text-center text-gray-500 text-base sm:text-lg lg:text-xl max-w-[30ch]">
              Items
            </p>
          </div>

          <p className="text-center font-medium text-base sm:text-lg lg:text-xl max-w-[870px] my-[26px]">
            [From the Fragments of Tezuka Osamu]
          </p>
          <p className="text-center font-medium text-base sm:text-lg max-w-[870px] mb-[26px]">
            Tezuka Osamu was a pioneer who established the base of manga now
            known as one of the most influential pop cultures.So far manga has
            contributed to the development of cultures all over the world, and
            infiltrated into a wide range of industries as well.
          </p>
          <p className="text-center font-medium text-base sm:text-lg max-w-[870px] mb-[26px]">
            Tezuka Osamu was a pioneer who established the base of manga now
            known as one of the most influential pop cultures.So far manga has
            contributed to the development of cultures all over the world, and
            infiltrated into a wide range of industries as well.
          </p>
        </div>
      </div>

      <div className="py-8 border-t-2 border-gray-400 mt-8">
        <div className="lg:container mx-auto px-4">
          <div className="max-w-[1300px] mx-auto">
            <div className="flex justify-center flex-wrap lg:grid lg:grid-cols-3 gap-y-4 lg:gap-y-10 gap-x-4 lg:gap-x-10">
              <AssetCard
                href="/"
                collection={"Trx hdxsx"}
                title="Arstro boy"
                text="uyv"
                price="900"
                lastprice="120"
                likes="120"
                image={require("../../images/WalletAssets/assetcard1.png")}
              />
              <AssetCard
                href="/"
                collection={"Trx hdxsx"}
                title="Arstro boy"
                text="uyv"
                price="900"
                lastprice="120"
                likes="120"
                image={require("../../images/WalletAssets/assetcard2.png")}
              />
              <AssetCard
                href="/"
                collection={"Trx hdxsx"}
                title="Arstro boy"
                text="uyv"
                price="900"
                lastprice="120"
                likes="120"
                image={require("../../images/WalletAssets/assetcard3.png")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state, props) {
  return {
    state_wallet: state.wallet,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    availableWallets: (callback) => dispatch(availableWallets(callback)),
    connectWallet: (is_silent, callback) =>
      dispatch(connectWallet(is_silent, callback)),
    loadAssets: (wallet, callback) => dispatch(loadAssets(wallet, callback)),
  };
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  WalletAssets
);
