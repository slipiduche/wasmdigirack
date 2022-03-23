import "./SellButton.css";

const SellButton = ({ onClick = () => {} }) => {
  return (
    <a
      onClick={() => {
        onClick();
      }}
      className={`2xl:text-2xl sell_button`}
    >
      Sell
    </a>
  );
};

export default SellButton;
