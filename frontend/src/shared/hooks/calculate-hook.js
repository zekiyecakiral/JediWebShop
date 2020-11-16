import { useState, useEffect, useContext } from 'react';

import { AuthContext } from '../context/auth-context';

export const useCalculate = (harvestedAmount, forcePercentage) => {
  const auth = useContext(AuthContext);
  const [price, setPrice] = useState();

  useEffect(() => {

    console.log("harvestedAmount",harvestedAmount)
    console.log("forcePercentage",forcePercentage)
    console.log("auth.force",auth.force)

    setPrice((harvestedAmount * forcePercentage * auth.force) / 100);
  }, []);

  return { price };
};
