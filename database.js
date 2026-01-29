// Simulim i një database të thjeshtë për Biznes Manager

class Database {
  constructor() {
    // Inicializimi i të dhënave në localStorage
    this.initDatabase();
  }

  initDatabase() {
    // Kontrollo nëse ekzistojnë të dhënat, nëse jo krijo ato fillestare
    if (!localStorage.getItem("biznesManager")) {
      const initialData = {
        // Dashboard data
        dashboard: {
          stats: {
            totalClients: 124,
            activeBusinesses: 45,
            pendingInvoices: 23,
            totalRevenue: 284500,
          },
          recentActivities: [
            {
              id: 1,
              type: "invoice",
              description: "Faturë e re për Klientin A",
              date: "2024-01-15",
              time: "10:30",
            },
            {
              id: 2,
              type: "client",
              description: "Klient i ri i shtuar",
              date: "2024-01-14",
              time: "14:20",
            },
            {
              id: 3,
              type: "business",
              description: "Biznes i ri i regjistruar",
              date: "2024-01-13",
              time: "09:15",
            },
            {
              id: 4,
              type: "tender",
              description: "Aplikim për tender",
              date: "2024-01-12",
              time: "16:45",
            },
          ],
          monthlyRevenue: {
            labels: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "Maj",
              "Qer",
              "Kor",
              "Gus",
              "Sht",
              "Tet",
              "Nën",
              "Dhj",
            ],
            data: [
              12000, 19000, 15000, 25000, 22000, 30000, 28000, 32000, 29000,
              35000, 38000, 42000,
            ],
          },
          businessDistribution: {
            labels: ["Sh.P.K", "N.D", "Person Fizik", "Degë e Huaj"],
            data: [45, 30, 15, 10],
          },
        },

        // Client data
        clients: [
          {
            id: 1,
            name: "Agro Sh.P.K",
            type: "Sh.P.K",
            contact: "Agron Kryeziu",
            email: "info@agro.shpk",
            phone: "+355 69 123 4567",
            status: "aktiv",
            regDate: "2023-01-15",
          },
          {
            id: 2,
            name: "Tech Solutions N.D",
            type: "N.D",
            contact: "Ana Marku",
            email: "ana@techsolutions.al",
            phone: "+355 68 234 5678",
            status: "aktiv",
            regDate: "2023-02-20",
          },
          {
            id: 3,
            name: "Dritan Hoxha",
            type: "Person Fizik",
            contact: "Dritan Hoxha",
            email: "dritan.hoxha@gmail.com",
            phone: "+355 67 345 6789",
            status: "pasiv",
            regDate: "2023-03-10",
          },
          {
            id: 4,
            name: "Global Corp Degë",
            type: "Degë e Huaj",
            contact: "John Smith",
            email: "jsmith@globalcorp.com",
            phone: "+355 69 456 7890",
            status: "aktiv",
            regDate: "2023-04-05",
          },
        ],

        // Business plans
        businessPlans: [
          {
            id: 1,
            title: "Plan Marketingu për 2024",
            clientId: 1,
            clientName: "Agro Sh.P.K",
            status: "përfunduar",
            dueDate: "2024-02-28",
            priority: "medium",
          },
          {
            id: 2,
            title: "Analizë e Tregut",
            clientId: 2,
            clientName: "Tech Solutions N.D",
            status: "në progres",
            dueDate: "2024-03-15",
            priority: "high",
          },
          {
            id: 3,
            title: "Strategji Financiare",
            clientId: 4,
            clientName: "Global Corp Degë",
            status: "në pritje",
            dueDate: "2024-01-30",
            priority: "low",
          },
        ],

        // Businesses
        businesses: [
          {
            id: 1,
            name: "Agro Sh.P.K",
            nui: "L12345678A",
            regDate: "2023-01-15",
            status: "aktiv",
            type: "Sh.P.K",
            address: "Tirane, Albania",
          },
          {
            id: 2,
            name: "Tech Solutions N.D",
            nui: "L87654321B",
            regDate: "2023-02-20",
            status: "aktiv",
            type: "N.D",
            address: "Durres, Albania",
          },
          {
            id: 3,
            name: "Dritan Hoxha",
            nui: "123456789",
            regDate: "2023-03-10",
            status: "pasiv",
            type: "Person Fizik",
            address: "Vlore, Albania",
          },
        ],

        // Tenders
        tenders: [
          {
            id: 1,
            title: "Furnizim i Pajisjeve Zyre",
            institution: "Ministria e Financave",
            deadline: "2024-02-15",
            value: 250000,
            status: "aktiv",
            documents: ["oferta.pdf", "cv_kompanise.pdf"],
          },
          {
            id: 2,
            title: "Ndërtim i Infrastrukturës",
            institution: "Bashkia Tiranë",
            deadline: "2024-03-01",
            value: 1500000,
            status: "aktiv",
            documents: ["teknike.pdf", "financiare.xlsx"],
          },
          {
            id: 3,
            title: "Shërbime IT",
            institution: "Universiteti i Tiranës",
            deadline: "2024-01-20",
            value: 80000,
            status: "mbyllur",
            documents: ["propozimi.pdf"],
          },
        ],

        // Consultations
        consultations: [
          {
            id: 1,
            clientId: 1,
            clientName: "Agro Sh.P.K",
            date: "2024-01-10",
            type: "telefonike",
            duration: "30 min",
            notes: "Diskutim për zgjerim të biznesit",
          },
          {
            id: 2,
            clientId: 2,
            clientName: "Tech Solutions N.D",
            date: "2024-01-12",
            type: "në zyrë",
            duration: "1 orë",
            notes: "Planifikim strategjik",
          },
        ],

        // Accounting
        invoices: [
          {
            id: 1,
            number: "INV-2024-001",
            clientId: 1,
            clientName: "Agro Sh.P.K",
            amount: 1500,
            date: "2024-01-05",
            dueDate: "2024-02-05",
            status: "e paguar",
          },
          {
            id: 2,
            number: "INV-2024-002",
            clientId: 2,
            clientName: "Tech Solutions N.D",
            amount: 2500,
            date: "2024-01-10",
            dueDate: "2024-02-10",
            status: "në pritje",
          },
          {
            id: 3,
            number: "INV-2024-003",
            clientId: 4,
            clientName: "Global Corp Degë",
            amount: 3500,
            date: "2024-01-12",
            dueDate: "2024-02-12",
            status: "e vonuar",
          },
        ],

        // Documents
        documents: [
          {
            id: 1,
            name: "Kontratë Agro Sh.P.K",
            type: "kontratë",
            clientId: 1,
            uploadDate: "2023-01-20",
            size: "2.4 MB",
          },
          {
            id: 2,
            name: "Licencë Operimi",
            type: "licencë",
            clientId: 2,
            uploadDate: "2023-02-25",
            size: "1.8 MB",
          },
          {
            id: 3,
            name: "Raport Vjetor 2023",
            type: "raport",
            clientId: 4,
            uploadDate: "2024-01-05",
            size: "5.2 MB",
          },
        ],
      };

      localStorage.setItem("biznesManager", JSON.stringify(initialData));
    }
  }

  // Metoda për marrjen e të gjitha të dhënave
  getAllData() {
    const data = localStorage.getItem("biznesManager");
    return data ? JSON.parse(data) : null;
  }

  // Metoda për përditësimin e të dhënave
  updateData(key, value) {
    const data = this.getAllData();
    if (data) {
      data[key] = value;
      localStorage.setItem("biznesManager", JSON.stringify(data));
      return true;
    }
    return false;
  }

  // Metoda për shtimin e një rekordi të ri
  addRecord(category, record) {
    const data = this.getAllData();
    if (data && data[category]) {
      // Gjej ID-në maksimale
      const maxId = data[category].reduce(
        (max, item) => Math.max(max, item.id || 0),
        0,
      );
      record.id = maxId + 1;
      data[category].push(record);
      localStorage.setItem("biznesManager", JSON.stringify(data));
      return record;
    }
    return null;
  }

  // Metoda për fshirjen e një rekordi
  deleteRecord(category, id) {
    const data = this.getAllData();
    if (data && data[category]) {
      const initialLength = data[category].length;
      data[category] = data[category].filter((item) => item.id !== id);

      if (data[category].length < initialLength) {
        localStorage.setItem("biznesManager", JSON.stringify(data));
        return true;
      }
    }
    return false;
  }

  // Metoda për përditësimin e një rekordi
  updateRecord(category, id, updatedData) {
    const data = this.getAllData();
    if (data && data[category]) {
      const index = data[category].findIndex((item) => item.id === id);
      if (index !== -1) {
        data[category][index] = { ...data[category][index], ...updatedData };
        localStorage.setItem("biznesManager", JSON.stringify(data));
        return data[category][index];
      }
    }
    return null;
  }

  // Metoda për filtrimin e të dhënave
  filterRecords(category, filters) {
    const data = this.getAllData();
    if (!data || !data[category]) return [];

    return data[category].filter((item) => {
      for (const key in filters) {
        if (
          filters[key] !== "" &&
          filters[key] !== null &&
          filters[key] !== undefined
        ) {
          if (key === "search") {
            // Kërkim nëpër të gjitha fushat e stringut
            const searchTerm = filters[key].toLowerCase();
            const itemValues = Object.values(item).join(" ").toLowerCase();
            if (!itemValues.includes(searchTerm)) return false;
          } else if (item[key] !== filters[key]) {
            return false;
          }
        }
      }
      return true;
    });
  }

  // Metoda për marrjen e statistikave të dashboard
  getDashboardStats() {
    const data = this.getAllData();
    return data ? data.dashboard : null;
  }

  // Metoda për marrjen e klientëve
  getClients(filters = {}) {
    const data = this.getAllData();
    if (!data) return [];

    if (Object.keys(filters).length === 0) {
      return data.clients;
    }

    return this.filterRecords("clients", filters);
  }

  // Metoda për marrjen e tenderave
  getTenders(filters = {}) {
    const data = this.getAllData();
    if (!data) return [];

    if (Object.keys(filters).length === 0) {
      return data.tenders;
    }

    return this.filterRecords("tenders", filters);
  }

  // Metoda për marrjen e faturave
  getInvoices(filters = {}) {
    const data = this.getAllData();
    if (!data) return [];

    if (Object.keys(filters).length === 0) {
      return data.invoices;
    }

    return this.filterRecords("invoices", filters);
  }
}

// Krijo një instancë globale të database
const db = new Database();
