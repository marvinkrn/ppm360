import React, { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight, faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import Moment from 'moment';
import FigureCard from './misc/FigureCard';
import { Button, Col, Input, InputGroup, InputGroupText, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from 'reactstrap';
import jwt_decode from 'jwt-decode';
import Unauthorized from './misc/Unauthorized';
import { evaluateComplexity, evaluateCosts, evaluateFinancialFigures, evaluateKeyFigureToString, evaluateProject, evaluateProjectPerformance, evaluateProjectRisk, evaluateProjectScope, evaluateStrategy } from './misc/evaluations';
import { getProjectIdWithPrefix, getProjectStatus } from './misc/helper';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from "react-chartjs-2";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Chart from 'chart.js/auto';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const [allProjects, setAllProjects] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [annualBudgets, setAnnualBudgets] = useState([]);
    const [annualBudgetYear, setAnnualBudgetYear] = useState(null);
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const [sortColumn, setSortColumn] = useState(''); // State to track the currently sorted column
    const [sortDirection, setSortDirection] = useState('asc'); // State to track the sorting direction, default: asc
    const [prioritySortDirection, setPrioritySortDirection] = useState('asc');

    const [priorities, setPriorities] = useState([]);

    useEffect(() => {
        document.title = "PPM360 | Supernova AG";
        fetchAnnualBudgets();
        populateProjects();
        getPrioritizations(projects);
    }, []);

    // Sorting the specified column
    const handleSort = (column) => {
        if (column === 'priority') {
            // If the same column is clicked again, toggle the sorting direction
            setPrioritySortDirection(prevDirection => (prevDirection === 'asc' ? 'desc' : 'asc'));
        } else {

            if (sortColumn === column) {
                // If the same column is clicked again, toggle the sorting direction
                setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
            } else {
                // If a different column is clicked, set it as the new sort column and default to ascending direction
                setSortColumn(column);
                setSortDirection('asc');
            }
        }
    };

    // Helper function to compare the values of 2 entries
    const compareValues = (a, b) => {
        if (typeof a === 'string' && typeof b === 'string') {
            return a.localeCompare(b);
        } else if (typeof a === 'number' && typeof b === 'number') {
            return a - b;
        } else {
            // Handle other data types or cases where comparison is not possible
            return 0;
        }
    };

    // Returns the sorted projects 
    const getSortedProjects = () => {
        if (sortColumn === 'priority') {
            console.log("TEST")
            const sortedProjects = projects.slice().sort((a, b) => {
                const aValue = a.priority;
                const bValue = b.priority;
                if (prioritySortDirection === 'asc') {
                    return compareValues(aValue, bValue);
                } else {
                    return compareValues(bValue, aValue);
                }
            });
            return sortedProjects;
        } else if (sortColumn) {
            const sortedProjects = projects.slice().sort((a, b) => {
                const aValue = a[sortColumn];
                const bValue = b[sortColumn];
                if (sortDirection === 'asc') {
                    return compareValues(aValue, bValue);
                } else {
                    return compareValues(bValue, aValue);
                }
            });
            return sortedProjects;
        }
        return projects;
    };


    // Get the count of projects with the same status
    const getStatusCount = (status) => {
        const count = projects.filter(project => project.projectStatus === status).length;
        return count;
    };

    // Get the spent budget of a year of the projects with the "Genehmigt" status
    const getSpentBudget = (year) => {
        const sumBudget = projects
            .filter(project => project.projectStatus === "Genehmigt" && new Date(project.startDate).getFullYear() == year)
            .reduce((accumulator, project) => accumulator + project.budget, 0);
        return sumBudget;
    };

    // Get the planned budget of a year of the projects with the "Genehmigt" status
    const getPlannedBudget = (year) => {
        const sumBudget = projects
            .filter(project => (project.projectStatus === "Genehmigt" || project.projectStatus === "Beantragt") && new Date(project.startDate).getFullYear() == year)
            .reduce((accumulator, project) => accumulator + project.budget, 0);
        return sumBudget;
    };

    // Helper to make the Table Header Cells with sorting arrows
    const TableHeaderCell = ({ columnName, columnLabel, handleSort, sortColumn, sortDirection }) => {
        const isSorted = sortColumn === columnName;
        const arrow = isSorted ? (sortDirection === 'asc' ? <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSortDown} />) : <FontAwesomeIcon icon={faSort} />;

        return (
            <th onClick={() => handleSort(columnName)}>
                {columnLabel} {arrow}
            </th>
        );
    };

    const getPrioritizations = async (projects) => {
        const projectValues = [];

        for (const project of projects) {
            const priority = await evaluateProject(project);
            project.priority = priority; // Add priority property to project
            projectValues.push({ projectId: project.id, priority: priority });
        }

        setPriorities(projectValues);
    };


    // Refresh the project data on the page
    const refreshData = () => {
        setLoading(true);
        populateProjects();
        setTimeout(() => {
            getPrioritizations(allProjects);
        }, 1000); // 1 second timeout
    };




    // Get the projects data from the api
    const populateProjects = async () => {
        try {
            const headers = { 'Authorization': 'Bearer ' + localStorage.getItem("token") };
            const response = await fetch('api/projects', { headers });
            const data = await response.json();

            // Filter the projects based on the year of the start date
            const annualBudgetYear = parseInt(document.getElementById("annualBudgetYear").value);

            let location = null;

            const locationFilterElement = document.getElementById("locationFilter");
            if (locationFilterElement) {
                location = locationFilterElement.value;
            }

            // Filter the projects based on the year of the start date and location
            const filteredProjects = data.filter(project => {
                const startDateYear = new Date(project.startDate).getFullYear();
                const projectLocation = project.responsibleLocation;

                if ((location == null) | (location === "Alle Standorte")) {
                    return startDateYear === annualBudgetYear;
                } else {
                    return startDateYear === annualBudgetYear && projectLocation === location;
                }
            });

            setProjects(filteredProjects);
            setAllProjects(data);

            setLoading(false);
        } catch (error) {
            console.log(error);
            toast.error('Die Projekte konnten nicht geladen werden.');
        }
    };

    // Get the annual budgets from the api
    const fetchAnnualBudgets = async () => {
        try {
            const headers = { 'Authorization': 'Bearer ' + localStorage.getItem("token") };
            const response = await fetch('api/annualbudgets', { headers });
            const data = await response.json();
            setAnnualBudgets(data);
        } catch (error) {
            toast.error('Die Geschäftsjahre konnten nicht geladen werden.');
        }
    };

    const getAverageProjectScope = (projects) => {
        const filteredProjects = projects.filter(project => project.projectStatus === "Genehmigt");
        const total = filteredProjects.reduce((sum, project) => sum + evaluateProjectScope(project), 0);
        const average = total / filteredProjects.length;
        return average.toFixed(2);
    }

    const getAverageCosts = (projects) => {
        const filteredProjects = projects.filter(project => project.projectStatus === "Genehmigt");
        const total = filteredProjects.reduce((sum, project) => sum + evaluateCosts(project), 0);
        const average = total / filteredProjects.length;
        return average.toFixed(2);
    }

    const getAverageStrategy = (projects) => {
        const filteredProjects = projects.filter(project => project.projectStatus === "Genehmigt");
        const total = filteredProjects.reduce((sum, project) => sum + evaluateStrategy(project), 0);
        const average = total / filteredProjects.length;
        return average.toFixed(2);
    }

    const getAverageProjectRisk = (projects) => {
        const filteredProjects = projects.filter(project => project.projectStatus === "Genehmigt");
        const total = filteredProjects.reduce((sum, project) => sum + evaluateProjectRisk(project), 0);
        const average = total / filteredProjects.length;
        return average.toFixed(2);
    }

    const getAverageComplexity = (projects) => {
        const filteredProjects = projects.filter(project => project.projectStatus === "Genehmigt");
        const total = filteredProjects.reduce((sum, project) => sum + evaluateComplexity(project), 0);
        const average = total / filteredProjects.length;
        return average.toFixed(2);
    }

    const getAverageProjectPerformance = (projects) => {
        const filteredProjects = projects.filter(project => project.projectStatus === "Genehmigt");
        const total = filteredProjects.reduce((sum, project) => sum + evaluateProjectPerformance(project), 0);
        const average = total / filteredProjects.length;
        return average.toFixed(2);
    }

    const getAverageFinancialFigures = (projects) => {
        const filteredProjects = projects.filter(project => project.projectStatus === "Genehmigt");
        const total = filteredProjects.reduce((sum, project) => sum + evaluateFinancialFigures(project), 0);
        const average = total / filteredProjects.length;
        return average.toFixed(2);
    }


    let averageProjectScope;
    let averageCosts;
    let averageStrategy;
    let averageRisk;
    let averageComplexity;
    let averageProjectPerformance;
    let averageFinancialFigures;

    if (loading) {
        averageProjectScope = <Skeleton />;
        averageCosts = <Skeleton />;
        averageStrategy = <Skeleton />;
        averageRisk = <Skeleton />;
        averageComplexity = <Skeleton />;
        averageProjectPerformance = <Skeleton />;
        averageFinancialFigures = <Skeleton />;
    } else {
        averageProjectScope = evaluateKeyFigureToString(getAverageProjectScope(projects));
        averageCosts = evaluateKeyFigureToString(getAverageCosts(projects));
        averageStrategy = evaluateKeyFigureToString(getAverageStrategy(projects));
        averageRisk = evaluateKeyFigureToString(getAverageProjectRisk(projects));
        averageComplexity = evaluateKeyFigureToString(getAverageComplexity(projects));
        averageProjectPerformance = evaluateKeyFigureToString(getAverageProjectPerformance(projects));
        averageFinancialFigures = evaluateKeyFigureToString(getAverageFinancialFigures(projects));
    }

    // Get the userRole out of the token
    const decoded = jwt_decode(localStorage.getItem('token'));
    let userRole = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    if (userRole !== "Management") return (<Unauthorized />);

    // Handle submit to update the annual budget of a year
    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        const headers = { 'Authorization': 'Bearer ' + localStorage.getItem("token") };

        const year = parseInt(document.getElementById("annualBudgetYear").value);

        axios.put(`/api/annualbudgets/${year}`, {
            year: year,
            budget: data.get('annualBudget'),
        }, { headers })
            .then(response => {
                console.log('Annual budget updated successfully');
                fetchAnnualBudgets();
                refreshData();
                toggle();
                toast.success('Das Budget für das Geschäftsjahr ' + year + " wurde erfolgreich aktualisiert.");
            })
            .catch(error => {
                // Handle the error response
                console.error('Failed to update:', error);
                toast.error('Das Budget für das Geschäftsjahr ' + year + " konnte nicht aktualisert werden.");
            });

    };

    return (
        <div>
            {/* Modal to update the annual budget */}
            {modal && (
                <Modal isOpen={modal} toggle={toggle} size='lg' centered>
                    <ModalHeader toggle={toggle}>Gesamtbudget für ein Geschäftsjahr ändern</ModalHeader>
                    <ModalBody>
                        Hier können Sie das Gesamtbudget für das Geschäftsjahr {parseInt(document.getElementById("annualBudgetYear").value)} ändern.
                        <form id="changeAnnualBudget" onSubmit={handleSubmit} className='mt-4'>
                            <Input type="text" id="annualBudget" name="annualBudget" defaultValue={annualBudgets.find(annualBudget => annualBudget.year === parseInt(document.getElementById("annualBudgetYear").value))?.budget} />
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggle}>
                            Abbrechen

                        </Button>

                        <Button color="primary" type="submit" form="changeAnnualBudget">
                            Speichern
                        </Button>

                    </ModalFooter>
                </Modal>
            )}

            <div className="d-sm-flex align-items-center justify-content-between mt-5 mb-5">
                <h1>Dashboard</h1>

                <div className="d-sm-flex">
                    <button className="btn btn-secondary mx-2" onClick={refreshData}>
                        <FontAwesomeIcon icon={faRotateRight} /> Daten aktualisieren
                    </button>
                </div>
            </div>

            <div className='mb-5'>
                <form>
                    <Row className='d-sm-flex align-items-center'>
                        <Col>
                            <Label for="annualBudgetYear">Geschäftsjahr</Label>
                            <Input type="select" id="annualBudgetYear" name="annualBudgetYear" onChange={refreshData}>
                                <option hidden value="null">
                                    Bitte auswählen
                                </option>
                                {annualBudgets.map((annualBudget) => (
                                    <option key={annualBudget.id}>{annualBudget.year}</option>
                                ))}
                            </Input>
                        </Col>
                        <Col>
                            <Label>Gesamtbudget für das Geschäftsjahr</Label>
                            <Row className='d-sm-flex align-items-center'>
                                <Col sm="9" >
                                    <InputGroup>
                                        <Input
                                            type="text"
                                            readOnly
                                            defaultValue={annualBudgets.find(annualBudget => annualBudget.year === parseInt(document.getElementById("annualBudgetYear").value))?.budget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        /><InputGroupText>
                                            €
                                        </InputGroupText>
                                    </InputGroup>
                                </Col>
                                <Col sm="3">
                                    {document.getElementById("annualBudgetYear") && (document.getElementById("annualBudgetYear").value != "null") && (
                                        <Button color="secondary" className='btn-sm' onClick={toggle}>
                                            Budget ändern
                                        </Button>
                                    )}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </form>
            </div>



            {document.getElementById("annualBudgetYear") && (document.getElementById("annualBudgetYear").value != "null") && (



                <div>
                    <div className='mb-5'>
                        <form>
                            <Row className='d-sm-flex align-items-center'>
                                <Col>
                                    <Label for="location">Standort</Label>
                                    <Input type="select" id="locationFilter" name="location" onChange={refreshData}>
                                        <option key="allLocations">Alle Standorte</option>
                                        <option key="freiburg">Freiburg</option>
                                        <option key="loerrach">Lörrach</option>
                                        <option key="mallorca">Mallorca</option>
                                        <option key="berlin">Berlin</option>
                                        <option key="muenchen">München</option>
                                    </Input>
                                </Col>

                            </Row>
                        </form>
                    </div>

                    <Row>
                        {/**<FigureCard heading={"Ø Projektumfang"} content={averageProjectScope} />*/}

                        <FigureCard heading={"Anzahl Projekte nach Status"} content={<div style={{ width: "75%", margin: "0 auto" }}>
                            <Doughnut data={{
                                labels: ['Beantragt', 'Genehmigt', 'Abgelehnt', 'Abgeschlossen'],
                                datasets: [
                                    {
                                        label: 'Anzahl',
                                        data: [
                                            getStatusCount('Beantragt'),
                                            getStatusCount('Genehmigt'),
                                            getStatusCount('Abgelehnt'),
                                            getStatusCount('Abgeschlossen')
                                        ],
                                        backgroundColor: [
                                            '#f9b957',
                                            '#5cd782',
                                            '#f0695a',
                                            '#737e93'
                                        ]
                                    }
                                ]
                            }} options={{
                                plugins: {
                                    legend: {
                                        display: false
                                    }
                                }
                            }} />
                        </div>} />

                        <FigureCard heading={"Verbrauchtes / Maximales Budget für " + document.getElementById("annualBudgetYear").value} content={<div style={{ height: "75%", margin: "0 auto" }}>
                            <Bar data={{
                                labels: ['Verbraucht', "Geplant", "Maximal"],
                                datasets: [
                                    {
                                        label: 'Budget',
                                        data: [
                                            getSpentBudget(document.getElementById("annualBudgetYear").value),
                                            getPlannedBudget(document.getElementById("annualBudgetYear").value),
                                            annualBudgets.find(annualBudget => annualBudget.year === parseInt(document.getElementById("annualBudgetYear").value))?.budget
                                        ],
                                        backgroundColor: [
                                            '#f0695a',
                                            '#f9b957',
                                            '#737e93'
                                        ]
                                    },

                                ]
                            }} options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        display: false,
                                    },

                                },
                            }} />
                        </div>} />

                        <div className="mt-5 mb-4">
                            <h3>Durchschnittliche Projektwerte</h3>
                            <p>(Genehmigter Projekte)</p>
                        </div>
                        <FigureCard heading={"Ø Kosten"} content={averageCosts} />
                        <FigureCard heading={"Ø Strategie"} content={averageStrategy} />
                        <FigureCard heading={"Ø Projektrisiko"} content={averageRisk} />
                        <FigureCard heading={"Ø Komplexität"} content={averageComplexity} />
                        <FigureCard heading={"Ø Projektleistung"} content={averageProjectPerformance} />
                        <FigureCard heading={"Ø Finanzkennzahlen"} content={averageFinancialFigures} />
                    </Row>

                    <div className="mt-5 mb-5">
                        <h3>Projektübersicht</h3>
                    </div>
                    <div>
                        <Table hover responsive id="project-table">
                            <thead>
                                <tr>
                                    <TableHeaderCell columnName="id" columnLabel="Projekt-ID" handleSort={handleSort} sortColumn={sortColumn} sortDirection={sortDirection} />
                                    <TableHeaderCell columnName="name" columnLabel="Projektname" handleSort={handleSort} sortColumn={sortColumn} sortDirection={sortDirection} />
                                    <TableHeaderCell columnName="projectType" columnLabel="Projektart" handleSort={handleSort} sortColumn={sortColumn} sortDirection={sortDirection} />
                                    <TableHeaderCell columnName="projectStatus" columnLabel="Status" handleSort={handleSort} sortColumn={sortColumn} sortDirection={sortDirection} />
                                    <TableHeaderCell columnName="location" columnLabel="Standort" handleSort={handleSort} sortColumn={sortColumn} sortDirection={sortDirection} />
                                    <TableHeaderCell columnName="digitalisation" columnLabel="Digitalisierung" handleSort={handleSort} sortColumn={sortColumn} sortDirection={sortDirection} />
                                    <TableHeaderCell columnName="customerSatisfaction" columnLabel="Kundenzufriedenheit" handleSort={handleSort} sortColumn={sortColumn} sortDirection={sortDirection} />
                                    <TableHeaderCell columnName="everydayBenefit" columnLabel="Everyday Benefit" handleSort={handleSort} sortColumn={sortColumn} sortDirection={sortDirection} />
                                    <TableHeaderCell columnName="budget" columnLabel="Budget" handleSort={handleSort} sortColumn={sortColumn} sortDirection={sortDirection} />
                                    <TableHeaderCell columnName="priority" columnLabel="Priorität" handleSort={handleSort} sortColumn={sortColumn} sortDirection={sortDirection} />
                                </tr>
                            </thead>
                            <tbody>
                                {getSortedProjects().map(project =>
                                    <tr key={project.id}>
                                        <td>{getProjectIdWithPrefix(project.id, project.projectType, project.responsibleLocation)}</td>
                                        <td>{project.name}</td>
                                        <td>{project.projectType}</td>
                                        <td>{getProjectStatus(project.projectStatus)}</td>
                                        <td>{project.responsibleLocation}</td>
                                        <td>{project.digitalisation}</td>
                                        <td>{project.customerSatisfaction}</td>
                                        <td>{project.everydayBenefit}</td>
                                        <td>{project.budget} EUR</td>
                                        <td>
                                            {priorities &&
                                                priorities.find((priority) => priority.projectId === project.id)?.priority !== undefined && (
                                                    priorities.find((priority) => priority.projectId === project.id)?.priority.toFixed(1)
                                                )}

                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table >
                    </div>
                </div>
            )}

            <ToastContainer position="bottom-right" />

        </div>
    );
};

export default Dashboard;
