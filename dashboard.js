// Dashboard functionality and charts

class Dashboard {
  constructor() {
    this.db = db; // Përdor database nga database.js
    this.initCharts();
    this.loadDashboardData();
    this.setupEventListeners();
  }

  // Inicializimi i chart-eve
  initCharts() {
    // Chart-i i të ardhurave mujore
    this.initRevenueChart();

    // Chart-i i shpërndarjes së bizneseve
    this.initBusinessDistributionChart();
  }

  // Ngarkimi i të dhënave të dashboard
  loadDashboardData() {
    const dashboardData = this.db.getDashboardStats();

    if (dashboardData) {
      // Përditëso statistikat
      this.updateStats(dashboardData.stats);

      // Përditëso aktivitetet e fundit
      this.updateRecentActivities(dashboardData.recentActivities);

      // Përditëso chart-et me të dhëna të reja
      this.updateCharts(dashboardData);
    }

    // Ngarko të dhëna të tjera nga database
    this.loadAdditionalData();
  }

  // Përditësimi i statistikave
  updateStats(stats) {
    document.getElementById("totalClients").textContent =
      stats.totalClients.toLocaleString();
    document.getElementById("activeBusinesses").textContent =
      stats.activeBusinesses.toLocaleString();
    document.getElementById("pendingInvoices").textContent =
      stats.pendingInvoices.toLocaleString();
    document.getElementById("totalRevenue").textContent =
      `$${stats.totalRevenue.toLocaleString()}`;
  }

