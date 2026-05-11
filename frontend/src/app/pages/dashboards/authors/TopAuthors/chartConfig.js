const colors = {
    primary: '#6366f1',
    secondary: '#F000B9',
    success: '#10B981',
    warning: '#FF9800',
    error: '#FF5724'
}

export function getChartConfig(color) {
    return {
        colors: [colors[color]],
        chart: {
            parentHeightOffset: 0,
            toolbar: {
                show: false,
            },
        },
        grid: {
            padding: {
                left: -18,
                right: 0,
                top: -30,
            },
        },
        plotOptions: {
            bar: {
                borderRadius: 5,
                columnWidth: "55%",
            },
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            labels: {
                show: false,
            },
        },
        yaxis: {
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            labels: {
                show: false,
            },
        },
    }
}
