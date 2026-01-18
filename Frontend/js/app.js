
document.addEventListener('DOMContentLoaded', function () {
    // Initialize app
    initializeApp();
});

function initializeApp() {
    includeHTML();

    setTimeout(() => {
        highlightActiveNav();
        updateNavigation();
    }, 200);

    initPageSpecific();

    setupGlobalListeners();
}

function initPageSpecific() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    switch (currentPage) {
        case 'dashboard.html':
            initDashboard();
            break;
        case 'add-transaction.html':
            initAddTransaction();
            break;
        case 'login.html':
            initLogin();
            break;
        case 'register.html':
            initRegister();
            break;
        case 'goals.html':
            initGoals();
            break;
        default:
            // Landing and static pages
            initLandingPage();
    }
}

/**
 * Initialize dashboard page
 */
function initDashboard() {
    // Require authentication
    requireAuth();

    setTimeout(() => {
        loadDashboardData();
    }, 300);
}


function loadDashboardData() {
    const transactions = getTransactions();
    const monthlyTransactions = getMonthlyTransactions(transactions);

    const income = calculateTotalIncome(transactions);
    const expenses = calculateTotalExpenses(transactions);
    const balance = calculateBalance(income, expenses);

    const comparison = calculateMonthlyComparison(transactions);

    updateSummaryCards({
        income,
        expenses,
        balance,
        changes: {
            income: comparison.changes.income,
            expense: comparison.changes.expenses
        }
    });

    const recentTransactions = getRecentTransactions(transactions, 10);
    renderTransactionList(recentTransactions);

    const categoryBudgets = {
        food: 500,
        transport: 200,
        shopping: 300,
        entertainment: 150
    };

    const budgetStatus = getCategoryBudgetStatus(transactions, categoryBudgets);
    updateBudgetProgress(budgetStatus);

    const categoryTotals = getCategoryTotals(monthlyTransactions, 'expense');
    renderCategoryChart(categoryTotals);

    addFadeInAnimation('.summary-card', 100);
}


function initAddTransaction() {
    requireAuth();

    const form = document.getElementById('transaction-form');
    if (form) {
        form.addEventListener('submit', handleTransactionSubmit);
    }

    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }
}


function handleTransactionSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const transaction = {
        id: generateId(),
        type: formData.get('type'),
        amount: parseFloat(formData.get('amount')),
        category: formData.get('category'),
        description: formData.get('description'),
        date: formData.get('date'),
        createdAt: new Date().toISOString()
    };

    // Validate
    if (!transaction.amount || transaction.amount <= 0) {
        showError('Please enter a valid amount');
        return;
    }

    if (!transaction.description.trim()) {
        showError('Please enter a description');
        return;
    }

    // Save transaction
    const transactions = getTransactions();
    transactions.push(transaction);
    saveTransactions(transactions);

    showSuccess('Transaction added successfully!');

    form.reset();
    document.getElementById('date').valueAsDate = new Date();

    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

function initLogin() {
    if (isAuthenticated()) {
        window.location.href = 'dashboard.html';
        return;
    }

    const form = document.getElementById('login-form');
    if (form) {
        form.addEventListener('submit', handleLogin);
    }
}

function handleLogin(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');

    // Validate
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }

    if (!password || password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }

    // Simulated login (no backend)
    const user = {
        id: generateId(),
        name: email.split('@')[0],
        email: email,
        loginDate: new Date().toISOString()
    };

    setUser(user);
    showSuccess('Login successful!');

    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

function initRegister() {
    if (isAuthenticated()) {
        window.location.href = 'dashboard.html';
        return;
    }

    const form = document.getElementById('register-form');
    if (form) {
        form.addEventListener('submit', handleRegister);
    }
}


function handleRegister(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm-password');

    // Validate
    if (!name || name.trim().length < 2) {
        showError('Please enter your name');
        return;
    }

    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }

    if (!password || password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }

    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }

    const user = {
        id: generateId(),
        name: name.trim(),
        email: email,
        registeredDate: new Date().toISOString()
    };

    setUser(user);
    showSuccess('Registration successful!');

    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}


function initGoals() {
    requireAuth();
    showInfo('Savings goals feature coming soon!');
}

/**
 * Initialize landing page
 */
function initLandingPage() {
    // Add scroll animations
    addFadeInAnimation('.glass-card', 150);
}


function setupGlobalListeners() {
    document.addEventListener('click', (e) => {
        if (e.target.matches('[data-action="logout"]')) {
            e.preventDefault();
            logout();
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target.matches('[data-action="toggle-menu"]')) {
            e.preventDefault();
            toggleMobileMenu();
        }
    });
}


function deleteTransaction(id) {
    if (!confirm('Are you sure you want to delete this transaction?')) {
        return;
    }

    let transactions = getTransactions();
    transactions = transactions.filter(t => t.id !== id);
    saveTransactions(transactions);

    showSuccess('Transaction deleted');

    loadDashboardData();
}

function editTransaction(id) {
    showInfo('Edit functionality coming soon!');
}

window.deleteTransaction = deleteTransaction;
window.editTransaction = editTransaction;
window.logout = logout;

