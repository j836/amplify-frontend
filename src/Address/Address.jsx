import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../Auth/context/useAuth";
import { BASE_API } from "../constants/api";
import { AddressModal } from "./AddressModal";
import { useAddress } from "./hooks/useAddress";
import { SingleAddress } from "./SingleAddress";
import { IoMdAdd } from "react-icons/io";
import { useNotifications } from "../Home/components/notification/context/useNotifications";
import { Loader } from "kaali-ui";

export const Address = () => {
  const [ismodalHidden, setIsModalHidden] = useState(true);
  const { loggedInUser } = useAuth();

  const [addressesMeta, setAddressesMeta] = useState({
    addresses: [],
  });

  const [loadingStatus, setLoadingStatus] = useState(`idle`);

  useEffect(() => {
    (async () => {
      setLoadingStatus(`loading`);
      try {
        if (loggedInUser && loggedInUser.token) {
          const { data, status } = await axios.get(`${BASE_API}/address`);
          if (status === 200) {
            if (`addresses` in data) {
              setLoadingStatus(`success`);
              setAddressesMeta((prevState) => ({
                ...prevState,
                addresses: data.addresses,
              }));
            }
          }
        }
      } catch (error) {
        setLoadingStatus(`error`);
        console.error(`error `, error);
      }
    })();
  }, [loggedInUser]);
  return (
    <>
      {!ismodalHidden && (
        <AddressModal
          ismodalHidden={ismodalHidden}
          setIsModalHidden={setIsModalHidden}
          setAddressesMeta={setAddressesMeta}
        />
      )}

      <div className="header header-tertiary text-black ">Address</div>
      <div>
        {loadingStatus === `success`
          ? addressesMeta.addresses.map((address, index) => {
              return (
                <SingleAddress
                  address={address}
                  index={index}
                  setAddressesMeta={setAddressesMeta}
                />
              );
            })
          : loadingStatus === `loading` && (
              <div className="d-flex jc-start">
                <Loader
                  width={`36px`}
                  height={`36px`}
                  borderWidth={`4px`}
                  borderTopColor={`var(--kaali-danger)`}
                />
              </div>
            )}
      </div>

      <div className="d-flex jc-end">
        <button
          className="btn btn-danger bg-transparent red d-flex ai-center"
          style={{
            border: `1px solid var(--kaali-danger)`,
          }}
          onClick={() => {
            setIsModalHidden(false);
          }}
        >
          <div>
            <IoMdAdd />
          </div>
          <div>Add Address</div>
        </button>
      </div>
    </>
  );
};
