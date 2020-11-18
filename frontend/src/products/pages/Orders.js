import React, { useEffect, useState, useContext } from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import OrderItem from '../components/OrderItem';

const Orders = (props) => {
  const auth = useContext(AuthContext);

  const [orders, setOrders] = useState();
  const { error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchOrderByUserId = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/order/saber`,
          'GET',
          null,
          {
            Authorization: 'Bearer ' + auth.token,
          }
        );
        console.log(responseData);
        setOrders(responseData.orders);
      } catch (err) {}
    };

    const fetchAllOrders = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/order/saber`,
          'GET',
          null,
          {
            Authorization: 'Bearer ' + auth.token,
          }
        );

        setOrders(responseData.orders);
      } catch (err) {}
    };

    auth.isAdmin ? fetchAllOrders() : fetchOrderByUserId();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {orders &&
        orders.map((order) =>
          order.saberId && (
            <OrderItem
              price={order.price}
              createdAt={order.createdAt}
              saber={order.saberId}
              crystal={order.saberId.crystal}
              user={order.userId}
            />
          ) 
        )}
    </React.Fragment>
  );
};

export default Orders;
