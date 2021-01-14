import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';

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
        <div style={{ height: 720, width: '100%', margin: 'auto' }}>
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
