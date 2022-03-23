import { Link } from "react-router-dom";
import { FadeImg } from "../Fades";
import PurpleButton from "../PurpleButton/PurpleButton";
import SellButton from "../SellButton/SellButton";
import SellDialog from "../SellDialog/SellDialog";

const WalletAssetCard = ({ state_wallet, asset, assetM, width }) => {
  const imageUrl =
    asset.details.onchainMetadata.image != null
      ? `https://infura-ipfs.io/ipfs/${asset.details.onchainMetadata.image.slice(7)}`
      : require("../../images/WalletAssets/assetcard3.png");
  return (
    <div className="flex flex-col max-w-[412px] items-center rounded-[30px] border-[3px] border-gray-300">
      <FadeImg
        className="w-full rounded-[30px]"
        src={imageUrl}
        alt="assetcard"
        style={{ width: width, height: width }}
      />
      <div className="p-4 flex w-full justify-between">
        <div className="flex flex-col">
          <p className="text-base lg:text-lg font-semibold mb-4">
            collection:{" "}
            {asset.details.onchainMetadata.collection ? asset.details.onchainMetadata.collection : "no collection"}
          </p>
          <p className="text-base lg:text-lg font-semibold mb-4">
            asset name: {asset.details.onchainMetadata.name}
          </p>
          {/* <p className="text-base lg:text-lg font-semibold mb-4">hola</p> */}
        </div>
      </div>
      <div className="border-t border-gray-500 w-full p-4 items-center">
        {/* <div className="flex justify-between w-full">
                    <img src = {require('../../images/collectionitem/coin.png')} alt = "coin" className="w-5 h-5 mr-1"/>
                    <div className="flex">
                        <img src = {require('../../images/collectionitem/heart.png')} alt = "heart" className="w-5 h-5 mr-1"/>
                        <p className="text-base lg:text-lg font-semibold mb-4">{likes}</p>
                    </div>
                </div> */}

        <SellDialog
          state_wallet={state_wallet}
          asset={asset}
          assetM={asset.details.onchainMetadata}
        />
      </div>
    </div>
  );
};

export default WalletAssetCard;
