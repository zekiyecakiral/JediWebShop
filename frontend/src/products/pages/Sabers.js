import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SaberList from '../components/SaberList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Sabers = () => {
  const [loadedSabers, setLoadedSabers] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/saber`
        );
        setLoadedSabers(responseData.sabers);

      } catch (err) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const saberDeletedHandler = deletedSaberId => {
    setLoadedSabers(prevSabers =>
      prevSabers.filter(saber => saber.id !== deletedSaberId)
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
