import { useParams } from "react-router";
import { useAddress } from "../Address/hooks/useAddress";
import { getDiscountFromCoupon } from "../Cart/components/coupon/utils/getDiscountFromCoupon";
import { getTotal } from "../Cart/components/coupon/utils/getTotal";

import { useCoupon } from "../Cart/context/useCoupon";
import { useOrders } from "../Payment/context/useOrders";

import "./SingleOrderPage.css";
export const SingleOrderPage = () => {
  const { selectedAddress } = useAddress();

  const { orderId } = useParams();
  const { coupon } = useCoupon();
  const { ordersMeta } = useOrders();

  let orderedItem = null;
  orderedItem = ordersMeta.orders.find((order) => {
    return order.order_id === orderId;
  });

  const totalAfterCouponIsApplied = coupon?.isApplied
    ? getTotal(orderedItem.items) -
      getDiscountFromCoupon(orderedItem.items, coupon?.coupon)
    : getTotal(orderedItem.items);

  const { address } = selectedAddress;
  if (orderedItem) {
    return (
      <>
        <div className="header header-secondary text-black text-center">
          Order Placed Successfully!
        </div>
        <div className="order-details-wrapper" style={{ margin: `0 auto` }}>
          {orderedItem.items.map((item) => {
            return (
              <div className="d-flex ai-center jc-center" key={item._id}>
                <div className="order-text-details">
                  <ul>
                    <li className="p-lg">
                      <span className="text-bold mr-sm">Order Id:</span>{" "}
                      <span>{orderedItem.order_id}</span>
                    </li>
                    <li className="p-lg">
                      <span className="text-bold mr-sm">Payment Id:</span>
                      <span>{orderedItem.payment_id}</span>
                    </li>
                    <li className="p-lg">
                      <span className="text-bold mr-sm">Total Quantity:</span>
                      <span>{item.totalQuantity}</span>
                    </li>
                    <li className="p-lg">
                      <span className="text-bold mr-sm">
                        Total Amount Paid:
                      </span>
                      <span>{totalAfterCouponIsApplied}</span>
                    </li>
                  </ul>
                </div>

                <div className="maxW-220" key={item._id}>
                  <img
                    className="w-100"
                    src={`${item.image}`}
                    alt={`${item.name}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }
};
