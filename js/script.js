const links = document.querySelectorAll('nav a,.logout');
links.forEach(function(link) {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        links.forEach(function(item) {
            item.classList.remove('active');
        });
        link.classList.add('active');
    });
});
const date = new Date();
const options = {
    day: "2-digit",
    month: "short",
    year: "numeric"
};
document.getElementById("current-date").textContent =
    date.toLocaleDateString("en-GB", options);
const unreadNotifications = 3;
document.getElementById("notification-count").textContent =unreadNotifications;
const searchInput = document.getElementById("search-input");
const clearSearch = document.getElementById("clear-search");
searchInput.addEventListener("input", function() {
    if (searchInput.value !== "") {
        clearSearch.style.display = "block";
    } else {
        clearSearch.style.display = "none";
    }
});
clearSearch.addEventListener("click", function() {
    searchInput.value = "";
    clearSearch.style.display = "none";
});
// ===============================
// Notifications & User Menu
// ===============================

const notification = document.getElementById("notification");
const notificationsMenu = document.getElementById("notifications-menu");

const user = document.getElementById("user");
const userMenu = document.getElementById("user-menu");

const notificationBox = document.getElementById("notification-box");
const userBox = document.getElementById("user-box");


// فتح / إغلاق الإشعارات
notification.addEventListener("click", function(event) {

    event.stopPropagation();

    // إغلاق قائمة المستخدم
    userMenu.classList.remove("show");

    // فتح / إغلاق الإشعارات
    notificationsMenu.classList.toggle("show");

});


// فتح / إغلاق معلومات المستخدم
user.addEventListener("click", function(event) {

    event.stopPropagation();

    // إغلاق الإشعارات
    notificationsMenu.classList.remove("show");

    // فتح / إغلاق المستخدم
    userMenu.classList.toggle("show");

});


// الضغط خارج البوكسات
document.addEventListener("click", function(event) {

    if (!notificationBox.contains(event.target)) {
        notificationsMenu.classList.remove("show");
    }

    if (!userBox.contains(event.target)) {
        userMenu.classList.remove("show");
    }

});
const menuButton = document.getElementById("menu-button");
const sidebar = document.querySelector("aside");
menuButton.addEventListener("click", function () {
    if (window.innerWidth > 900) {
        sidebar.classList.toggle("hide");
    } else {
        sidebar.classList.toggle("show");
    }
});
document.addEventListener("click", function(event) {

    if (window.innerWidth <= 900 &&
        sidebar.classList.contains("show") &&
        !sidebar.contains(event.target) &&
        !menuButton.contains(event.target)) {

        sidebar.classList.remove("show");
    }

});
// إخفاء الشريط تلقائياً عند تصغير الشاشة
window.addEventListener("resize", function () {

    if (window.innerWidth > 900) {
        sidebar.classList.remove("show");
    }

});

document.addEventListener("click", function(event){

    const userBox = document.getElementById("user-box");

    if(!userBox.contains(event.target)){
        userMenu.classList.remove("show");
    }

});
const periodButton = document.getElementById("period-button");
const periodMenu = document.getElementById("period-menu");
const selectedPeriod = document.getElementById("selected-period");

periodButton.addEventListener("click", function(event) {

    event.stopPropagation();

    periodMenu.classList.toggle("show");

});
const periodOptions = periodMenu.querySelectorAll("button");

document.addEventListener("click", function(event) {

    if (!event.target.closest(".period-dropdown")) {
        periodMenu.classList.remove("show");
    }

});
let salesChart;

const salesChartCanvas = document.getElementById("salesChart");

