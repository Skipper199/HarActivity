import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Chart from 'chart.js';
import Gradient from 'javascript-color-gradient';

import generalInfoService from '../../../../services/admin/generalInfo';

const AverageAge = () => {
  // Get logged user
  const user = useSelector((state) => state.user);

  const [avgAgeElem, setAvgAgeElem] = useState([]);

  // Fetch upload data from server
  useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    async function fetchData() {
      const res = await generalInfoService.averageAge(user.token);
      if (isMounted) {
        function compare(a, b) {
          if (a.averageAge < b.averageAge) {
            return 1;
          }
          if (a.averageAge > b.averageAge) {
            return -1;
          }
          return 0;
        }
        res.data.sort(compare);
        setAvgAgeElem(res.data);
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const ctx = document.getElementById('averageAgeChart').getContext('2d');
    const colorGradient = new Gradient();
    const color1 = '#253980';
    const color2 = '#632580';
    const color3 = '#802525';
    const color4 = '#5a8025';

    colorGradient.setMidpoint(avgAgeElem.length);

    colorGradient.setGradient(color1, color2, color3, color4);
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: avgAgeElem.map((item) => item.contentType),
        datasets: [
          {
            label: 'Average Age',
            data: avgAgeElem.map((item) => item.averageAge),
            backgroundColor: colorGradient.getArray(),
            borderWidth: 1,
          },
        ],
        options: {
          responsive: false,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Chart.js Bar Chart',
            },
          },
        },
      },
    });
  }, [avgAgeElem]);

  return <canvas id="averageAgeChart" width="400" height="300"></canvas>;
};

export default AverageAge;
