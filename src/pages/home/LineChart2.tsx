import { Box, BoxProps } from '@chakra-ui/react';
import I18n from 'i18n-js';
import React from 'react';
import { defaults, Line } from 'react-chartjs-2';

interface LineChartProps extends BoxProps {
  currentWeekData: number[];
  lastWeekData: number[];
}

export const LineChart = ({ currentWeekData, lastWeekData, ...props }: LineChartProps) => {
  // state
  const [chartLabels, setChartLabels] = React.useState<string[]>();
  // chart
  defaults.animation = false;
  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Semana atual',
        data: currentWeekData,
        fill: false,
        backgroundColor: '#4EA031',
        borderColor: '#4EA031',
      },
      {
        label: 'Semana anterior',
        data: lastWeekData,
        fill: false,
        backgroundColor: '#C8D7CB',
        borderColor: '#C8D7CB',
      },
    ],
  };
  const options = {
    legend: {
      display: false,
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            stepSize: 1,
          },
        },
      ],
    },
    maintainAspectRatio: false,
  };
  // side effects
  React.useEffect(() => {
    let today = new Date();
    let labels = [];
    for (let i = 0; i < 7; i++) {
      let pastDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      labels.push(I18n.strftime(pastDay, '%a'));
    }
    setChartLabels(labels.reverse());
  }, []);
  // UI
  return (
    <Box mt="4" position="relative" h="260px" {...props}>
      <Line data={data} options={options} />
    </Box>
  );
};
