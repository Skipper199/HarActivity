/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Chart from 'chart.js';
import Gradient from 'javascript-color-gradient';

import cacheInfoService from '../../../../services/admin/cacheInfo';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const Ttl = () => {
  const classes = useStyles();
  // Get logged user
  const user = useSelector((state) => state.user);

  const [originalData, setOriginalData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chart, setChart] = useState();

  // Fetch upload data from server
  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      const res = await cacheInfoService.ttl(user.token);
      if (isMounted) {
        setOriginalData(res);

        const chartInfo = {
          buckets: res[0].buckets,
          data: res[0].data.map((item) => ({
            label: item.contentType,
            data: item.occurences,
          })),
        };
        setChartData(chartInfo);
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const ctx = document.getElementById('responseTimeChart').getContext('2d');
    const colorGradient = new Gradient();
    const color1 = '#253980';
    const color2 = '#632580';
    const color3 = '#802525';
    const color4 = '#5a8025';

    colorGradient.setGradient(color1, color2, color3, color4);

    if (chartData.data && chartData.data.length > 0) {
      colorGradient.setMidpoint(chartData.data.length);
      for (let i = 0; i < chartData.data.length; i += 1) {
        chartData.data[i].backgroundColor = colorGradient.getColor(i + 1);
      }
    }
    const chartOriginal = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartData.buckets,
        datasets: chartData.data,
        options: {
          responsive: false,
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
            },
          },
          maintainAspectRatio: false,
        },
      },
    });
    setChart(chartOriginal);
  }, [chartData]);

  const handleGroupByChange = ({ target }) => {
    const newData = originalData[target.value].data.map((item) => ({
      label: item.contentType,
      data: item.occurences,
      borderWidth: 1,
    }));

    const chartInfo = {
      buckets: originalData[target.value].buckets,
      data: newData,
    };

    const colorGradient = new Gradient();
    const color1 = '#253980';
    const color2 = '#632580';
    const color3 = '#802525';
    const color4 = '#5a8025';

    colorGradient.setGradient(color1, color2, color3, color4);

    if (newData.length > 0) {
      colorGradient.setMidpoint(newData.length);
      for (let i = 0; i < newData.length; i += 1) {
        newData[i].backgroundColor = colorGradient.getColor(i + 1);
      }
    }

    chart.data.labels = chartInfo.buckets;
    chart.data.datasets = newData;
    chart.update();
  };

  return (
    <>
      <h3> TTL Histogram </h3>
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel id="group-by">Group By</InputLabel>
          <Select
            labelId="group-by"
            id="group-by"
            defaultValue="0"
            onChange={handleGroupByChange}
          >
            <MenuItem value={0}>Nothing</MenuItem>
            {originalData.slice(1).map((item, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {item.isp}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <canvas id="responseTimeChart" width="225" height="125"></canvas>
    </>
  );
};

export default Ttl;
