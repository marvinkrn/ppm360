import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import CreateProject from './modals/CreateProject';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faChevronRight, faCircleQuestion, faCircleXmark, faFileInvoice, faInfoCircle, faRotateRight } from '@fortawesome/free-solid-svg-icons'

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from "react-chartjs-2";
import { Button, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap';
import Moment from 'moment';


ChartJS.register(ArcElement, Tooltip, Legend);

export default class ReviewProjects extends Component {
    static displayName = ReviewProjects.name;

    constructor(props) {
        super(props);
        this.state = { projects: [], loading: true, selectedProject: null };
        this.refreshData = this.refreshData.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
    }

    componentDidMount() {
        this.populateProjects();
        document.title = "PPM360 | Supernova AG";
    }

    refreshData() {
        this.setState({ loading: true });
        this.populateProjects();
    }

    handleRowClick(project) {
        this.setState({ selectedProject: project });
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

    renderModal() {
        const { selectedProject } = this.state;

        return (
            <Modal isOpen={selectedProject !== null} toggle={() => this.setState({ selectedProject: null })} centered size='lg'>
                <ModalHeader toggle={() => this.setState({ selectedProject: null })}>Projektdetails</ModalHeader>
                <ModalBody>
                    {selectedProject && (

                        <Form>
                            <FormGroup row>
                                <Label sm={2}>
                                    Projektname
                                </Label>
                                <Col sm={10}>
                                    <Input value={selectedProject.name} readOnly />
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label for="projectType" sm={2}>
                                    Projektart
                                </Label>
                                <Col sm={10}>
                                    <Input value={selectedProject.projectType} readOnly />
                                </Col>
                            </FormGroup>



                            <FormGroup row>
                                <Label for="projectManager" sm={2}>
                                    Projekt&shy;verantwortlicher
                                </Label>
                                <Col sm={10}>
                                    <Input value={selectedProject.projectManager} readOnly />
                                </Col>
                            </FormGroup>


                            <FormGroup row>
                                <Label for="projectBudget" sm={2}>
                                    Budget
                                </Label>
                                <Col sm={10}>
                                    <Input value={selectedProject.budget} readOnly />
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label for="startDate" sm={2}>
                                    Projektstart
                                </Label>

                                <Col sm={10}>
                                    <Input value={Moment(selectedProject.startDate).format('DD.MM.YYYY')} readOnly />
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label for="endDate" sm={2}>
                                    Projektende
                                </Label>

                                <Col sm={10}>
                                    <Input value={Moment(selectedProject.endDate).format('DD.MM.YYYY')} readOnly />
                                </Col>
                            </FormGroup>
                        </Form>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => this.setState({ selectedProject: null })}>
                        Projektantrag ablehnen
                    </Button>
                    <Button color="primary" type='submit'>
                        Projektantrag genehmigen
                    </Button>{' '}
                </ModalFooter>
            </Modal>
        );
    }



    static renderProjectsTable(projects, handleRowClick) {

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
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {projects.filter(project => project.projectStatus === "Beantragt").map(project =>
                        <tr key={project.id} onClick={() => handleRowClick(project)}>
                            <td>{getProjectIdWithPrefix(project.id, project.projectType)}</td>
                            <td>{project.name}</td>
                            <td style={{ verticalAlign: "middle" }}>{getProjectStatus(project.projectStatus)}</td>
                            <td>{Moment(project.createdAt).format('DD.MM.YYYY')}</td>
                            <td><FontAwesomeIcon icon={faChevronRight} /></td>
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
            ? ReviewProjects.renderLoadingTable()
            : ReviewProjects.renderProjectsTable(this.state.projects, this.handleRowClick.bind(this));
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
                {this.renderModal()}


            </div>



        );
    }
}

