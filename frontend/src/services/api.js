const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

let isBackendReachable = true;

// Default Static Seed Data for Mock Mode
const defaultCategories = [
  { id: 1, name: "Salary", description: "Monthly paycheck", color: "#10b981", created_at: "2026-07-01T00:00:00Z" },
  { id: 2, name: "Food & Dining", description: "Groceries and restaurants", color: "#f59e0b", created_at: "2026-07-01T00:00:00Z" },
  { id: 3, name: "Rent & Housing", description: "Rent and utility bills", color: "#3b82f6", created_at: "2026-07-01T00:00:00Z" },
  { id: 4, name: "Entertainment", description: "Movies, games, events", color: "#8b5cf6", created_at: "2026-07-01T00:00:00Z" },
  { id: 5, name: "Transportation", description: "Fuel, public transit, Uber", color: "#ef4444", created_at: "2026-07-01T00:00:00Z" },
  { id: 6, name: "Shopping", description: "Clothes, electronics, accessories", color: "#ec4899", created_at: "2026-07-01T00:00:00Z" },
  { id: 7, name: "Investments", description: "Mutual funds, stocks", color: "#06b6d4", created_at: "2026-07-01T00:00:00Z" }
];

const defaultExpenses = [
  // Incomes (July 2026)
  { id: 1, description: "Regular Paycheck", amount: 50000.0, category_id: 1, type: "income", date: "2026-07-01T09:00:00Z", tags: "salary,monthly" },
  { id: 2, description: "Freelance Project", amount: 8500.0, category_id: 1, type: "income", date: "2026-07-10T14:30:00Z", tags: "freelance,side-hustle" },
  
  // Expenses (July 2026)
  { id: 3, description: "Apartment Rent", amount: 15000.0, category_id: 3, type: "expense", date: "2026-07-01T10:00:00Z", tags: "rent" },
  { id: 4, description: "Weekly Groceries", amount: 1200.0, category_id: 2, type: "expense", date: "2026-07-03T11:00:00Z", tags: "groceries" },
  { id: 5, description: "Netflix Subscription", amount: 199.0, category_id: 4, type: "expense", date: "2026-07-05T08:00:00Z", tags: "subscription,streaming" },
  { id: 6, description: "Gas Station", amount: 800.0, category_id: 5, type: "expense", date: "2026-07-06T18:15:00Z", tags: "fuel" },
  { id: 7, description: "Dinner with friends", amount: 1500.0, category_id: 2, type: "expense", date: "2026-07-08T20:30:00Z", tags: "restaurant" },
  { id: 8, description: "New Headphones", amount: 3500.0, category_id: 6, type: "expense", date: "2026-07-09T16:00:00Z", tags: "electronics" },
  { id: 9, description: "Electric Bill", amount: 2200.0, category_id: 3, type: "expense", date: "2026-07-11T12:00:00Z", tags: "utilities" },
  { id: 10, description: "Movie Ticket", amount: 350.0, category_id: 4, type: "expense", date: "2026-07-12T21:00:00Z", tags: "cinema" },
  { id: 11, description: "Weekly Groceries", amount: 1400.0, category_id: 2, type: "expense", date: "2026-07-13T10:30:00Z", tags: "groceries" },

  // Incomes (June 2026)
  { id: 12, description: "Regular Paycheck", amount: 50000.0, category_id: 1, type: "income", date: "2026-06-01T09:00:00Z", tags: "salary" },
  
  // Expenses (June 2026)
  { id: 13, description: "Apartment Rent", amount: 15000.0, category_id: 3, type: "expense", date: "2026-06-01T10:00:00Z", tags: "rent" },
  { id: 14, description: "Groceries", amount: 4500.0, category_id: 2, type: "expense", date: "2026-06-10T12:00:00Z", tags: "groceries" },
  { id: 15, description: "Electricity Bill", amount: 2000.0, category_id: 3, type: "expense", date: "2026-06-12T12:00:00Z", tags: "utilities" },
  { id: 16, description: "Dinner Out", amount: 1200.0, category_id: 2, type: "expense", date: "2026-06-15T20:00:00Z", tags: "restaurant" },
  { id: 17, description: "Bus Pass", amount: 600.0, category_id: 5, type: "expense", date: "2026-06-20T08:00:00Z", tags: "commute" }
];

const defaultBudgets = [
  { id: 1, category_id: 2, amount: 5000.0, month: 7, year: 2026 },
  { id: 2, category_id: 2, amount: 5000.0, month: 6, year: 2026 },
  { id: 3, category_id: 4, amount: 2000.0, month: 7, year: 2026 },
  { id: 4, category_id: 5, amount: 1500.0, month: 7, year: 2026 },
  { id: 5, category_id: 6, amount: 4000.0, month: 7, year: 2026 }
];

