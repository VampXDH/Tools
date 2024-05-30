const ctx = document.getElementById('requestsChart').getContext('2d');
const requestsData = {
    labels: [],
    datasets: [{
        label: 'Requests Per Second',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        data: [],
    }]
};

const config = {
    type: 'line',
    data: requestsData,
    options: {
        responsive: true,
        scales: {
            x: {
                type: 'realtime',
                realtime: {
                    duration: 20000,
                    refresh: 1000,
                    delay: 2000,
                    onRefresh: async function(chart) {
                        const response = await fetch('https://api.example.com/requests-per-second');
                        const data = await response.json();
                        const now = Date.now();
                        chart.data.labels.push(now);
                        chart.data.datasets.forEach(dataset => {
                            dataset.data.push({
                                x: now,
                                y: data.requestsPerSecond
                            });
                        });
                    }
                }
            },
            y: {
                beginAtZero: true
            }
        }
    }
};

const requestsChart = new Chart(ctx, config);