function createSalesChart(labels, values) {

    if (salesChart) {
        salesChart.destroy();
    }

    salesChart = new Chart(salesChartCanvas, {
        type: "line",

        data: {
            labels: labels,

            datasets: [{
                label: "Sales",
                data: values,

                borderWidth: 2,
                tension: 0.3,

                pointRadius: 3,
                pointHoverRadius: 5,

                pointBackgroundColor: "white",
                pointBorderColor: "rgb(30, 105, 220)",
                pointBorderWidth: 2,

                borderColor: "rgb(30, 105, 220)",

                fill: true,
                backgroundColor: "rgba(133, 138, 153, 0.23)"
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false,
                },

                tooltip: {
                    enabled: true
                }
            },

            scales: {
                x: {
                    grid: {
                        display: true
                    }
                },

                y: {
                    beginAtZero: true,

                    grid: {
                        display: true
                    }
                }
            }
        }
    });
}
async function loadSalesChart(period) {

    try {

        const response = await fetch(
            `/api/dashboard/sales/?period=${period}`
        );

        if (!response.ok) {
            throw new Error("Failed to load sales data");
        }

        const result = await response.json();

        const labels = result.data.labels;
        const values = result.data.values;

        createSalesChart(labels, values);

    } catch (error) {

        console.error("Sales chart error:", error);

    }
}
let categoryChart;

const categoryChartCanvas = document.getElementById("categoryChart");

function createCategoryChart(labels, values) {

    if (categoryChart) {
        categoryChart.destroy();
    }

    const total = values.reduce(function(sum, value) {
        return sum + value;
    }, 0);

    categoryChart = new Chart(categoryChartCanvas, {
        type: "doughnut",

        data: {
            labels: labels,

            datasets: [{
                data: values,

                backgroundColor: [
                    "rgba(2, 116, 161, 0.98)",
                    "rgb(0, 204, 255)",
                    "rgb(103, 214, 113)",
                    "rgba(243, 187, 104, 0.88)",
                    "rgb(190, 200, 210)"
                ],

                borderWidth: 2,
                borderColor: "white"
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            cutout: "65%",

            plugins: {
                legend: {
                    display: true,
                    position: "right"
                },

                tooltip: {
                    enabled: true
                }
            }
        },

        plugins: [{
            id: "centerText",

            beforeDraw: function(chart) {

                const ctx = chart.ctx;

                const centerX =
                    (chart.chartArea.left + chart.chartArea.right) / 2;

                const centerY =
                    (chart.chartArea.top + chart.chartArea.bottom) / 2;

                ctx.save();

                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                ctx.fillStyle = "rgb(100, 110, 125)";
                ctx.font = "12px Arial";

                ctx.fillText(
                    "Total",
                    centerX,
                    centerY - 9
                );

                ctx.fillStyle = "rgb(20, 30, 50)";
                ctx.font = "bold 17px Arial";

                ctx.fillText(
                    total.toLocaleString(),
                    centerX,
                    centerY + 11
                );

                ctx.restore();
            }
        }]
    });
}
const categoryLabels = [
    "Painkillers",
    "Antibiotics",
    "Vitamins",
    "Cold & Flu",
    "Others"
];

const categoryValues = [
    35,
    25,
    18,
    12,
    10
];

createCategoryChart(categoryLabels, categoryValues);

const periodMap = {
    "Today": "today",
    "This Week": "week",
    "This Month": "month",
    "This Year": "year"
};
periodOptions.forEach(function(option) {

    option.addEventListener("click", function() {

        selectedPeriod.textContent = option.textContent;

        periodOptions.forEach(function(item) {
            item.classList.remove("selected");
        });

        option.classList.add("selected");

        periodMenu.classList.remove("show");

        const period = periodMap[option.textContent];

        loadSalesChart(period);

    });

});
const salesData = {
    today: {
        labels: ["9 AM", "12 PM", "3 PM", "6 PM", "9 PM"],
        values: [1200, 2100, 1800, 3200, 2500]
    },

    week: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        values: [5200, 6800, 6100, 8200, 7600, 9100, 12450]
    },

    month: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        values: [28500, 32100, 29400, 34320]
    },

    year: {
        labels: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ],
        values: [
            52000, 61000, 58000, 67000,
            72000, 69000, 81000, 84320,
            76000, 89000, 94000, 102000
        ]
    }
};

function loadSalesChart(period) {

    const data = salesData[period];

    createSalesChart(
        data.labels,
        data.values
    );
}

loadSalesChart("week");// ===============================

const lowStockTable = document.getElementById("low-stock-table");

