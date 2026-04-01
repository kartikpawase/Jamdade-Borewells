/**
 * Jamdade Borewells - Admin Dashboard Charts
 * Uses Chart.js (included via CDN in admin.html)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Only run if canvas elements exist
    if (!document.getElementById('revenueChart')) return;

    // Common style configurations
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

    // Theme observer to toggle chart colors dynamically
    const observer = new MutationObserver(() => {
        const _isDark = document.documentElement.classList.contains('dark');
        Chart.defaults.color = _isDark ? '#94a3b8' : '#64748b';
        Chart.defaults.scale.grid.color = _isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
        revenueLineChart.update();
        servicePieChart.update();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = textColor;
    Chart.defaults.scale.grid.color = gridColor;

    // 1. Revenue Line Chart
    const revCtx = document.getElementById('revenueChart').getContext('2d');
    
    // Gradient for the line chart fill
    const gradientFill = revCtx.createLinearGradient(0, 0, 0, 300);
    gradientFill.addColorStop(0, 'rgba(37, 99, 235, 0.4)');
    gradientFill.addColorStop(1, 'rgba(37, 99, 235, 0.01)');

    const revenueLineChart = new Chart(revCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'Monthly Revenue (₹)',
                data: [350000, 420000, 680000, 550000, 890000, 750000, 1020000],
                borderColor: '#2563EB',
                backgroundColor: gradientFill,
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#2563EB',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { callback: value => '₹' + (value/1000) + 'k' }
                }
            }
        }
    });

    // 2. Service Distribution Doughnut Chart
    const pieCtx = document.getElementById('serviceChart').getContext('2d');
    const servicePieChart = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
            labels: ['Drilling', 'Flushing', 'Pump Setup', 'Camera Inspection'],
            datasets: [{
                data: [55, 20, 15, 10],
                backgroundColor: ['#2563EB', '#00D4FF', '#4F46E5', '#64748B'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                }
            }
        }
    });
});