  // Përditësimi i aktiviteteve të fundit
  updateRecentActivities(activities) {
    const container = document.getElementById("recentActivities");
    if (!container) return;

    container.innerHTML = activities
      .map(
        (activity) => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-info">
                    <p class="activity-desc">${activity.description}</p>
                    <span class="activity-time">${activity.date} • ${activity.time}</span>
                </div>
            </div>
        `,
      )
      .join("");
  }

  // Kthen ikonën e duhur sipas llojit të aktivitetit
  getActivityIcon(type) {
    const icons = {
      invoice: "file-invoice-dollar",
      client: "user-plus",
      business: "building",
      tender: "file-contract",
      consultation: "comments",
      document: "file-upload",
    };
    return icons[type] || "bell";
  }

  // Inicializimi i chart-it të të ardhurave
  initRevenueChart() {
    const ctx = document.getElementById("revenueChart");
    if (!ctx) return;

    // Nëse ekziston tashmë një chart, shkatërroje
    if (this.revenueChart) {
      this.revenueChart.destroy();
    }

    this.revenueChart = new Chart(ctx.getContext("2d"), {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Të Ardhurat ($)",
            data: [],
            borderColor: "#4A90E2",
            backgroundColor: "rgba(74, 144, 226, 0.1)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
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
                return "$" + value.toLocaleString();
              },
            },
          },
          x: {
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
          },
        },
      },
    });
  }

  // Inicializimi i chart-it të shpërndarjes së bizneseve
  initBusinessDistributionChart() {
    const ctx = document.getElementById("businessChart");
    if (!ctx) return;

    // Nëse ekziston tashmë një chart, shkatërroje
    if (this.businessChart) {
      this.businessChart.destroy();
    }

    this.businessChart = new Chart(ctx.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: ["#4A90E2", "#50E3C2", "#F5A623", "#9013FE"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              padding: 20,
              usePointStyle: true,
            },
          },
        },
        cutout: "70%",
      },
    });
  }

  // Përditësimi i të dy chart-eve
  updateCharts(dashboardData) {
    if (this.revenueChart && dashboardData.monthlyRevenue) {
      this.revenueChart.data.labels = dashboardData.monthlyRevenue.labels;
      this.revenueChart.data.datasets[0].data =
        dashboardData.monthlyRevenue.data;
      this.revenueChart.update();
    }

    if (this.businessChart && dashboardData.businessDistribution) {
      this.businessChart.data.labels =
        dashboardData.businessDistribution.labels;
      this.businessChart.data.datasets[0].data =
        dashboardData.businessDistribution.data;
      this.businessChart.update();
    }
  }

  // Ngarkimi i të dhënave shtesë
  async loadAdditionalData() {
    try {
      // Merr klientët më të fundit
      const clients = this.db.getClients();
      this.displayRecentClients(clients.slice(0, 5));

      // Merr tenderat aktive
      const activeTenders = this.db.getTenders({ status: "aktiv" });
      this.displayActiveTenders(activeTenders.slice(0, 3));

      // Merr faturat e papaguara
      const pendingInvoices = this.db.getInvoices({ status: "në pritje" });
      this.displayPendingInvoices(pendingInvoices.slice(0, 3));
    } catch (error) {
      console.error("Gabim gjatë ngarkimit të të dhënave:", error);
    }
  }

  // Shfaq klientët e fundit
  displayRecentClients(clients) {
    const container = document.getElementById("recentClients");
    if (!container) return;

    container.innerHTML = clients
      .map(
        (client) => `
            <div class="client-card">
                <div class="client-avatar">
                    ${client.name.charAt(0)}
                </div>
                <div class="client-info">
                    <h4>${client.name}</h4>
                    <p>${client.type} • ${client.status}</p>
                </div>
                <span class="client-date">${this.formatDate(client.regDate)}</span>
            </div>
        `,
      )
      .join("");
  }

  // Shfaq tenderat aktive
  displayActiveTenders(tenders) {
    const container = document.getElementById("activeTenders");
    if (!container) return;

    container.innerHTML = tenders
      .map(
        (tender) => `
            <div class="tender-card">
                <div class="tender-header">
                    <h4>${tender.title}</h4>
                    <span class="tender-status ${tender.status}">${tender.status}</span>
                </div>
                <p class="tender-institution">${tender.institution}</p>
                <div class="tender-details">
                    <span class="tender-deadline">
                        <i class="far fa-calendar-alt"></i>
                        Afati: ${this.formatDate(tender.deadline)}
                    </span>
                    <span class="tender-value">
                        <i class="fas fa-dollar-sign"></i>
                        Vlera: $${tender.value.toLocaleString()}
                    </span>
                </div>
            </div>
        `,
      )
      .join("");
  }

  // Shfaq faturat e papaguara
  displayPendingInvoices(invoices) {
    const container = document.getElementById("pendingInvoicesList");
    if (!container) return;

    container.innerHTML = invoices
      .map(
        (invoice) => `
            <div class="invoice-card">
                <div class="invoice-header">
                    <h4>${invoice.number}</h4>
                    <span class="invoice-amount">$${invoice.amount.toLocaleString()}</span>
                </div>
                <p class="invoice-client">${invoice.clientName}</p>
                <div class="invoice-details">
                    <span class="invoice-date">
                        <i class="far fa-calendar-alt"></i>
                        ${this.formatDate(invoice.dueDate)}
                    </span>
                    <span class="invoice-status ${invoice.status}">
                        ${invoice.status}
                    </span>
                </div>
            </div>
        `,
      )
      .join("");
  }

  // Formatimi i datës
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("sq-AL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  // Setup event listeners
  setupEventListeners() {
    // Butoni refresh për dashboard
    const refreshBtn = document.getElementById("refreshDashboard");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        this.refreshDashboard();
      });
    }

    // Filtri i periudhës kohore
    const periodFilter = document.getElementById("periodFilter");
    if (periodFilter) {
      periodFilter.addEventListener("change", (e) => {
        this.filterByPeriod(e.target.value);
      });
    }
  }

  // Rifreskimi i dashboard
  refreshDashboard() {
    // Shfaq animacion loading
    const refreshBtn = document.getElementById("refreshDashboard");
    if (refreshBtn) {
      const originalHtml = refreshBtn.innerHTML;
      refreshBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Rifreskim...';
      refreshBtn.disabled = true;

      // Simulo një delay për ngarkim
      setTimeout(() => {
        this.loadDashboardData();
        refreshBtn.innerHTML = originalHtml;
        refreshBtn.disabled = false;

        // Shfaq mesazh të suksesit
        this.showNotification("Dashboard u rifreskua me sukses!", "success");
      }, 1000);
    }
  }

  // Filtri sipas periudhës kohore
  filterByPeriod(period) {
    // Këtu mund të implementohet logjika e filtrit të periudhës
    console.log("Filter by period:", period);

    // Për shembull, mund të përditësohen chart-et bazuar në periudhën
    this.showNotification(
      `Të dhënat u filtruan për periudhën: ${period}`,
      "info",
    );
  }

  // Shfaq një njoftim
  showNotification(message, type = "info") {
    // Krijo elementin e njoftimit
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
            <i class="fas fa-${type === "success" ? "check-circle" : "info-circle"}"></i>
            <span>${message}</span>
        `;

    // Shto në body
    document.body.appendChild(notification);

    // Shfaq
    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    // Fshi pas 3 sekondash
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Metoda për eksportimin e raporteve
  exportReport(format = "pdf") {
    // Këtu mund të implementohet logjika për eksportimin e raporteve
    console.log(`Exporting report in ${format} format`);
    this.showNotification(
      `Raporti po eksportohet në format ${format.toUpperCase()}...`,
      "info",
    );

    // Simulo procesin e eksportimit
    setTimeout(() => {
      this.showNotification("Raporti u eksportua me sukses!", "success");
    }, 2000);
  }
}

// Inicializimi i dashboard kur faqja ngarkohet
document.addEventListener("DOMContentLoaded", () => {
  // Kontrollo nëse jemi në faqen e dashboard
  if (document.querySelector(".dashboard-container")) {
    window.dashboard = new Dashboard();

    // Ekspozo metoda globale për butonat
    window.refreshDashboard = () => dashboard.refreshDashboard();
    window.exportReport = (format) => dashboard.exportReport(format);
  }
});

// Funksione globale për përdorim në HTML
function showDashboardStats() {
  if (window.dashboard) {
    window.dashboard.loadDashboardData();
  }
}

function filterDashboard(period) {
  if (window.dashboard) {
    window.dashboard.filterByPeriod(period);
  }
}
