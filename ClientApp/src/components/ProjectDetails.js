
import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Col, Input, FormText, Row, Card, CardTitle, CardText } from 'reactstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Moment from 'moment';
import FigureCard from './misc/FigureCard';
import Skeleton from 'react-loading-skeleton';
import jwt_decode from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircleQuestion, faCircleXmark, faFileInvoice } from '@fortawesome/free-solid-svg-icons';

function ProjectDetails(props) {

    const { id } = useParams();
    const [projectData, setProjectData] = useState(null);
    const [error, setError] = useState(null);

    const [approverView, setApproverView] = useState(false);
    const [modifiable, setModifiable] = useState(false);



    useEffect(() => {
        const headers = { 'Authorization': 'Bearer ' + localStorage.getItem("token") };
        const projectId = id.split('-').pop();

        axios.get(`/api/projects/${projectId}`, { headers })
            .then(response => {
                const data = response.data;
                if (data.applicantUser === localStorage.getItem("username")) {
                    setProjectData(data);
                    if (data.projectStatus === "Abgelehnt") {
                        setModifiable(true);
                    }
                } else {
                    const token = localStorage.getItem('token');
                    let userRole = '';

                    if (token) {
                        const decoded = jwt_decode(token);
                        userRole = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

                        if (userRole === "Approver" && data.projectStatus === "Beantragt") {
                            setApproverView(true);
                            setProjectData(data);
                        } else {
                            setError("Keine Rechte :(");
                        }
                    }
                }
            })
            .catch(error => {
                setError(error.message);
            });
    }, [id]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!projectData) {
        return <div>Loading...</div>;
    }

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
                return <>
                    <div className='d-flex align-items-center'>
                        <div className='ppm360-cell me-3' style={{ backgroundColor: "#fef5e7", color: "#f39c12" }}>
                            <FontAwesomeIcon icon={faFileInvoice} /> {status}
                        </div>
                        <div>
                            Ihr Projekt wurde beantragt. Bitte warten Sie, bis das PMO über Ihren Projektantrag entschieden hat.
                        </div>
                    </div>
                </>;
            case 'Genehmigt':
                return <>
                    <div className='d-flex align-items-center'>
                        <div className='ppm360-cell me-3' style={{ backgroundColor: "#e8f6ef", color: "#27ae60" }}>
                            <FontAwesomeIcon icon={faCheckCircle} /> {status}
                        </div>
                        <div>
                            Ihr Projekt wurde genehmigt. Sie können beginnen.
                        </div>
                    </div>
                </>;
            case 'Abgelehnt':
                return <>
                    <div className='d-flex align-items-center'>
                        <div className='ppm360-cell me-3' style={{ backgroundColor: "#f9ebea", color: "#e74c3c" }}>
                            <FontAwesomeIcon icon={faCircleXmark} /> {status}
                        </div>
                        <div>
                            Ihr Projekt wurde abgelehnt. Bitte nehmen Sie unsere Anmerkungen zur Kenntnis und bearbeiten Sie den Projektantrag entsprechend.
                        </div>
                    </div>
                </>;
            case 'Abgeschlossen':

                return <>
                    <div className='d-flex align-items-center'>
                        <div className='ppm360-cell me-3' style={{ backgroundColor: "#f3f5f5", color: "#737e93" }}>
                            <FontAwesomeIcon icon={faCheckCircle} /> {status}
                        </div>
                        <div>
                            Das Projekt wurde abgeschlossen.
                        </div>
                    </div>
                </>;
            default:
                return <>
                    <div className='d-flex align-items-center'>
                        <div className='ppm360-cell me-3' style={{ backgroundColor: "#f3f5f5", color: "#737e93" }}>
                            <FontAwesomeIcon icon={faCircleQuestion} /> {"Unbekannt: " + status}
                        </div>
                        <div>
                            Der Status Ihres Projekts ist unbekannt. Bitte kontaktieren Sie PMO.
                        </div>
                    </div>
                </>;
        }
    }

    return (
        <div>
            <div className="d-sm-flex align-items-center justify-content-between mt-5 mb-4">
                <h1>Projektdetails: {id.toUpperCase()}</h1>

            </div>
            {approverView && (<Row>
                <FigureCard heading={<Skeleton />} content={<Skeleton width={"50%"} />} />
                <FigureCard heading={<Skeleton />} content={<Skeleton width={"50%"} />} />
                <FigureCard heading={<Skeleton />} content={<Skeleton width={"50%"} />} />
                <FigureCard heading={<Skeleton />} content={<Skeleton width={"50%"} />} />
            </Row>)}

            <Card body className='mb-4'>
                <CardTitle tag="h5">
                    <b>Projektstatus</b>
                </CardTitle>
                <CardText>
                    {getProjectStatus(projectData.projectStatus)}
                </CardText>
            </Card>

            <Form id="createProject">
                <Row>
                    <Col sm="6">
                        <Card body>
                            <CardTitle tag="h5">
                                <b>Stammdaten</b>
                            </CardTitle>
                            <CardText>
                                <FormGroup row>
                                    <Label for="projectId" sm={3}>
                                        Projekt-ID
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly id="projectId" name="projectId" defaultValue={getProjectIdWithPrefix(projectData.id, projectData.projectType)} />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label for="projectName" sm={3}>
                                        Projektname
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="projectName" name="projectName" defaultValue={projectData.name} />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label for="projectType" sm={3}>
                                        Projektart
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="projectType" name="projectType" defaultValue={projectData.projectType} />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label for="teamSize" sm={3}>
                                        Teamgröße
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="teamSize" name="teamSize" defaultValue={projectData.teamSize} />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label for="involvedBusinessUnits" sm={3}>
                                        Beteiligte Geschäftsbereiche
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="involvedBusinessUnits" name="involvedBusinessUnits" defaultValue={projectData.involvedBusinessUnits} />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label for="projectManager" sm={3}>
                                        Projektverantwortlicher
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="projectManager" name="projectManager" defaultValue={projectData.projectManager} />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label sm={3}>
                                        Projektstart
                                    </Label>

                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} value={Moment(projectData.startDate).format('DD.MM.YYYY')} />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label sm={3}>
                                        Projektende
                                    </Label>

                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} value={Moment(projectData.endDate).format('DD.MM.YYYY')} />
                                    </Col>
                                </FormGroup>

                            </CardText>
                        </Card>
                    </Col>
                    <Col sm="6">
                        <Card body>
                            <CardTitle tag="h5">
                                <b>Kosten</b>
                            </CardTitle>
                            <CardText>
                                <FormGroup row>
                                    <Label for="projectBudget" sm={3}>
                                        Budget
                                    </Label>
                                    <Col sm={9}>
                                        <Input id="projectBudget" name="projectBudget" type="text" />
                                        <FormText>
                                            Bitte geben Sie den Betrag des Projektbudgets <b>in EUR</b> an.
                                        </FormText>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="internalCost" sm={3}>
                                        Interne Kosten
                                    </Label>
                                    <Col sm={9}>
                                        <Input id="internalCost" name="internalCost" type="text" />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="externalCost" sm={3}>
                                        Externe Kosten
                                    </Label>
                                    <Col sm={9}>
                                        <Input id="externalCost" name="externalCost" type="text" />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="investionCost" sm={3}>
                                        Investitionen
                                    </Label>
                                    <Col sm={9}>
                                        <Input id="investionCost" name="investionCost" type="text" />
                                    </Col>
                                </FormGroup>
                            </CardText>
                        </Card>
                    </Col>
                </Row>
            </Form>

        </div>
    );
}


export default ProjectDetails;