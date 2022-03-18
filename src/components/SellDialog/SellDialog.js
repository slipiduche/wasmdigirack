import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import SellButton from "../SellButton/SellButton";
import { FadeImg } from "../Fades";
import { COLUMN_LAYOUT } from "@blueprintjs/icons/lib/esm/generated/iconContents";
import { Box, Grid } from "@mui/material";

const SellDialog = ({ asset }) => {
  //console.log(asset);
  // const imageUrls =
  //   asset.image != null
  //     ? `https://infura-ipfs.io/ipfs/${asset.image.slice(7)}`
  //     : require("../../images/WalletAssets/assetcard3.png");
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    "https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png"
  );
  const [assetSelected, setAsset] = useState({});
  const handleClickOpen = () => {
    setAsset(asset);
    console.log(assetSelected);
    console.log(assetSelected.name);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    //console.log(assetSelected);
    if (assetSelected.image != null) {
      setImageUrl(
        `https://infura-ipfs.io/ipfs/${assetSelected.image.slice(7)}`
      );
    } else {
      setImageUrl(require("../../images/WalletAssets/assetcard3.png"));
    }
  }, [assetSelected]);

  return (
    <div>
      <SellButton onClick={handleClickOpen}>Sell</SellButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Sell</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Are you sure you want to sell this asset?.
          </DialogContentText>

          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <FadeImg
                      className="w-full"
                      src={imageUrl}
                      alt="assetcard"
                      style={{ width: 100, height: 100 }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <div className="p-4 flex w-full justify-between">
                      <div className="flex flex-col">
                        <p className="text-base  font-semibold mb-4">
                          collection:{" "}
                          {assetSelected.collection
                            ? assetSelected.collection
                            : "no collection"}
                        </p>
                        <p className="text-base  font-semibold mb-4">
                          asset name:{" "}
                          {assetSelected.name ? assetSelected.name : "no name"}
                        </p>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Price"
                  type="number"
                  fullWidth
                  variant="standard"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default SellDialog;
