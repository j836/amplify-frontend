import { useEffect, useState } from "react";
import { useNotifications } from "../../contexts/useNotifications";

const AlertSuccess = (props) => {
  const [exit, setExit] = useState(false);

  const { dispatch } = useNotifications();
  const handleCloseNotification = () => {
    setExit(true);
    console.log("close notification called");
    setTimeout(() => {
      dispatch({
        type: "REMOVE_NOTIFICATION",
        payload: {
          id: props.id,
          type: "DANGER",
        },
      });
    }, 400);
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      handleCloseNotification();
    }, 2000);

    return () => clearTimeout(timerId);
  }, []);

  return (
    <div className={`alert-content alert-success ${exit ? "exit" : ""}`}>
      <div>
        <i class="fa fa-check-circle" aria-hidden="true"></i>
        {props.message}
      </div>

      <span
        className="btn-dismiss"
        id="btn-success-close"
        onClick={() => {
          handleCloseNotification();
        }}
      >
        &times;
      </span>
    </div>
  );
};

export { AlertSuccess };
