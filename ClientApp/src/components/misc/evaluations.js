const totalBudget = 100000000000;
const locations = 5;
const employees = 2500;

function mainEvaluatePercent(percentage) {
    if (percentage < 11) {
        return 1;
    } else if (percentage >= 11 && percentage <= 20) {
        return 2;
    } else if (percentage >= 21 && percentage <= 30) {
        return 3;
    } else if (percentage >= 31 && percentage <= 40) {
        return 4;
    } else if (percentage >= 41 && percentage <= 50) {
        return 5;
    } else if (percentage >= 51 && percentage <= 60) {
        return 6;
    } else if (percentage >= 61 && percentage <= 70) {
        return 7;
    } else if (percentage >= 71 && percentage <= 80) {
        return 8;
    } else if (percentage >= 81 && percentage <= 90) {
        return 9;
    } else {
        return 10;
    }
}

function evaluatePercentCosts(percentage) {
    if (percentage > 90) {
        return 1;
    } else if (percentage >= 81 && percentage <= 90) {
        return 2;
    } else if (percentage >= 71 && percentage <= 80) {
        return 3;
    } else if (percentage >= 61 && percentage <= 70) {
        return 4;
    } else if (percentage >= 51 && percentage <= 60) {
        return 5;
    } else if (percentage >= 41 && percentage <= 50) {
        return 6;
    } else if (percentage >= 31 && percentage <= 40) {
        return 7;
    } else if (percentage >= 21 && percentage <= 30) {
        return 8;
    } else if (percentage >= 11 && percentage <= 20) {
        return 9;
    } else {
        return 10;
    }
}

export function evaluateKeyFigureToString(points) {
    if (typeof points === 'number') {
        points = points.toFixed(1);
    }

    if (points >= 9 && points <= 10) {
        return <span style={{ color: "#00B050" }}>Sehr gut ({points})</span>; // Dunkelgrün
    } else if (points >= 7 && points < 9) {
        return <span style={{ color: "#FFC000" }}>Gut ({points})</span>; // Helleres Grün
    } else if (points >= 5 && points < 7) {
        return <span style={{ color: "#FF6C00" }}>Zufriedenstellend ({points})</span>; // Orange
    } else if (points >= 1 && points < 5) {
        return <span style={{ color: "#FF0000" }}>Schlecht ({points})</span>; // Helleres Rot
    }
}


/* GESAMTBEWERTUNG */
export function evaluateProject(project) {
    var projectScopeRating = evaluateProjectScope(project);
    var costsRating = evaluateCosts(project);
    var strategyRating = evaluateStrategy(project);
    var projectRiskRating = evaluateProjectRisk(project);
    var complexityRating = evaluateComplexity(project);
    var projectPerformanceRating = evaluateProjectPerformance(project);
    var financialFiguresRating = evaluateFinancialFigures(project);

    var projectRating = projectScopeRating + costsRating + strategyRating + projectRiskRating + complexityRating + projectPerformanceRating + financialFiguresRating;

    return (projectRating / 7);
}


/* PROJEKTUMFANG */
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
    const budgetPercentage = (project.budget / totalBudget) * 100;
    return mainEvaluatePercent(budgetPercentage);
}

export function evaluateTeamSize(project) {
    const teamSize = project.teamSize;
    if (teamSize < 3) {
        return 1;
    } else if (teamSize >= 3 && teamSize <= 6) {
        return 2;
    } else if (teamSize >= 7 && teamSize <= 18) {
        return 3;
    } else if (teamSize >= 19 && teamSize <= 38) {
        return 4;
    } else if (teamSize >= 39 && teamSize <= 80) {
        return 5;
    } else if (teamSize >= 81 && teamSize <= 130) {
        return 6;
    } else if (teamSize >= 131 && teamSize <= 200) {
        return 7;
    } else if (teamSize >= 201 && teamSize <= 300) {
        return 8;
    } else if (teamSize >= 301 && teamSize <= 500) {
        return 9;
    } else {
        return 10;
    }
}

export function evaluateProductManagerWorkload(project) {
    const productManagerWorkload = project.productManagerWorkload;
    return mainEvaluatePercent(productManagerWorkload);
}

export function evaluateProjectScope(project) {
    var projectDurationRating = evaluateProjectDuration(project);
    var projectBudgetRating = evaluateProjectBudget(project);
    var teamSizeRating = evaluateTeamSize(project);
    var productManagerWorkloadRating = evaluateProductManagerWorkload(project);

    var projectScopeRating = 5 * projectDurationRating + 5 * projectBudgetRating + 3 * teamSizeRating + 3 * productManagerWorkloadRating;

    return (projectScopeRating / 4) / 5;
}

