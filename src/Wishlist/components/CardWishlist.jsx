import { useWishlist } from "../context/useWishlist";
import { CardItemInWishlist } from "./CardItemInWishlist";

const CardWishlist = () => {
  const { state: wishlist } = useWishlist();

  return (
    wishlist.length > 0 &&
    wishlist.map((wishlistedItem) => {
      return (
        <CardItemInWishlist
          wishlistedItem={wishlistedItem}
          key={wishlistedItem._id}
        />
      );
    })
  );
};

export { CardWishlist };