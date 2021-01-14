import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { StaticMap } from 'react-map-gl';
import { DeckGL } from 'deck.gl';
import FlowMapLayer from '@flowmap.gl/core';

import FlowMap, { getViewStateForLocations } from '@flowmap.gl/react';
import flowmapService from '../../../../services/admin/flowmap';

const Flowmap = () => {
  // Get logged user
  const user = useSelector((state) => state.user);
  const [flowmapData, setFlowmapData] = useState(null);

  // Fetch upload data from server
  useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    async function fetchData() {
      const res = await flowmapService.flowmap(user.token);
      if (isMounted) {
        setFlowmapData(res);
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      {flowmapData !== null ? (
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 720,
          }}
        >
          <FlowMap
            initialViewState={{ longitude: 0, latitude: 0, zoom: 1 }}
            mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
            flows={flowmapData.flows}
            locations={flowmapData.locations}
            getLocationId={(l) => l.id}
            getLocationCentroid={(l) => [l.lon, l.lat]}
            getFlowOriginId={(f) => f.origin}
            getFlowDestId={(f) => f.dest}
            getFlowMagnitude={(f) => f.count}
            pickable={true}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Flowmap;
