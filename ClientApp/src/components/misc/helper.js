import { faCheckCircle, faCircleQuestion, faCircleXmark, faFileInvoice } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function getProjectIdWithPrefix(projectId, projectType, location) {
    let prefix = '';

    // Mögliche Standorte: Freiburg, Lörrach, Mallorca, Berlin, München
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


export function getProjectStatus(status) {
    switch (status) {
        case 'Beantragt':
            return <div className='ppm360-cell' style={{ backgroundColor: "#fef5e7", color: "#f39c12" }}>
                <FontAwesomeIcon icon={faFileInvoice} /> {status}
            </div>;
        case 'Genehmigt':
            return <div className='ppm360-cell' style={{ backgroundColor: "#e8f6ef", color: "#27ae60" }}>
                <FontAwesomeIcon icon={faCheckCircle} /> {status}
            </div>;
        case 'Abgelehnt':
            return <div className='ppm360-cell' style={{ backgroundColor: "#f9ebea", color: "#e74c3c" }}>
                <FontAwesomeIcon icon={faCircleXmark} /> {status}
            </div>;
        case 'Abgeschlossen':
            return <div className='ppm360-cell' style={{ backgroundColor: "#f3f5f5", color: "#737e93" }}>
                <FontAwesomeIcon icon={faCheckCircle} /> {status}
            </div>;
        default:
            return <div className='ppm360-cell' style={{ backgroundColor: "#f3f5f5", color: "#737e93" }}>
                <FontAwesomeIcon icon={faCircleQuestion} /> {"Unbekannt: " + status}
            </div>;
    }
}