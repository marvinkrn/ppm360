import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import CreateProject from './modals/CreateProject';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faCircleQuestion, faCircleXmark, faFileInvoice, faInfoCircle, faRotateRight } from '@fortawesome/free-solid-svg-icons'

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from "react-chartjs-2";
import { Table } from 'reactstrap';
import Moment from 'moment';


ChartJS.register(ArcElement, Tooltip, Legend);

export default class Requests extends Component {
    static displayName = Requests.name;

    constructor(props) {
        super(props);
        this.state = { projects: [], loading: true };
        this.refreshData = this.refreshData.bind(this);
    }

    componentDidMount() {
        this.populateProjects();
        document.title = "PPM360 | Supernova AG";
    }

    refreshData() {
        this.setState({ loading: true });
        this.populateProjects();
    }

    async populateProjects() {
        try {
            const headers = { 'Authorization': 'Bearer ' + localStorage.getItem("token") };
            const response = await fetch('api/projects', { headers });
            const data = await response.json();
            this.setState({ projects: data, loading: false });
        } catch (error) {
            // Error handling
        }
    }



    static renderProjectsTable(projects) {

        function getProjectIdWithPrefix(projectId, projectType) {
            let prefix;

            switch (projectType) {
                case 'IT-Projekt':
                    prefix = 'SAG-IT';
                    break;
                case 'Erneuerungsprojekt':
                    prefix = 'SAG-ER';
                    break;
                case 'Innovationsprojekt':
                    prefix = 'SAG-IN';
                    break;
                default:
                    prefix = 'SAG-X';
                    break;
            }
            return `${prefix}-${projectId}`;
        }

        function getProjectStatus(status) {
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

        return (



            <Table hover responsive>

                <thead>
                    <tr>
                        <th>Projekt-ID</th>
                        <th>Projektname</th>
                        <th>Status</th>
                        <th>Erstellt am</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.filter(project => project.applicantUser === localStorage.getItem("username")).map(project =>
                        <tr key={project.id}>
                            <td>{getProjectIdWithPrefix(project.id, project.projectType)}</td>
                            <td>{project.name}</td>
                            <td style={{ verticalAlign: "middle" }}>{getProjectStatus(project.projectStatus)}</td>
                            <td>{Moment(project.createdAt).format('DD.MM.YYYY')}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        );
    }

    static renderLoadingTable() {
        const entries = 10;
        const skeletonEntries = Array.from({ length: entries }).map((_, index) => (
            <tr key={index}>
                <td><Skeleton width={"50%"} /></td>
                <td><Skeleton width={"50%"} /></td>
            </tr>
        ));

        return (
            <Table responsive>
                <thead>
                    <tr>
                        <th><Skeleton width={"75%"} /></th>
                        <th><Skeleton width={"75%"} /></th>
                    </tr>
                </thead>
                <tbody>
                    {skeletonEntries}
                </tbody>
            </Table>
        );
    }


    render() {
        let contents = this.state.loading
            ? Requests.renderLoadingTable()
            : Requests.renderProjectsTable(this.state.projects);
        return (
            <div>

                <div className="d-sm-flex align-items-center justify-content-between mt-5 mb-5">
                    <h1>Meine Projektanträge</h1>

                    <div className="d-sm-flex">
                        <button className="btn btn-secondary mx-2" onClick={this.refreshData}>
                            <FontAwesomeIcon icon={faRotateRight} /> Daten aktualisieren
                        </button>
                        <CreateProject />
                    </div>

                </div>

                {contents}


            </div>



        );
    }
}

