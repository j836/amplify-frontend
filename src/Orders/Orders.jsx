import axios from "axios";
import { Loader } from "kaali-ui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "../Auth/context/useAuth";

import { getDiscountFromCoupon } from "../Cart/components/coupon/utils/getDiscountFromCoupon";
import { getTotal } from "../Cart/components/coupon/utils/getTotal";

import { useCoupon } from "../Cart/context/useCoupon";
import { BASE_API } from "../constants/api";
import { useOrders } from "../Payment/context/useOrders";

export const Orders = () => {
  const { loggedInUser } = useAuth();
  const { coupon } = useCoupon();

  const navigate = useNavigate();

  const { ordersMeta, setOrdersMeta } = useOrders();
  const [loadingStatus, setLoadingStatus] = useState(`idle`);

  useEffect(() => {
    (async () => {
      setLoadingStatus(`loading`);
      if (loggedInUser?.token) {
        try {
          const { data, status } = await axios.get(`${BASE_API}/payment`);
          if (status === 200) {
            if (`payments` in data) {
              setLoadingStatus(`success`);
              setOrdersMeta((prevState) => ({
                ...prevState,
                orders: data.payments,
              }));
            }
          }
        } catch (error) {
          setLoadingStatus(`error`);
          console.error(`error `, error);
        }
      }
    })();
  }, [loggedInUser]);

  return (
    <>
      <div className="header header-secondary text-black text-center">
        Order Details
      </div>
      <div className="container-cart-details">
        {loadingStatus === `success`
          ? ordersMeta &&
            ordersMeta.orders &&
            ordersMeta.orders.map((order) => {
              const totalAfterCouponIsApplied = coupon?.isApplied
                ? getTotal(order.items) -
                  getDiscountFromCoupon(order.items, coupon?.coupon)
                : getTotal(order.items);
              return (
                <div
                  className="d-flex ai-center jc-center p-lg m-lg"
                  key={order._id}
                  role={`button`}
                  style={{border: `1px dotted`}}
                  onClick={() => navigate(`/orders/${order.order_id}`)}
                >
                  <div className="order-text-details">
                    <ul>
                      <li className="p-lg">
                        <span className="text-bold mr-sm">Order Id:</span>{" "}
                        <span>{order.order_id}</span>
                      </li>
                      <li className="p-lg">
                        <span className="text-bold mr-sm">Payment Id:</span>
                        <span>{order.payment_id}</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    {order.items.map((item) => {
                      return (
                        <div
                          className="d-flex ai-center jc-center"
                          key={item._id}
                        >
                          <div className="order-text-details">
                            <ul>
                              <li className="p-lg">
                                <span className="text-bold mr-sm">
                                  Total Quantity:
                                </span>
                                <span>{item.totalQuantity}</span>
                              </li>
                              <li className="p-lg">
                                <span className="text-bold mr-sm">
                                  Total Amount Paid:
                                </span>
                                <span>₹{totalAfterCouponIsApplied}</span>
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
                </div>
              );
            })
          : loadingStatus === `loading` && (
              <div className="d-flex jc-center">
                <Loader
                  width={`48px`}
                  height={`48px`}
                  borderWidth={`4px`}
                  borderTopColor={`var(--kaali-danger)`}
                />
              </div>
            )}
      </div>
    </>
  );
};
