const apiToken = 'nbYYnwZpJA0ZPP8MFUsDbH61SstxfsaPIP41vGsl';
const zoneId = '5876d9a743da34d3204658aa2b2c9c4a';

let chart;

async function getRequestData() {
    const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/analytics/dashboard?since=-7200&continuous=true`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    return data.result.timeseries;
}

function parseData(data) {
    return data.map(item => ({
        timestamp: new Date(item.since),
        requests: item.requests.all
    }));
}

function drawChart(data) {
    const ctx = document.getElementById('myChart').getContext('2d');
    if (chart) {
        chart.data.labels = data.map(item => item.timestamp);
        chart.data.datasets[0].data = data.map(item => item.requests);
        chart.update();
    } else {
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(item => item.timestamp),
                datasets: [{
                    label: 'Requests Per Second',
                    data: data.map(item => item.requests),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'minute'
                        },
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Requests Per Second'
                        }
                    }
                }
            }
        });
    }
}

async function updateChart() {
    const requestData = await getRequestData();
    const parsedData = parseData(requestData);
    drawChart(parsedData);
}

function startUpdatingChart(interval) {
    updateChart();
    setInterval(updateChart, interval);
}

// Mulai memperbarui grafik setiap 10 detik (10000 ms)
startUpdatingChart(10000);