// Local Storage Helper functions
const getStoredData = (key, defaultData) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultData;
  }
};

const saveStoredData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const apiClient = {
  async get(endpoint) {
    if (isBackendReachable) {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (response.ok) {
          return response.json();
        }
        throw new Error(`API Error: ${response.statusText}`);
      } catch (error) {
        console.warn("Backend server is unreachable. Falling back to local storage.", error);
        isBackendReachable = false;
      }
    }

    // Mock implementation for GET requests
    if (endpoint.startsWith("/stats")) {
      const urlParams = new URLSearchParams(endpoint.split('?')[1] || "");
      const m = parseInt(urlParams.get('month')) || new Date().getMonth() + 1;
      const y = parseInt(urlParams.get('year')) || new Date().getFullYear();

      const categories = getStoredData("et_categories", defaultCategories);
      const expenses = getStoredData("et_expenses", defaultExpenses);
      const budgets = getStoredData("et_budgets", defaultBudgets);

      const filtered = expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() + 1 === m && d.getFullYear() === y;
      });

      const total_income = filtered.filter(e => e.type === "income").reduce((acc, curr) => acc + curr.amount, 0);
      const total_expenses = filtered.filter(e => e.type === "expense").reduce((acc, curr) => acc + curr.amount, 0);
      const current_balance = total_income - total_expenses;

      const category_breakdown = {};
      filtered.filter(e => e.type === "expense").forEach(e => {
        const cat = categories.find(c => c.id === e.category_id);
        const catName = cat ? cat.name : "Uncategorized";
        category_breakdown[catName] = (category_breakdown[catName] || 0) + e.amount;
      });

      const monthly_data = [];
      for (let monthNum = 1; monthNum <= 12; monthNum++) {
        const monthTxs = expenses.filter(e => {
          const d = new Date(e.date);
          return d.getFullYear() === y && d.getMonth() + 1 === monthNum;
        });
        const mInc = monthTxs.filter(e => e.type === "income").reduce((acc, curr) => acc + curr.amount, 0);
        const mExp = monthTxs.filter(e => e.type === "expense").reduce((acc, curr) => acc + curr.amount, 0);
        monthly_data.push({
          month: monthNum,
          income: mInc,
          expense: mExp,
          total: mExp
        });
      }

      const budget_alerts = [];
      const activeBudgets = budgets.filter(b => b.month === m && b.year === y);
      activeBudgets.forEach(b => {
        const catTotal = filtered.filter(e => e.category_id === b.category_id && e.type === "expense").reduce((acc, curr) => acc + curr.amount, 0);
        if (catTotal > b.amount) {
          const cat = categories.find(c => c.id === b.category_id);
          budget_alerts.push({
            category: cat ? cat.name : "Uncategorized",
            limit: b.amount,
            spent: catTotal,
            exceeded_by: catTotal - b.amount
          });
        }
      });

      return {
        total_income,
        total_expenses,
        current_balance,
        category_breakdown,
        monthly_data,
        budget_alerts
      };
    }

    if (endpoint === "/categories") {
      return getStoredData("et_categories", defaultCategories);
    }

    if (endpoint.startsWith("/expenses")) {
      const expenses = getStoredData("et_expenses", defaultExpenses);
      const categories = getStoredData("et_categories", defaultCategories);
      
      const enriched = expenses.map(e => ({
        ...e,
        category: categories.find(c => c.id === e.category_id) || null
      }));
      enriched.sort((a, b) => new Date(b.date) - new Date(a.date));
      return enriched;
    }

    return null;
  },

  async post(endpoint, data) {
    if (isBackendReachable) {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          return response.json();
        }
        const error = await response.json();
        throw new Error(error.detail || "API Error");
      } catch (error) {
        console.warn("Backend server is unreachable. Falling back to local storage.", error);
        isBackendReachable = false;
      }
    }

    // Mock implementation for POST requests
    if (endpoint === "/categories") {
      const categories = getStoredData("et_categories", defaultCategories);
      const newCat = {
        id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
        name: data.name,
        description: data.description || "",
        color: data.color || "#3b82f6",
        created_at: new Date().toISOString()
      };
      categories.push(newCat);
      saveStoredData("et_categories", categories);
      return newCat;
    }

    if (endpoint === "/expenses") {
      const expenses = getStoredData("et_expenses", defaultExpenses);
      const categories = getStoredData("et_categories", defaultCategories);
      const newExp = {
        id: expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1,
        description: data.description,
        amount: parseFloat(data.amount),
        category_id: parseInt(data.category_id),
        type: data.type || "expense",
        tags: data.tags || "",
        date: data.date || new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      expenses.push(newExp);
      saveStoredData("et_expenses", expenses);
      newExp.category = categories.find(c => c.id === newExp.category_id) || null;
      return newExp;
    }

    if (endpoint === "/budget-limits") {
      const budgets = getStoredData("et_budgets", defaultBudgets);
      const categories = getStoredData("et_categories", defaultCategories);
      const newB = {
        id: budgets.length > 0 ? Math.max(...budgets.map(b => b.id)) + 1 : 1,
        category_id: parseInt(data.category_id),
        amount: parseFloat(data.amount),
        month: parseInt(data.month),
        year: parseInt(data.year),
        created_at: new Date().toISOString()
      };
      budgets.push(newB);
      saveStoredData("et_budgets", budgets);
      newB.category = categories.find(c => c.id === newB.category_id) || null;
      return newB;
    }

    return null;
  },

  async put(endpoint, data) {
    if (isBackendReachable) {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          return response.json();
        }
        const error = await response.json();
        throw new Error(error.detail || "API Error");
      } catch (error) {
        console.warn("Backend server is unreachable. Falling back to local storage.", error);
        isBackendReachable = false;
      }
    }

    // Mock implementation for PUT requests
    if (endpoint.startsWith("/categories/")) {
      const categories = getStoredData("et_categories", defaultCategories);
      const id = parseInt(endpoint.split('/').pop());
      const catIdx = categories.findIndex(c => c.id === id);
      if (catIdx !== -1) {
        categories[catIdx] = { ...categories[catIdx], ...data };
        saveStoredData("et_categories", categories);
        return categories[catIdx];
      }
    }

    if (endpoint.startsWith("/expenses/")) {
      const expenses = getStoredData("et_expenses", defaultExpenses);
      const categories = getStoredData("et_categories", defaultCategories);
      const id = parseInt(endpoint.split('/').pop());
      const expIdx = expenses.findIndex(e => e.id === id);
      if (expIdx !== -1) {
        expenses[expIdx] = { 
          ...expenses[expIdx], 
          ...data,
          amount: data.amount !== undefined ? parseFloat(data.amount) : expenses[expIdx].amount,
          category_id: data.category_id !== undefined ? parseInt(data.category_id) : expenses[expIdx].category_id,
          updated_at: new Date().toISOString()
        };
        saveStoredData("et_expenses", expenses);
        const updatedExp = expenses[expIdx];
        updatedExp.category = categories.find(c => c.id === updatedExp.category_id) || null;
        return updatedExp;
      }
    }

    return null;
  },

  async delete(endpoint) {
    if (isBackendReachable) {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: "DELETE",
        });
        if (response.ok) {
          return response.json();
        }
        throw new Error(`API Error: ${response.statusText}`);
      } catch (error) {
        console.warn("Backend server is unreachable. Falling back to local storage.", error);
        isBackendReachable = false;
      }
    }

    // Mock implementation for DELETE requests
    if (endpoint.startsWith("/categories/")) {
      const categories = getStoredData("et_categories", defaultCategories);
      const id = parseInt(endpoint.split('/').pop());
      const updated = categories.filter(c => c.id !== id);
      saveStoredData("et_categories", updated);

      const expenses = getStoredData("et_expenses", defaultExpenses);
      const updatedExpenses = expenses.filter(e => e.category_id !== id);
      saveStoredData("et_expenses", updatedExpenses);

      const budgets = getStoredData("et_budgets", defaultBudgets);
      const updatedBudgets = budgets.filter(b => b.category_id !== id);
      saveStoredData("et_budgets", updatedBudgets);

      return { message: "Category deleted" };
    }

    if (endpoint.startsWith("/expenses/")) {
      const expenses = getStoredData("et_expenses", defaultExpenses);
      const id = parseInt(endpoint.split('/').pop());
      const updated = expenses.filter(e => e.id !== id);
      saveStoredData("et_expenses", updated);
      return { message: "Expense deleted" };
    }

    return null;
  },

  async downloadCSV() {
    if (isBackendReachable) {
      try {
        const response = await fetch(`${API_BASE_URL}/expenses/export/csv`);
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `expenses-${new Date().toISOString().split("T")[0]}.csv`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
          return;
        }
      } catch (error) {
        console.warn("Backend server is unreachable for CSV download. Generating client-side.", error);
      }
    }

    // Client-side CSV generation
    const expenses = getStoredData("et_expenses", defaultExpenses);
    const categories = getStoredData("et_categories", defaultCategories);
    
    let csvContent = "Date,Type,Description,Amount,Category,Tags\n";
    expenses.forEach(e => {
      const cat = categories.find(c => c.id === e.category_id);
      const catName = cat ? cat.name : "Uncategorized";
      const dateStr = new Date(e.date).toISOString().split('T')[0];
      csvContent += `"${dateStr}","${e.type}","${e.description.replace(/"/g, '""')}",$${e.amount.toFixed(2)},"${catName}","${e.tags}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
};
