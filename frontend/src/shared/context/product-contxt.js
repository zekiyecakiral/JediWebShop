import React,{useState,useEffect} from 'react';
import { useHttpClient } from '../../shared/hooks/http-hook';

export const ProductContext = React.createContext({
    products:[],
    toggleCart:()=>{}
});

export default props => {
     
    const [productsList, setProductsList] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

  
      try {
        const responseData =  sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/saber`
        );
        console.log('res',responseData);
        setProductsList(responseData.sabers);
      } catch (err) {}
   





    const addToCart = productId=>{
        console.log(productId)
        setProductsList(currentProductList=>{
            const prodIndex = currentProductList.findIndex(
                p => p.id === productId
              );
            const newStatus = !currentProductList[prodIndex].isCartItem
            const updatedProduct = [...productsList]
            updatedProduct[prodIndex] = {
                ...currentProductList[prodIndex], isCartItem:newStatus
            };
            return updatedProduct;
        });
    }
    return (
        <ProductContext.Provider value={{products:productsList, toggleCart:addToCart}}>
            {props.children}
        </ProductContext.Provider>
    );
};