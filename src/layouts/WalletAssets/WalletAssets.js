import { useDispatch } from "react-redux";
import { compose } from "redux";
import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import {
  availableWallets,
  connectWallet,
  loadAssets,
} from "../../store/wallet/api";
import "./WalletAssets.css";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import WalletAssetCard from "../../components/WalletAssetCard/WalletAssetCard";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

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
    if (state_wallet.data.assets) {
      let validAssets = [];
      for (const key in state_wallet.data.assets) {
        if (Object.hasOwnProperty.call(state_wallet.data.assets, key)) {
          validAssets.push(state_wallet.data.assets[key]);
        }
      }
      setWalletAssets(validAssets);
    }
    if (state_wallet.data.address) {
      setWalletAddress(state_wallet.data.address);
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
          <div className="grid grid-cols-2 md:grid-cols-2 mt-16 rounded-[30px] border-2 border-gray-400">
            <div className="flex flex-col p-5 border-b-2 md:border-b-0 border-gray-400">
              <p className="text-center sm:text-lg lg:text-xl max-w-[30ch]">
                {walletAssets.length}
              </p>
            </div>
            <div className="flex flex-col p-5 border-b-2 md:border-b-0 border-gray-400">
              <p className="text-center text-gray-500 text-base sm:text-lg lg:text-xl max-w-[30ch]">
                {"Assets"}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <img
              src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
              srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
            /> */}
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {walletAssets.map((asset, i) => {
            //console.log(asset.details.onchainMetadata.image);

            const imageUrl =
              asset.details.onchainMetadata.image != null
                ? `https://infura-ipfs.io/ipfs/${asset.details.onchainMetadata.image.slice(
                    7
                  )}`
                : require("../../images/WalletAssets/assetcard3.png");
            console.log(imageUrl);
            return (
              <Grid item xs={4}>
                <WalletAssetCard
                  href="/"
                  collection={"Trx hdxsx"}
                  title="Arstro boy"
                  text="uyv"
                  price="900"
                  lastprice="120"
                  likes="120"
                  image={imageUrl}
                  width={330}
                />
              </Grid>
            );
          })}

          <Grid item xs={4}>
            <Item>xs=4</Item>
          </Grid>
          <Grid item xs={4}>
            <Item>xs=4</Item>
          </Grid>
          <Grid item xs={4}>
            <Item>xs=4</Item>
          </Grid>
        </Grid>
      </Box>
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

const itemData = [
  {
    img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    title: "Breakfast",
  },
  {
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Burger",
  },
  {
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
  },
  {
    img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
    title: "Coffee",
  },
  {
    img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
    title: "Hats",
  },
  {
    img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
    title: "Honey",
  },
  {
    img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
    title: "Basketball",
  },
  {
    img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
    title: "Fern",
  },
  {
    img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
    title: "Mushrooms",
  },
  {
    img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
    title: "Tomato basil",
  },
  {
    img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
    title: "Sea star",
  },
  {
    img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
    title: "Bike",
  },
];
