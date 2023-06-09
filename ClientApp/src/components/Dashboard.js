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
import { evaluateComplexity, evaluateCosts, evaluateFinancialFigures, evaluateKeyFigureToString, evaluateProjectPerformance, evaluateProjectRisk, evaluateProjectScope, evaluateStrategy } from './misc/evaluations';
import { getProjectIdWithPrefix, getProjectStatus } from './misc/helper';
import axios from 'axios';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from "react-chartjs-2";
import Chart from 'chart.js/auto';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [annualBudgets, setAnnualBudgets] = useState([]);
    const [annualBudgetYear, setAnnualBudgetYear] = useState(null);
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const [sortColumn, setSortColumn] = useState(''); // State to track the currently sorted column
    const [sortDirection, setSortDirection] = useState('asc'); // State to track the sorting direction

    const handleSort = (column) => {
        if (sortColumn === column) {
            // If the same column is clicked again, toggle the sorting direction
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // If a different column is clicked, set it as the new sort column and default to ascending direction
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

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

    const getSortedProjects = () => {
        if (sortColumn) {
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

    const getStatusCount = (status) => {
        const count = projects.filter(project => project.projectStatus === status).length;
        return count;
    };

    const getCurrentBudget = (year) => {
        const sumBudget = projects
            .filter(project => new Date(project.startDate).getFullYear() == year)
            .reduce((accumulator, project) => accumulator + project.budget, 0);
        return sumBudget;
    };


    const TableHeaderCell = ({ columnName, columnLabel, handleSort, sortColumn, sortDirection }) => {
        const isSorted = sortColumn === columnName;
        const arrow = isSorted ? (sortDirection === 'asc' ? <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSortDown} />) : <FontAwesomeIcon icon={faSort} />;

        return (
            <th onClick={() => handleSort(columnName)}>
                {columnLabel} {arrow}
            </th>
        );
    };

    useEffect(() => {
        populateProjects();
        document.title = "PPM360 | Supernova AG";
        fetchAnnualBudgets();
    }, []);

    const refreshData = () => {
        setLoading(true);
        populateProjects();
    };

    const populateProjects = async () => {
        try {
            const headers = { 'Authorization': 'Bearer ' + localStorage.getItem("token") };
            const response = await fetch('api/projects', { headers });
            const data = await response.json();

            // Filter the projects based on the year of the start date
            const annualBudgetYear = parseInt(document.getElementById("annualBudgetYear").value);
            const filteredProjects = data.filter(project => {
                const startDateYear = new Date(project.startDate).getFullYear();
                return startDateYear === annualBudgetYear;
            });

            setProjects(filteredProjects);
            setLoading(false);
        } catch (error) {
            // Error handling
        }
    };


    const fetchAnnualBudgets = async () => {
        try {
            const headers = { 'Authorization': 'Bearer ' + localStorage.getItem("token") };
            const response = await fetch('api/annualbudgets', { headers });
            const data = await response.json();
            setAnnualBudgets(data);
        } catch (error) {
            // Error handling
        }
    };

    const getProjectsCount = (projects) => {
        var count = Object.keys(projects).length;
        return (count);
    }

    const getTotalCosts = (projects) => {
        const filteredProjects = projects.filter(project => project.projectStatus === "Genehmigt");
        const totalCost = filteredProjects.reduce((sum, project) => sum + project.budget, 0);
        const formattedCost = Number(totalCost).toLocaleString("de-DE");
        return (formattedCost + " EUR");
    }

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

    const statusDoughnutData = {
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
                    '#f39c12',
                    '#27ae60',
                    '#e74c3c',
                    '#737e93'
                ]
            }
        ]
    };


    let projectsCount;
    let totalCosts;
    let averageProjectScope;
    let averageCosts;
    let averageStrategy;
    let averageRisk;
    let averageComplexity;
    let averageProjectPerformance;
    let averageFinancialFigures;

    if (loading) {

        averageCosts = <Skeleton />;
        averageComplexity = <Skeleton />;
    } else {

        averageProjectScope = evaluateKeyFigureToString(getAverageProjectScope(projects));
        averageCosts = evaluateKeyFigureToString(getAverageCosts(projects));
        averageStrategy = evaluateKeyFigureToString(getAverageStrategy(projects));
        averageRisk = evaluateKeyFigureToString(getAverageProjectRisk(projects));
        averageComplexity = evaluateKeyFigureToString(getAverageComplexity(projects));
        averageProjectPerformance = evaluateKeyFigureToString(getAverageProjectPerformance(projects));
        averageFinancialFigures = evaluateKeyFigureToString(getAverageFinancialFigures(projects));
    }

    const decoded = jwt_decode(localStorage.getItem('token'));
    let userRole = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    if (userRole !== "Management") return (<Unauthorized />);

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
                // Handle the success response
                console.log('Annual budget updated successfully');
                fetchAnnualBudgets();
                refreshData();
                toggle();

            })
            .catch(error => {
                // Handle the error response
                console.error('Failed to update:', error);

            });

    };

    return (
        <div>
            {modal && (
                <Modal isOpen={modal} toggle={toggle} >
                    <ModalHeader toggle={toggle}>Gesamtbudget für ein Geschäftsjahr ändern</ModalHeader>
                    <ModalBody>
                        Hier können Sie das Gesamtbudget für das Geschäftsjahr {parseInt(document.getElementById("annualBudgetYear").value)} ändern.
                        <form id="changeAnnualBudget" onSubmit={handleSubmit} >
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
                    <Row>
                        <Col >
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
                            <InputGroup>

                                <Input
                                    type="text"
                                    readOnly
                                    defaultValue={annualBudgets.find(annualBudget => annualBudget.year === parseInt(document.getElementById("annualBudgetYear").value))?.budget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                /><InputGroupText>
                                    €
                                </InputGroupText>
                            </InputGroup>
                            {document.getElementById("annualBudgetYear") && (document.getElementById("annualBudgetYear").value != "null") && (<a onClick={toggle}>Budget ändern</a>)}
                        </Col>
                    </Row>
                </form>
            </div>

            {document.getElementById("annualBudgetYear") && (document.getElementById("annualBudgetYear").value != "null") && (

                <div>
                    <Row>

                        {/**<FigureCard heading={"Ø Projektumfang"} content={averageProjectScope} />*/}
                        <FigureCard heading={"Ø Kosten"} content={averageCosts} />
                        <FigureCard heading={"Ø Strategie"} content={averageStrategy} />
                        <FigureCard heading={"Ø Projektrisiko"} content={averageRisk} />
                        <FigureCard heading={"Ø Komplexität"} content={averageComplexity} />
                        <FigureCard heading={"Ø Projektleistung"} content={averageProjectPerformance} />
                        <FigureCard heading={"Ø Finanzkennzahlen"} content={averageFinancialFigures} />
                        <FigureCard heading={"Anzahl Projekte nach Status"} content={<div style={{ width: "75%", margin: "0 auto" }}>
                            <Doughnut data={statusDoughnutData} options={{
                                plugins: {
                                    legend: {
                                        display: false
                                    }
                                }
                            }} />
                        </div>} />

                        <FigureCard heading={"Verbrauchtes / Verfügbares Budget für " + document.getElementById("annualBudgetYear").value} content={<div style={{ height: "75%", margin: "0 auto" }}>
                            <Bar data={{
                                labels: ['Verbraucht', "Maximal"],
                                datasets: [
                                    {
                                        label: 'Verbrauchtes Budget',
                                        data: [
                                            getCurrentBudget(document.getElementById("annualBudgetYear").value),
                                            annualBudgets.find(annualBudget => annualBudget.year === parseInt(document.getElementById("annualBudgetYear").value))?.budget
                                        ],
                                        backgroundColor: [
                                            '#FF0000',
                                            '#00FF00'
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


                    </Row>


                    <div>
                        <Table hover responsive >
                            <thead>
                                <tr>
                                    <TableHeaderCell
                                        columnName="projectId"
                                        columnLabel="Projekt-ID"
                                        handleSort={handleSort}
                                        sortColumn={sortColumn}
                                        sortDirection={sortDirection}
                                    />
                                    <TableHeaderCell
                                        columnName="name"
                                        columnLabel="Projektname"
                                        handleSort={handleSort}
                                        sortColumn={sortColumn}
                                        sortDirection={sortDirection}
                                    />
                                    <TableHeaderCell
                                        columnName="projectType"
                                        columnLabel="Projektart"
                                        handleSort={handleSort}
                                        sortColumn={sortColumn}
                                        sortDirection={sortDirection}
                                    />
                                    <TableHeaderCell
                                        columnName="projectStatus"
                                        columnLabel="Status"
                                        handleSort={handleSort}
                                        sortColumn={sortColumn}
                                        sortDirection={sortDirection}
                                    />
                                    <TableHeaderCell
                                        columnName="projectManager"
                                        columnLabel="Projektmanager"
                                        handleSort={handleSort}
                                        sortColumn={sortColumn}
                                        sortDirection={sortDirection}
                                    />
                                    <TableHeaderCell
                                        columnName="startDate"
                                        columnLabel="Start"
                                        handleSort={handleSort}
                                        sortColumn={sortColumn}
                                        sortDirection={sortDirection}
                                    />
                                    <TableHeaderCell
                                        columnName="endDate"
                                        columnLabel="Ende"
                                        handleSort={handleSort}
                                        sortColumn={sortColumn}
                                        sortDirection={sortDirection}
                                    />
                                    <TableHeaderCell
                                        columnName="digitalisation"
                                        columnLabel="Digitalisierung"
                                        handleSort={handleSort}
                                        sortColumn={sortColumn}
                                        sortDirection={sortDirection}
                                    />

                                    <TableHeaderCell
                                        columnName="budget"
                                        columnLabel="Budget"
                                        handleSort={handleSort}
                                        sortColumn={sortColumn}
                                        sortDirection={sortDirection}
                                    />

                                </tr>
                            </thead>
                            <tbody>
                                {getSortedProjects().map(project =>
                                    <tr key={project.id}>
                                        <td>{getProjectIdWithPrefix(project.id, project.projectType, project.responsibleLocation)}</td>
                                        <td>{project.name}</td>
                                        <td>{project.projectType}</td>
                                        <td>{getProjectStatus(project.projectStatus)}</td>
                                        <td>{project.projectManager}</td>
                                        <td>{Moment(project.startDate).format('DD.MM.YYYY')}</td>
                                        <td>{Moment(project.endDate).format('DD.MM.YYYY')}</td>
                                        <td>{project.digitalisation}</td>
                                        <td>{project.budget} EUR</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table >
                    </div>
                </div>
            )}



        </div>
    );
};

export default Dashboard;
