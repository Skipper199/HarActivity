import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Chart from 'chart.js';
import Gradient from 'javascript-color-gradient';

import responseTimeService from '../../../../services/admin/responseTime';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const ResponseTime = () => {
  const classes = useStyles();
  // Get logged user
  const user = useSelector((state) => state.user);

  const [originalData, setOriginalData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [groupByValue, setGroupByValue] = useState(0);
  const [checkbox, setCheckbox] = useState(false);

  // Fetch upload data from server
  useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    async function fetchData() {
      const res = await responseTimeService.responseTime(user.token);
      if (isMounted) {
        setOriginalData(res);
        setChartData({
          label: res[0][0].name,
          data: res[0][0].wait,
        });
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

    if (chartData.length > 0) {
      colorGradient.setMidpoint(chartData.length);
      for (let i = 0; i < chartData.length; i += 1) {
        chartData[i].backgroundColor = colorGradient.getColor(i + 1);
      }
    }

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          '00:00-00:59',
          '01:00-01:59',
          '02:00-02:59',
          '03:00-03:59',
          '04:00-04:59',
          '05:00-05:59',
          '06:00-06:59',
          '07:00-07:59',
          '08:00-08:59',
          '09:00-09:59',
          '10:00-10:59',
          '11:00-11:59',
          '12:00-12:59',
          '13:00-13:59',
          '14:00-14:59',
          '15:00-15:59',
          '16:00-16:59',
          '17:00-17:59',
          '18:00-18:59',
          '19:00-19:59',
          '20:00-20:59',
          '21:00-21:59',
          '22:00-22:59',
          '23:00-23:59',
        ],
        datasets: chartData,
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
  }, [chartData]);

  const handleGroupByChange = ({ target }) => {
    setChartData(
      originalData[target.value].map((item) => ({
        label: item.name,
        backgroundColor: 'red',
        borderWidth: 1,
        data: item.wait,
      }))
    );
    setGroupByValue(target.value);
    setCheckbox(true);
    console.log('dadadada');
  };

  return (
    <>
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel id="group-by">Group By</InputLabel>
          <Select
            labelId="group-by"
            id="group-by"
            defaultValue="0"
            onChange={handleGroupByChange}
          >
            <MenuItem value={0}>All</MenuItem>
            <MenuItem value={1}>Content Type</MenuItem>
            <MenuItem value={2}>Day Of The Week</MenuItem>
            <MenuItem value={3}>Http Method</MenuItem>
            <MenuItem value={4}>ISP</MenuItem>
          </Select>
        </FormControl>
      </div>
      <canvas id="responseTimeChart" width="225" height="125"></canvas>
    </>
  );
};

export default ResponseTime;
