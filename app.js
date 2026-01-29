// Dashboard Charts and Analytics

class DashboardManager {
  constructor() {
    this.charts = {};
    this.initCharts();
    this.loadActivities();
    this.loadDeadlines();
  }

  initCharts() {
    if (document.getElementById("revenueChart")) {
      this.createRevenueChart();
    }

    if (document.getElementById("servicesChart")) {
      this.createServicesChart();
    }
  }

  createRevenueChart() {
    const ctx = document.getElementById("revenueChart").getContext("2d");
    const data = this.getRevenueData();

    this.charts.revenue = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.months,
        datasets: [
          {
            label: "Fitimet (€)",
            data: data.revenues,
            backgroundColor: "rgba(52, 152, 219, 0.7)",
            borderColor: "rgba(52, 152, 219, 1)",
            borderWidth: 2,
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: "Shpenzimet (€)",
            data: data.expenses,
            backgroundColor: "rgba(231, 76, 60, 0.7)",
            borderColor: "rgba(231, 76, 60, 1)",
            borderWidth: 2,
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "#fff",
            bodyColor: "#fff",
            borderColor: "rgba(255, 255, 255, 0.1)",
            borderWidth: 1,
            callbacks: {
              label: function (context) {
                return `${context.dataset.label}: ${context.raw.toFixed(2)} €`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
            ticks: {
              callback: function (value) {
                return value + " €";
              },
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
        animation: {
          duration: 1000,
          easing: "easeOutQuart",
        },
      },
    });

    // Year selection
    const yearSelect = document.getElementById("yearSelect");
    if (yearSelect) {
      yearSelect.addEventListener("change", (e) => {
        const year = e.target.value;
        const newData = this.getRevenueData(year);
        this.charts.revenue.data.datasets[0].data = newData.revenues;
        this.charts.revenue.data.datasets[1].data = newData.expenses;
        this.charts.revenue.update();
      });
    }
  }

  createServicesChart() {
    const ctx = document.getElementById("servicesChart").getContext("2d");
    const data = this.getServicesData();

    this.charts.services = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: data.labels,
        datasets: [
          {
            data: data.values,
            backgroundColor: [
              "rgba(52, 152, 219, 0.8)",
              "rgba(46, 204, 113, 0.8)",
              "rgba(155, 89, 182, 0.8)",
              "rgba(241, 196, 15, 0.8)",
              "rgba(230, 126, 34, 0.8)",
              "rgba(231, 76, 60, 0.8)",
            ],
            borderColor: [
              "rgba(52, 152, 219, 1)",
              "rgba(46, 204, 113, 1)",
              "rgba(155, 89, 182, 1)",
              "rgba(241, 196, 15, 1)",
              "rgba(230, 126, 34, 1)",
              "rgba(231, 76, 60, 1)",
            ],
            borderWidth: 2,
            hoverOffset: 20,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              padding: 20,
              usePointStyle: true,
              pointStyle: "circle",
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.raw;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              },
            },
          },
        },
        cutout: "65%",
        animation: {
          animateScale: true,
          animateRotate: true,
        },
      },
    });
  }

  getRevenueData(year = "2024") {
    const months = [
      "Jan",
      "Shk",
      "Mar",
      "Pri",
      "Maj",
      "Qer",
      "Kor",
      "Gus",
      "Sht",
      "Tet",
      "Nën",
      "Dhj",
    ];
    const revenues = [
      15000, 18000, 22000, 19500, 25000, 28000, 32000, 30000, 27000, 31000,
      35000, 40000,
    ];
    const expenses = [
      8000, 8500, 9500, 9000, 11000, 12000, 14000, 13000, 11500, 12500, 14000,
      15000,
    ];

    // Adjust based on year
    if (year === "2023") {
      revenues.forEach((val, i) => (revenues[i] = val * 0.85));
      expenses.forEach((val, i) => (expenses[i] = val * 0.85));
    } else if (year === "2022") {
      revenues.forEach((val, i) => (revenues[i] = val * 0.7));
      expenses.forEach((val, i) => (expenses[i] = val * 0.7));
    }

    return { months, revenues, expenses };
  }

  getServicesData() {
    // Sample data - in real app, this would come from database
    return {
      labels: [
        "Planet Biznesore",
        "Regjistrimi i Bizneseve",
        "Mbyllja e Bizneseve",
        "Dokumentet për Tender",
        "Konsultime Biznesi",
        "Shërbime të Tjera",
      ],
      values: [35, 25, 15, 10, 10, 5],
    };
  }

  loadActivities() {
    const activitiesContainer = document.getElementById("recentActivities");
    if (!activitiesContainer || !window.biznesManager) return;

    const activities = window.biznesManager.activities.slice(0, 5);

    if (activities.length === 0) return;

    // Remove empty state if exists
    const emptyState = activitiesContainer.querySelector(".empty-state");
    if (emptyState) emptyState.remove();

    // Add activities to timeline
    activities.forEach((activity) => {
      const activityEl = document.createElement("div");
      activityEl.className = "timeline-item";
      activityEl.innerHTML = `
                <div class="timeline-date">
                    ${this.formatDate(activity.date)}
                </div>
                <div class="timeline-content">
                    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
                        <i class="fas ${activity.icon}" style="color: var(--secondary-color);"></i>
                        <strong>${activity.title}</strong>
                    </div>
                    <div style="color: var(--gray-600); font-size: 0.875rem;">
                        ${activity.description}
                    </div>
                </div>
            `;

      activitiesContainer.appendChild(activityEl);
    });
  }

  loadDeadlines() {
    const deadlinesBody = document.getElementById("deadlinesBody");
    const noDeadlines = document.getElementById("noDeadlines");

    if (!deadlinesBody || !window.biznesManager) return;

    // Get upcoming deadlines (next 30 days)
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30);

    const deadlines = [
      ...window.biznesManager.businessPlans.filter((p) => p.deadline),
      ...window.biznesManager.tenders.filter((t) => t.deadline),
      ...window.biznesManager.businessClosures.filter(
        (c) => c.estimatedCompletion,
      ),
    ]
      .filter((item) => {
        const deadlineDate = new Date(
          item.deadline || item.estimatedCompletion,
        );
        return deadlineDate >= today && deadlineDate <= nextMonth;
      })
      .sort((a, b) => {
        return (
          new Date(a.deadline || a.estimatedCompletion) -
          new Date(b.deadline || b.estimatedCompletion)
        );
      })
      .slice(0, 10);

    if (deadlines.length === 0) {
      if (noDeadlines) noDeadlines.style.display = "block";
      return;
    }

    if (noDeadlines) noDeadlines.style.display = "none";

    deadlines.forEach((deadline) => {
      const row = document.createElement("tr");
      const deadlineDate = new Date(
        deadline.deadline || deadline.estimatedCompletion,
      );
      const daysLeft = Math.ceil(
        (deadlineDate - today) / (1000 * 60 * 60 * 24),
      );

      let priority = "medium";
      if (daysLeft <= 3) priority = "high";
      if (daysLeft > 14) priority = "low";

      row.innerHTML = `
                <td>
                    <strong>${this.formatDate(deadlineDate.toISOString())}</strong>
                    <div style="font-size: 0.75rem; color: ${this.getDaysLeftColor(daysLeft)};">
                        ${daysLeft} ditë të mbetura
                    </div>
                </td>
                <td>${deadline.title || "Mbyllje Biznesi"}</td>
                <td>
                    ${this.getClientName(deadline.clientId) || "N/A"}
                </td>
                <td>
                    ${
                      deadline.deadline
                        ? "Plan Biznesor"
                        : deadline.estimatedCompletion
                          ? "Mbyllje Biznesi"
                          : "Tender"
                    }
                </td>
                <td>
                    <span class="priority-badge ${priority}">
                        ${
                          priority === "high"
                            ? "Lartë"
                            : priority === "medium"
                              ? "Mesatare"
                              : "I ulët"
                        }
                    </span>
                </td>
                <td>
                    <span class="status-badge ${deadline.status || "pending"}">
                        ${this.getStatusText(deadline.status)}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view" title="Shiko">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" title="Edito">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            `;

      deadlinesBody.appendChild(row);
    });
  }

  getClientName(clientId) {
    if (!window.biznesManager || !window.biznesManager.clients) return "";
    const client = window.biznesManager.clients.find((c) => c.id === clientId);
    return client ? client.name : "";
  }

  getDaysLeftColor(days) {
    if (days <= 3) return "var(--danger-color)";
    if (days <= 7) return "var(--warning-color)";
    return "var(--success-color)";
  }

  getStatusText(status) {
    const statusMap = {
      pending: "Në Pritje",
      in_progress: "Në Progres",
      completed: "Përfunduar",
      rejected: "Refuzuar",
      active: "Aktiv",
      inactive: "Jo Aktiv",
    };
    return statusMap[status] || status;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("sq-AL", options);
  }

  updateCharts() {
    if (this.charts.revenue) {
      const yearSelect = document.getElementById("yearSelect");
      const year = yearSelect ? yearSelect.value : "2024";
      const newData = this.getRevenueData(year);
      this.charts.revenue.data.datasets[0].data = newData.revenues;
      this.charts.revenue.data.datasets[1].data = newData.expenses;
      this.charts.revenue.update();
    }

    if (this.charts.services) {
      const newData = this.getServicesData();
      this.charts.services.data.datasets[0].data = newData.values;
      this.charts.services.update();
    }
  }
}

// Initialize dashboard
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    const dashboard = new DashboardManager();
    window.dashboard = dashboard;
  }, 500);
});
