import React, { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

function DurationChartComponent({ dataPoints }) {
  const { labels, durations } = useMemo(() => ({
    labels: dataPoints.map((p) => p.label),
    durations: dataPoints.map((p) => p.hours),
  }), [dataPoints])

  const data = useMemo(() => ({
    labels,
    datasets: [
      {
        label: 'Sleep Hours',
        data: durations,
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.5)',
      },
    ],
  }), [labels, durations])

  return <Line data={data} />
}

export const DurationChart = React.memo(DurationChartComponent)