const lowStockMedicines = [
    {
        name: "Paracetamol",
        category: "Painkillers",
        currentStock: 8,
        minStock: 20,
        status: "Critical"
    },
    {
        name: "Amoxicillin",
        category: "Antibiotics",
        currentStock: 15,
        minStock: 25,
        status: "Low"
    },
    {
        name: "Ibuprofen",
        category: "Painkillers",
        currentStock: 12,
        minStock: 20,
        status: "Low"
    }
];
lowStockMedicines.forEach(function(medicine) {

    const row = document.createElement("tr");

    const statusClass =
        medicine.status === "Critical"
            ? "critical"
            : "low";

    row.innerHTML = `
        <td>${medicine.name}</td>
        <td>${medicine.category}</td>
        <td>${medicine.currentStock}</td>
        <td>${medicine.minStock}</td>

        <td>
            <span class="status-badge ${statusClass}">
                ${medicine.status}
            </span>
        </td>

        <td>
            <button class="table-action">Order Now</button>
        </td>
    `;

    lowStockTable.appendChild(row);

});
// Recent Sales

const recentSalesTable = document.getElementById("recent-sales-table");

const recentSales = [
    {
        invoice: "#INV-1025",
        customer: "Ahmad Ali",
        Image:'user2.png',
        amount: "$125.00",
        time: "10:30 AM"
    },
    {
        invoice: "#INV-1024",
        customer: "Sara Khalil",
        Image:'user.png',
        amount: "$84.50",
        time: "10:05 AM"
    },
    {
        invoice: "#INV-1023",
        customer: "Omar Hassan",
        Image:'user2.png',
        amount: "$210.00",
        time: "9:40 AM"
    },
    {
        invoice: "#INV-1022",
        customer: "Lina Samir",
        Image:'user.png',
        amount: "$56.00",
        time: "9:15 AM"
    }
];

recentSales.forEach(function (sale) {

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${sale.invoice}</td>

        <td>
            <div class="customer-info">
                <img src="${sale.Image}" alt="${sale.customer}">
                <span>${sale.customer}</span>
            </div>
        </td>

        <td>${sale.amount}</td>
        <td>${sale.time}</td>
    `;

    recentSalesTable.appendChild(row);

});
// Dashboard sample data
document.getElementById("today-sales").textContent = "$12,450";
document.getElementById("sales-change").innerHTML = "↑ 8.5% <small>from yesterday</small>";

document.getElementById("total-medicines").textContent = "1,248";
document.getElementById("medicine-categories").innerHTML = "24 <small>categories</small>";

document.getElementById("low-stock-items").textContent = "18";
document.getElementById("stock-status").innerHTML = "Needs attention";

document.getElementById("total-customers").textContent = "3,642";
document.getElementById("customers-change").innerHTML = "↑ 5.2% <small>this month</small>";

document.getElementById("total-revenue").textContent = "$84,320";
document.getElementById("revenue-change").innerHTML = "↑ 12.4% <small>this month</small>";
document.getElementById("revenue-change").innerHTML =
    "↑ 12.4% <small>this month</small>";

const notificationList = document.querySelector(".notification-list");

const notifications = [
    {
        icon: "fa-triangle-exclamation",
        title: "Low Stock Alert",
        message: "Paracetamol stock is running low.",
        time: "10 minutes ago",
        unread: true
    },
    {
        icon: "fa-cart-shopping",
        title: "New Sale",
        message: "A new sale has been completed.",
        time: "30 minutes ago",
        unread: true
    },
    {
        icon: "fa-prescription-bottle-medical",
        title: "Medicine Expiring",
        message: "Some medicines will expire soon.",
        time: "1 hour ago",
        unread: false
    },
    {
        icon: "fa-user-plus",
        title: "New Customer",
        message: "A new customer has been registered.",
        time: "2 hours ago",
        unread: false
    }
];

notifications.forEach(function(notification) {

    const item = document.createElement("div");

    item.classList.add("notification-item");

    if (notification.unread) {
        item.classList.add("unread");
    }

    item.innerHTML = `
        <div class="notification-icon">
            <i class="fa-solid ${notification.icon}"></i>
        </div>

        <div class="notification-info">
            <h4>${notification.title}</h4>
            <p>${notification.message}</p>
            <span>${notification.time}</span>
        </div>

        ${
            notification.unread
                ? '<span class="notification-dot"></span>'
                : ''
        }
    `;

    notificationList.appendChild(item);

});