/* KOSTEN */
export function evaluateInternalCosts(project) {
    const productManagerWorkload = project.productManagerWorkload;
    return mainEvaluatePercent(productManagerWorkload);
}

export function evaluateExternalCosts(project) {
    const productManagerWorkload = project.productManagerWorkload;
    return mainEvaluatePercent(productManagerWorkload);
}

export function evaluateInvestments(project) {
    const productManagerWorkload = project.productManagerWorkload;
    return mainEvaluatePercent(productManagerWorkload);
}

export function evaluateCosts(project) {
    const productManagerWorkload = project.productManagerWorkload;
    return mainEvaluatePercent(productManagerWorkload);
}

/* STRATEGIE */
export function evaluateDigitalisation(project) {
    const digitalisation = project.digitalisation;

    switch (digitalisation) {
        case "Hoch":
            return 1;
        case "Mittel":
            return 3;
        case "Niedrig":
            return 5;
    }
}

export function evaluateCustomerSatisfaction(project) {
    const customerSatisfaction = project.customerSatisfaction;

    switch (customerSatisfaction) {
        case "Hoch":
            return 1;
        case "Mittel":
            return 3;
        case "Niedrig":
            return 5;
    }
}


export function evaluateEverydayBenefit(project) {
    const everydayBenefit = project.everydayBenefit;

    switch (everydayBenefit) {
        case "Hoch":
            return 1;
        case "Mittel":
            return 3;
        case "Niedrig":
            return 5;
    }
}

export function evaluateStrategy(project) {
    var digitalisationRating = evaluateDigitalisation(project);
    var customerSatisfactionRating = evaluateCustomerSatisfaction(project);
    var everydayBenefitRating = evaluateEverydayBenefit(project);

    var strategyRating = 5 * digitalisationRating + 5 * customerSatisfactionRating + 5 * everydayBenefitRating;

    return (strategyRating / 3) / 5;
}

/* PROJEKTRISIKO */
export function evaluateProjectRisk(project) {
    return mainEvaluatePercent(project.projectRisk);
}

/* KOMPLEXITÄT */
export function evaluateInvolvedBusinessUnits(project) {
    const involvedBusinessUnits = project.involvedBusinessUnits;
    return mainEvaluatePercent(involvedBusinessUnits);
}

export function evaluateExternalStakeholders(project) {
    const externalStakeholders = project.externalStakeholders;

    if (externalStakeholders < 3) {
        return 1;
    } else if (externalStakeholders >= 4 && externalStakeholders <= 8) {
        return 4;
    } else if (externalStakeholders >= 9 && externalStakeholders <= 15) {
        return 7;
    } else {
        return 10;
    }
}

export function evaluateBufferDays(project) {
    const bufferDays = project.bufferDays;

    const start = new Date(project.startDate);
    const end = new Date(project.endDate);

    const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

    const timeDifference = Math.abs(end.getTime() - start.getTime());
    const dayCount = Math.round(timeDifference / millisecondsPerDay);

    const bufferPercentage = (bufferDays / dayCount) * 100;

    if (bufferPercentage < 5) {
        return 10;
    } else if (bufferPercentage >= 5 && bufferPercentage < 10) {
        return 6;
    } else if (bufferPercentage >= 10 && bufferPercentage < 15) {
        return 4;
    } else if (bufferPercentage >= 15 && bufferPercentage < 25) {
        return 1;
    } else if (bufferPercentage >= 25 && bufferPercentage < 35) {
        return 4;
    } else if (bufferPercentage >= 35) {
        return 10;
    }
}

export function evaluateExperience(project) {
    const experience = project.experience;

    switch (experience) {
        case "Sehr gut":
            return 1;
        case "Gut":
            return 4;
        case "Zufriedenstellend":
            return 7;
        case "Schlecht":
            return 10;
    }
}

export function evaluateSolutionScope(project) {
    const solutionScopeProcess = project.solutionScopeProcess;
    const solutionScopeFunctional = project.solutionScopeFunctional;

    if (solutionScopeProcess == "Bekannt" && solutionScopeFunctional == "Klein") {
        return 1;
    } else if (solutionScopeProcess == "Bekannt" && solutionScopeFunctional == "Groß") {
        return 4;
    } else if (solutionScopeProcess == "Unbekannt" && solutionScopeFunctional == "Klein") {
        return 7;
    } else if (solutionScopeProcess == "Unbekannt" && solutionScopeFunctional == "Groß") {
        return 10;
    }
}

