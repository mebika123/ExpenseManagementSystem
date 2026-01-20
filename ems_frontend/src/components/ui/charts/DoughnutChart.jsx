import { Doughnut } from 'react-chartjs-2';

const DoughnutChart = ({ doughnutData }) => {

  const generateColors = (num) => {
    const palette = ['#4f46e5', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#e11d48', '#facc15'];
    const colors = [];
    for (let i = 0; i < num; i++) colors.push(palette[i % palette.length]);
    return colors;
  };

  if (!doughnutData || doughnutData.length === 0) return <div>No data available</div>;

  const labels = doughnutData.map(d => d.label);
  const dataValues = doughnutData.map(d => d.value);

  const backgroundColor = doughnutData.length <= 3
    ? ['#f59e0b', '#22c55e', '#4f46e5']
    : generateColors(doughnutData.length);

  const data = { labels, datasets: [{ data: dataValues, backgroundColor, borderWidth: 1 }] };
  // const options = { responsive: true, plugins: { legend: { position: 'right' }, tooltip: { enabled: true } ,          usePointStyle: true } };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom', // legend at the bottom
        labels: {
          boxWidth: 20,
          padding: 10,
          // Max width helps wrap labels into multiple rows if needed
          usePointStyle: true
        }
      }
    }
  };

  return (
    <div style={{ height: '240px' }}>
      <Doughnut data={data} />
    </div>
  );
};
export default DoughnutChart;