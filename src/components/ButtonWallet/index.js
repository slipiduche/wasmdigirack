import React, { useEffect, useState } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";

import {
  walletConnected,
  setWalletLoading,
  setWalletData,
} from "../../store/wallet/walletActions";

import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import {
  availableWallets,
  connectWallet,
  loadAssets,
} from "../../store/wallet/api";
import { WALLET_STATE } from "../../store/wallet/walletTypes";
import { FadeImg } from "../Fades";
import { useDispatch, useSelector } from "react-redux";

import "./style.scss";

const wallets = {
  ccvault: {
    title: "ccvault.io",
    image: "/images/wallets/ccvault.png",
  },
  gerowallet: {
    title: "GeroWallet",
    image: "/images/wallets/gero.png",
  },
  nami: {
    title: "Nami",
    image: "/images/wallets/nami.svg",
  },
};

const ButtonWallet = ({
  state_wallet,
  availableWallets,
  connectWallet,
  loadAssets,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showNotification, setShowNotification] = useState(false);
  const [showNotificationMessage, setShowNotificationMessage] = useState(false);
  const [showWallets, setShowWallets] = useState(false);
  const location = useLocation();

  function onclick_connect_wallet() {
    availableWallets((res) => {
      //console.log(res);
      if (res.wallets.length === 0) {
        setShowNotification("no-wallet");
        dispatch(setWalletLoading(WALLET_STATE.NO_WALLETS));
      } else if (res.wallets.length === 1) {
        connect_wallet(res.wallets[0]);
      } else if (res.wallets.length > 1) {
        setShowWallets(res.wallets);
      }
    });
  }

  function connect_wallet(wallet_name) {
    setShowWallets(false);
    connectWallet(wallet_name, (res) => {
      if (!res.success) {
        NotificationManager.error(`${res.msg}`);
        setShowNotificationMessage(res.msg);
      } //  else {
      //   NotificationManager.success(`connected ${wallet_name}`);
      // }
    });
  }

  useEffect(() => {
    if (state_wallet.loading) {
      // console.log(state_wallet.loading);
      if (
        [
          "no-wallet",
          "no-accept",

          WALLET_STATE.CONNECTING,
          WALLET_STATE.GETTING_ASSETS,
        ].includes(state_wallet.loading)
      )
        NotificationManager.info(`${state_wallet.loading}`);

      //console.log(state_wallet.loading);
      if (state_wallet.loading == "NO_WALLETS") {
        navigate("/connectwallet");
      }
    } else {
      setShowNotification(false);
    }

    if (
      state_wallet.connected &&
      !state_wallet.loading &&
      !state_wallet.loaded_assets
    ) {
      //console.log(state_wallet);
      NotificationManager.success(`${"connected"}`);

      loadAssets(state_wallet, (res) => {
        if (res.success) {
          //console.log(state_wallet);

          if (state_wallet.data.assets) {
            //console.log(state_wallet);
            //console.log(state_wallet.data.assets);
            if (state_wallet.data.assets != {} && state_wallet.connected) {
              if (location.pathname != "/WalletAssets")
                navigate("/WalletAssets");
            }
          }
        }
      });
    }
  }, [loadAssets, state_wallet]);

  return (
    <>
      {
        <a
          onClick={() => {
            //setShow(!show);
            if (!state_wallet.connected) {
              // console.log("connecting...");

              onclick_connect_wallet();
            } else {
              navigate("/WalletAssets");
            }
          }}
          className="block px-5 mt-4 lg:inline-block lg:mt-0 mb-4 lg:mb-0"
        >
          <img
            src={require("../../images/Navbar/wallet.png")}
            alt="wallet"
            className="max-w-[1.7rem]"
          />
        </a>
      }
      {/* {
        <Link
          onClick={() => {
            //setShow(!show);
          }}
          to="/connectwallet"
          className="block px-5 mt-4 lg:inline-block lg:mt-0 mb-4 lg:mb-0"
        >
          <img
            src={require("../../images/Navbar/wallet.png")}
            alt="wallet"
            className="max-w-[1.7rem]"
          />
        </Link>
      } */}
    </>
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
  ButtonWallet
);
