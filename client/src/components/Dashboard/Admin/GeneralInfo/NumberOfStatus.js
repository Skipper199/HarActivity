import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Chart from 'chart.js';

import generalInfoService from '../../../../services/admin/generalInfo';

const NumberOfStatus = () => {
  // Get logged user
  const user = useSelector((state) => state.user);

  const [numberOfStatus, setNumberOfStatus] = useState([]);
  const [mainStatus, setMainStatus] = useState([]);

  // Fetch upload data from server
  useEffect(() => {
    async function fetchData() {
      const status = await generalInfoService.numberOfStatus(user.token);
      setNumberOfStatus(status);
      function compare(a, b) {
        if (a.count < b.count) {
          return 1;
        }
        if (a.count > b.count) {
          return -1;
        }
        return 0;
      }
      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      status.sort(compare);
      const mainStatus = status.slice(0, 3);
      const otherStatus = status.slice(3);
      const onlyNumber = otherStatus.map((item) => item.count);
      const otherSum = onlyNumber.reduce(reducer);
      mainStatus.push({ status: 'Other', count: otherSum });
      setMainStatus(mainStatus);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const ctx = document.getElementById('statusChart').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: mainStatus.map((item) => item.status),
        datasets: [
          {
            label: 'Requests Status',
            data: mainStatus.map((item) => item.count),
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
  }, [mainStatus]);

  return <canvas id="statusChart"></canvas>;
};

export default NumberOfStatus;