export function evaluateSupportEffort(project) {
    const supportEffort = project.supportEffort;

    if (supportEffort <= 10) {
        return 1;
    } else if (supportEffort >= 11 && supportEffort <= 50) {
        return 4;
    } else if (supportEffort >= 51 && supportEffort <= 200) {
        return 6;
    } else if (supportEffort >= 201 && supportEffort <= 500) {
        return 8;
    } else {
        return 10;
    }
}

export function evaluateComplexity(project) {
    var involvedBusinessUnitsRating = evaluateInvolvedBusinessUnits(project);
    var externalStakeholdersRating = evaluateExternalStakeholders(project);
    var bufferDaysRating = evaluateBufferDays(project);
    var experienceRating = evaluateExperience(project);
    var solutionScopeRating = evaluateSolutionScope(project);
    var supportEffortRating = evaluateSupportEffort(project);

    var complexityRating = 2 * involvedBusinessUnitsRating + 2 * externalStakeholdersRating + 1 * bufferDaysRating + 3 * experienceRating + 4 * solutionScopeRating + 2 * supportEffortRating;

    return (complexityRating / 6) / 5;
}

/* PROJEKTLEISTUNG */
export function evaluateTurnOverIncrease(project) {
    const turnoverIncreaseY1 = project.turnoverIncreaseY1;
    const turnoverIncreaseY2 = project.turnoverIncreaseY2;
    const turnoverIncreaseY3 = project.turnoverIncreaseY3;
    const turnoverIncreaseY4 = project.turnoverIncreaseY4;
    const turnoverIncreaseY5 = project.turnoverIncreaseY5;

    const percentageIncreases = [turnoverIncreaseY1, turnoverIncreaseY2, turnoverIncreaseY3, turnoverIncreaseY4, turnoverIncreaseY5];
    const totalPercentageIncrease = percentageIncreases.reduce((sum, increase) => sum + increase, 0);

    const averagePercentageIncrease = totalPercentageIncrease / percentageIncreases.length;

    return evaluatePercentCosts(averagePercentageIncrease.toFixed(2));
}

export function evaluateConstSavings(project) {
    const costSavingsY1 = project.costSavingsY1;
    const costSavingsY2 = project.costSavingsY2;
    const costSavingsY3 = project.costSavingsY3;
    const costSavingsY4 = project.costSavingsY4;
    const costSavingsY5 = project.costSavingsY5;

    const percentageIncreases = [costSavingsY1, costSavingsY2, costSavingsY3, costSavingsY4, costSavingsY5];
    const totalPercentageIncrease = percentageIncreases.reduce((sum, increase) => sum + increase, 0);

    const averagePercentageIncrease = totalPercentageIncrease / percentageIncreases.length;

    return evaluatePercentCosts(averagePercentageIncrease.toFixed(2));
}

export function evaluateProjectPerformance(project) {
    var turnOverIncreaseRating = evaluateTurnOverIncrease(project);
    var costSavingsRating = evaluateConstSavings(project);

    var projectPerformance = 5 * turnOverIncreaseRating + 5 * costSavingsRating;

    return (projectPerformance / 2) / 5;
}

/* FINANZKENNZAHLEN */
export function evaluateCapitalValue(project) {
    const capitalValue = project.capitalValue;

    if (capitalValue <= 10000 && capitalValue >= -10000) {
        return 5;
    } else if (capitalValue < -10001) {
        return 10;
    } else if (capitalValue > 10001) {
        return 1;
    }

}

export function evaluateCostReduction(project) {
    const costSavingsY1 = project.costSavingsY1;
    const costSavingsY2 = project.costSavingsY2;
    const costSavingsY3 = project.costSavingsY3;
    const costSavingsY4 = project.costSavingsY4;
    const costSavingsY5 = project.costSavingsY5;

    const costSavingsAverage = (costSavingsY1 + costSavingsY2 + costSavingsY3 + costSavingsY4 + costSavingsY5) / 5

    const amortisationYears = project.projectCost / costSavingsAverage;

    if (amortisationYears <= 3) {
        return 1;
    } else if (amortisationYears > 3 && amortisationYears < 5) {
        return 5;
    } else if (amortisationYears > 6) {
        return 10;
    }
}

export function evaluateFinancialFigures(project) {
    var capitalValueRating = evaluateCapitalValue(project);
    var costReductionRating = evaluateCostReduction(project);

    var financialFigures = 5 * capitalValueRating + 5 * costReductionRating;

    return (financialFigures / 2) / 5;
}