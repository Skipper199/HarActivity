import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Chart from 'chart.js';

import generalInfoService from '../../../../services/admin/generalInfo';

const NumberOfMethods = () => {
  // Get logged user
  const user = useSelector((state) => state.user);

  const [numberOfMethods, setNumberOfMethods] = useState([]);

  // Fetch upload data from server
  useEffect(() => {
    async function fetchData() {
      const methods = await generalInfoService.numberOfMethods(user.token);
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
    fetchData();
  }, []);

  useEffect(() => {
    const ctx = document.getElementById('methodsChart').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: numberOfMethods.map((item) => item.method),
        datasets: [
          {
            label: 'Requests Methods',
            data: numberOfMethods.map((item) => item.count),
            backgroundColor: [
              '#00a4e7',
              '#34c1c0',
              '#ffcb64',
              '#ff9d4c',
              '#ffcb64',
            ],
            borderWidth: 1,
          },
        ],
        options: {
          responsive: true,
        },
      },
    });
  }, [numberOfMethods]);

  return <canvas id="methodsChart"></canvas>;
};

export default NumberOfMethods;
