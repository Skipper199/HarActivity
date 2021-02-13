/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import L from 'leaflet';
import HeatmapOverlay from 'leaflet-heatmap/leaflet-heatmap.js';
import 'leaflet/dist/leaflet.css';

import heatmapService from '../../../../services/user/heatmap';

const Heatmap = () => {
  // Get logged user
  const user = useSelector((state) => state.user);

  const [mountedOnce, setMountedOnce] = useState(false);
  const [geoData, setGeoData] = useState();

  // Fetch data from server
  useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    async function fetchData() {
      const responseData = await heatmapService.heatmap(user.token);
      if (isMounted) {
        setGeoData(responseData);
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (geoData) {
      var baseLayer = L.tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '...',
          maxZoom: 18,
        }
      );

      var cfg = {
        // radius should be small ONLY if scaleRadius is true (or small radius is intended)
        // if scaleRadius is false it will be the constant radius used in pixels
        radius: 2,
        maxOpacity: 0.8,
        // scales the radius based on map zoom
        scaleRadius: true,
        // if set to false the heatmap uses the global maximum for colorization
        // if activated: uses the data maximum within the current map boundaries
        //   (there will always be a red spot with useLocalExtremas true)
        useLocalExtrema: true,
        // which field name in your data represents the latitude - default "lat"
        latField: 'lat',
        // which field name in your data represents the longitude - default "lng"
        lngField: 'lng',
        // which field name in your data represents the data value - default "value"
        valueField: 'count',
      };

      var heatmapLayer = new HeatmapOverlay(cfg);

      if (mountedOnce === false) {
        new L.Map('map-canvas', {
          center: new L.LatLng(38.29020112661632, 21.795680759983547),
          zoom: 3,
          layers: [baseLayer, heatmapLayer],
        });
        setMountedOnce(true);
      }
      heatmapLayer.setData(geoData);
    }
  }, [mountedOnce, geoData]);

  return (
    <div
      style={{ height: 720, width: '100%', margin: 'auto' }}
      id="map-canvas"
    ></div>
  );
};

export default Heatmap;
