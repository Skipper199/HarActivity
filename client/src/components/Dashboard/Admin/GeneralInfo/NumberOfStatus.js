/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Chart from 'chart.js';
import Gradient from 'javascript-color-gradient';

import generalInfoService from '../../../../services/admin/generalInfo';

const NumberOfStatus = () => {
  // Get logged user
  const user = useSelector((state) => state.user);

  const [mainStatus, setMainStatus] = useState([]);

  // Fetch upload data from server
  useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    async function fetchData() {
      const status = await generalInfoService.numberOfStatus(user.token);
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

        status.sort(compare);

        // const reducer = (accumulator, currentValue) =>
        //   accumulator + currentValue;

        // const mainStatus = status.slice(0, 3);
        // const otherStatus = status.slice(3);
        // const onlyNumber = otherStatus.map((item) => item.count);
        // const otherSum = onlyNumber.reduce(reducer, 0);
        // mainStatus.push({ status: 'Other', count: otherSum });
        setMainStatus(status);
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const ctx = document.getElementById('statusChart').getContext('2d');
    const colorGradient = new Gradient();
    const color1 = '#253980';
    const color2 = '#632580';
    const color3 = '#802525';
    const color4 = '#5a8025';

    colorGradient.setMidpoint(mainStatus.length);

    colorGradient.setGradient(color1, color2, color3, color4);
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: mainStatus.map((item) => item.status),
        datasets: [
          {
            label: 'Requests Status',
            data: mainStatus.map((item) => item.count),
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
  }, [mainStatus]);

  return <canvas id="statusChart" width="82.5" height="32.5"></canvas>;
};

export default NumberOfStatus;
