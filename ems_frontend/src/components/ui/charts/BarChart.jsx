import { Bar } from 'react-chartjs-2';

const BarChart = ({ bardata }) => {
    if (!bardata || bardata.length === 0) {
        return <div>No data available</div>;
    }

    const labels = bardata.map((b) => b.month); 
    const dataAmount = bardata.map((b) => b.total);

   
    const data = {
        // labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'Jully', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        labels,
        datasets: [
            {
                label: 'Monthly Expenses',
                data: dataAmount,
                backgroundColor: '#4f46e5',
                borderColor: '#ffffff',
                borderWidth: 1,
                borderSkipped: 'top',
                // borderSkipped: 'bottom',
                borderRadius: 2,
                barThickness: 33,
                // borderSkipped: false
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true
                }
            },
            tooltip: {
                callbacks: {
                    label: (ctx) => `Rs. ${ctx.parsed.y}`
                }
            }
        },
        scales: {
            x: {
                grid: { display: false }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => `Rs. ${value}`
                }
            }
        }
    };

    return (
        <div style={{ height: '240px' }}>
            <Bar data={data} options={options} />
        </div>
    );
};

export default BarChart;
