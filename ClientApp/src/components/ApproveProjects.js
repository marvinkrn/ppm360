import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faFileCircleXmark, faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { Table } from 'reactstrap';
import jwt_decode from 'jwt-decode';
import Moment from 'moment';
import Unauthorized from './misc/Unauthorized';
import { getProjectIdWithPrefix, getProjectStatus } from './misc/helper';

export default class ApproveProjects extends Component {
    static displayName = ApproveProjects.name;

    constructor(props) {
        super(props);
        this.state = { projects: [], loading: true, selectedProject: null };
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

        const filteredProjects = projects.filter(project => project.projectStatus === "Beantragt");

        return (
            <Table hover responsive>
                <thead>
                    <tr>
                        <th>Projekt-ID</th>
                        <th>Projektname</th>
                        <th>Status</th>
                        <th>Erstellt am</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {filteredProjects.length > 0 ? (
                        filteredProjects.map(project => (
                            <tr key={project.id} onClick={() => { window.location.href = "/projects/" + getProjectIdWithPrefix(project.id, project.projectType) }}>
                                <td>{getProjectIdWithPrefix(project.id, project.projectType)}</td>
                                <td>{project.name}</td>
                                <td style={{ verticalAlign: "middle" }}>{getProjectStatus(project.projectStatus)}</td>
                                <td>{Moment(project.createdAt).format('DD.MM.YYYY')}</td>
                                <td><FontAwesomeIcon icon={faChevronRight} /></td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center"><FontAwesomeIcon icon={faFileCircleXmark} style={{ marginRight: "5px" }} /> Es sind keine offenen Projektanträge vorhanden.</td>
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
            ? ApproveProjects.renderLoadingTable()
            : ApproveProjects.renderProjectsTable(this.state.projects);

        const decoded = jwt_decode(localStorage.getItem('token'));
        let userRole = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        if (userRole !== "Approver") return (<Unauthorized />);

        return (
            <div>

                <div className="d-sm-flex align-items-center justify-content-between mt-5 mb-5">
                    <h1>Offene Projektanträge</h1>

                    <div className="d-sm-flex">
                        <button className="btn btn-secondary mx-2" onClick={this.refreshData}>
                            <FontAwesomeIcon icon={faRotateRight} /> Daten aktualisieren
                        </button>
                    </div>

                </div>

                {contents}

            </div>
        );
    }
}

