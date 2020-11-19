import React, { useEffect, useState ,useContext} from 'react';
import SaberList from '../components/SaberList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

const Sabers = () => {
  const auth = useContext(AuthContext);
  const [loadedSabers, setLoadedSabers] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = auth.userId;

  useEffect(() => {

    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/saber/allSabers`,
          'GET',null,

          {
            Authorization: 'Bearer ' + auth.token,
          }
        );
        setLoadedSabers(responseData.sabers);


      } catch (err) {}
    };
    userId && fetchPlaces();
  }, [sendRequest, userId]);

  const saberDeletedHandler = deletedSaberId => {

    setLoadedSabers(prevSabers =>
      prevSabers.filter(saber => saber._id !== deletedSaberId)
    );
  };


  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedSabers && (
         <SaberList items={loadedSabers} onDeleteSaber={saberDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default Sabers;
