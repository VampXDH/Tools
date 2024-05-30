document.addEventListener("DOMContentLoaded", function() {
    // Your Cloudflare Zone ID and API Token
    const zoneId = '5876d9a743da34d3204658aa2b2c9c4a';
    const apiToken = 'a0vNToOZH7HxP3j-DVzDk4b2NfgNeshj0beLP5Z0';
    const endpoint = `https://api.cloudflare.com/client/v4/zones/${zoneId}/analytics/dashboard`;

    async function fetchRPSData() {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return data.result.timeseries;
    }

    function transformData(timeseries) {
        return timeseries.map(entry => ({
            timestamp: entry.since,
            rps: entry.requests.all
        }));
    }

    async function renderChart() {
        const timeseries = await fetchRPSData();
        const data = transformData(timeseries);

        const ctx = document.getElementById('rpsChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(entry => new Date(entry.timestamp).toLocaleTimeString()),
                datasets: [{
                    label: 'Requests per Second',
                    data: data.map(entry => entry.rps),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
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
                            text: 'Requests per Second'
                        }
                    }
                }
            }
        });
    }

    renderChart();
});
