function checkBudgetAlerts() {
    var alertContainer = document.getElementById("alertBanner");
    if (!alertContainer) return;
    
    var overBudgetCategories = [];
    
    for (var i = 0; i < budgets.length; i++) {
        var spent = calculateSpentByCategory(budgets[i].category);
        if (spent > budgets[i].limit) {
            overBudgetCategories.push(budgets[i].category);
        }
    }
    
    if (overBudgetCategories.length > 0) {
        alertContainer.innerHTML = '⚠️ You have exceeded your budget in: ' + overBudgetCategories.join(", ");
        alertContainer.classList.remove("hidden");
    } else {
        alertContainer.classList.add("hidden");
    }
}
