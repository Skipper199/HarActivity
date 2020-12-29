import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Chart from 'chart.js';
import Gradient from 'javascript-color-gradient';

import generalInfoService from '../../../../services/admin/generalInfo';

const NumberOfMethods = () => {
  // Get logged user
  const user = useSelector((state) => state.user);

  const [numberOfMethods, setNumberOfMethods] = useState([]);

  // Fetch upload data from server
  useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    async function fetchData() {
      const methods = await generalInfoService.numberOfMethods(user.token);
      if (isMounted) {
        function compare(a, b) {
          if (a.count < b.count) {
            return 1;
          }
          if (a.count > b.count) {
            return -1;
          }
          return 0;
        }
        methods.sort(compare);
        setNumberOfMethods(methods);
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const ctx = document.getElementById('methodsChart').getContext('2d');
    const colorGradient = new Gradient();
    const color1 = '#253980';
    const color2 = '#632580';
    const color3 = '#802525';
    const color4 = '#5a8025';

    colorGradient.setMidpoint(numberOfMethods.length);

    colorGradient.setGradient(color1, color2, color3, color4);
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: numberOfMethods.map((item) => item.method),
        datasets: [
          {
            label: 'Requests Methods',
            data: numberOfMethods.map((item) => item.count),
            backgroundColor: colorGradient.getArray(),
            borderWidth: 1,
          },
        ],
        options: {
          responsive: false,
          maintainAspectRatio: false,
        },
      },
    });
  }, [numberOfMethods]);

  return <canvas id="methodsChart" width="400" height="300"></canvas>;
};

export default NumberOfMethods;
