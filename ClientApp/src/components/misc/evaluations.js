
export function evaluateProjectDuration(project) {
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);

    const startYear = start.getFullYear();
    const startMonth = start.getMonth();

    const endYear = end.getFullYear();
    const endMonth = end.getMonth();

    const monthCount = (endYear - startYear) * 12 + (endMonth - startMonth);

    if (monthCount < 3) {
        return 1;
    } else if (monthCount >= 3 && monthCount <= 6) {
        return 2;
    } else if (monthCount >= 7 && monthCount <= 18) {
        return 3;
    } else if (monthCount >= 19 && monthCount <= 28) {
        return 4;
    } else if (monthCount >= 29 && monthCount <= 36) {
        return 5;
    } else if (monthCount >= 37 && monthCount <= 60) {
        return 6;
    } else if (monthCount >= 61 && monthCount <= 84) {
        return 7;
    } else if (monthCount >= 85 && monthCount <= 120) {
        return 8;
    } else if (monthCount >= 121 && monthCount <= 180) {
        return 9;
    } else {
        return 10;
    }
}

export function evaluateProjectBudget(project) {
    const budget = project.budget;
}

export function evaluateProjectScope() {
    
}