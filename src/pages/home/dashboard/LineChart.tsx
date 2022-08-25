import { Box, BoxProps, Center, Text } from '@chakra-ui/react';
import * as Sentry from '@sentry/react';
import { Chart, registerables } from 'chart.js';
import I18n from 'i18n-js';
import { isEqual } from 'lodash';
import React from 'react';
import { t } from 'utils/i18n';

interface LineChartProps extends BoxProps {
  currentWeekData: number[];
  lastWeekData: number[];
}

const LineChart = ({
  currentWeekData,
  lastWeekData,
  ...props
}: LineChartProps) => {
  // state
  const [chartLabels, setChartLabels] = React.useState<string[]>();
  const [isError, setIsError] = React.useState(false);
  // refs
  const chartCanvas = React.useRef<HTMLCanvasElement>(null);
  // chart
  Chart.register(...registerables);
  // side effects
  React.useEffect(() => {
    let today = new Date();
    let labels = [];
    for (let i = 0; i < 7; i++) {
      let pastDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - i
      );
      labels.push(I18n.strftime(pastDay, '%a'));
    }
    setChartLabels(labels.reverse());
  }, []);
  React.useEffect(() => {
    if (!chartCanvas.current) return;
    if (!currentWeekData || !lastWeekData) return;
    if (!chartLabels) return;
    try {
      setIsError(false);
      const maxValue = Math.max(...currentWeekData, ...lastWeekData);
      let ctx = chartCanvas.current.getContext('2d');
      const myChart = new Chart(ctx!, {
        type: 'line',
        data: {
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
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              suggestedMin: 0, //min
              suggestedMax: maxValue + 10, //max
              ticks: {
                precision: 0,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
      return () => myChart.destroy();
    } catch (error) {
      Sentry.captureException({
        name: 'Admin dashboard LineChart error',
        error,
      });
      setIsError(true);
    }
  }, [chartLabels, currentWeekData, lastWeekData]);

  // UI
  return (
    <Box mt="6" position="relative" h="260px" {...props}>
      {isError ? (
        <Center w="100%" h="260px">
          <Text>{t('Ocorreu um erro ao construir o gráfico =/')}</Text>
        </Center>
      ) : (
        <canvas ref={chartCanvas} id="adminDashChart"></canvas>
      )}
    </Box>
  );
};

const areEqual = (prevProps: LineChartProps, nextProps: LineChartProps) => {
  return isEqual(prevProps, nextProps);
};

export default React.memo(LineChart, areEqual);
