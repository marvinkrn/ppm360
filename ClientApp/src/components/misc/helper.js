export function getProjectIdWithPrefix(projectId, projectType, location) {
    let prefix = '';
    
    // Mögliche Standorte: Freiburg, Lörrach, Hamburg, Berlin, München
    switch (location) {
        case 'Freiburg':
            prefix += 'SFR';
            break;
        case 'Lörrach':
            prefix += 'SLO';
            break;
        case 'Mallorca':
            prefix += 'SMA';
            break;
        case 'Berlin':
            prefix += 'SBE';
            break;
        case 'München':
            prefix += 'SMU';
            break;
        default:
            prefix += 'SX';
            break;
    }

    // Mögliche Projekte: Investitionsprojekt, Organisationsprojekt, F&E-Projekt, IT-Projekt
    switch (projectType) {
        case 'Investitionsprojekt':
            prefix += '-IN';
            break;
        case 'Organisationsprojekt':
            prefix += '-OR';
            break;
        case 'F&E-Projekt':
            prefix += '-FE';
            break;
        case 'IT-Projekt':
            prefix += '-IT';
            break;
        default:
            prefix += '-X';
            break;
    }
    return `${prefix}-${projectId}`;
}
