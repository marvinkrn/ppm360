
import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Col, Input, FormText, Row, Card, CardTitle, CardText } from 'reactstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Moment from 'moment';
import FigureCard from './misc/FigureCard';
import Skeleton from 'react-loading-skeleton';
import jwt_decode from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircleQuestion, faCircleXmark, faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import { ProjectDetailsEntry } from './misc/ProjectDetailsEntry';
import { useNavigate } from 'react-router-dom';
import { getProjectIdWithPrefix } from './misc/helper';
import { evaluateProjectDuration } from './misc/evaluations';
import { CreateProjectsEntry } from './misc/CreateProjectEntry';

function ProjectDetails(props) {
    const navigate = useNavigate();

    const { id } = useParams();
    const [projectData, setProjectData] = useState(null);
    const [error, setError] = useState(null);

    const [submitType, setSubmitType] = useState(null);

    const [approverView, setApproverView] = useState(false);
    const [modifiable, setModifiable] = useState(false);

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const [denyMessage, setDenyMessage] = useState('');

    const formRef = useRef(null);

    const handleDenyModalSubmit = (event) => {
        event.preventDefault();
        setModal(false);

        setSubmitType('deny'); // Set the submitType to 'modify'

        // Perform the 'deny' action with the denyMessage value
        // Add your code here to handle the 'deny' action with the denyMessage value
    }



    const ProjectStatus = ({ status }) => {
        let backgroundColor, color, icon, message;

        switch (status) {
            case 'Beantragt':
                backgroundColor = '#fef5e7';
                color = '#f39c12';
                icon = faFileInvoice;
                message = !approverView ? 'Ihr Projekt wurde beantragt. Bitte warten Sie, bis PMO über Ihren Projektantrag entschieden hat.' : "Bitte überprüfen Sie, ob das Projekt genehmigt oder abgelehnt werden soll.";
                break;
            case 'Genehmigt':
                backgroundColor = '#e8f6ef';
                color = '#27ae60';
                icon = faCheckCircle;
                message = 'Ihr Projekt wurde genehmigt. Sie können beginnen.';
                break;
            case 'Abgelehnt':
                backgroundColor = '#f9ebea';
                color = '#e74c3c';
                icon = faCircleXmark;
                message = 'Ihr Projekt wurde abgelehnt. Bitte nehmen Sie unsere Anmerkungen zur Kenntnis und bearbeiten Sie den Projektantrag entsprechend.';
                break;
            case 'Abgeschlossen':
                backgroundColor = '#f3f5f5';
                color = '#737e93';
                icon = faCheckCircle;
                message = 'Das Projekt wurde abgeschlossen.';
                break;
            default:
                backgroundColor = '#f3f5f5';
                color = '#737e93';
                icon = faCircleQuestion;
                message = 'Der Status Ihres Projekts ist unbekannt. Bitte kontaktieren Sie PMO.';
        }

        return (
            <div className="d-flex align-items-center">
                <div className="ppm360-cell me-3" style={{ backgroundColor, color }}>
                    <FontAwesomeIcon icon={icon} /> {status}
                </div>
                <div>{message}</div>
            </div>
        );
    };

    useEffect(() => {
        const headers = { 'Authorization': 'Bearer ' + localStorage.getItem("token") };
        const projectId = id.split('-').pop();

        axios.get(`/api/projects/${projectId}`, { headers })
            .then(response => {
                const data = response.data;

                const token = localStorage.getItem('token');
                let userRole = '';
                const decoded = jwt_decode(token);
                userRole = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

                if (userRole === "Approver" && data.projectStatus === "Beantragt") {
                    setApproverView(true);
                    setProjectData(data);
                } else if (data.applicantUser === localStorage.getItem("username")) {
                    setProjectData(data);
                    if (data.projectStatus === "Abgelehnt") {
                        setModifiable(true);
                    }
                } else {
                    setError("Keine Rechte :(")
                }

            })
            .catch(error => {
                setError(error.message);
            });
    }, [id]);

    const handleApprove = (event) => {
        setSubmitType('approve'); // Set the submitType to 'approve'
    }

    const handleModify = (event) => {
        setSubmitType('modify'); // Set the submitType to 'modify'
    }

    // Handler for the 'deny' button click
    const handleDeny = (event) => {
        event.preventDefault();
        setModal(false);
        setSubmitType('deny');
        setTimeout(handleDenySubmit, 100);
    }

    const handleDenySubmit = (event) => {
        formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        const headers = { 'Authorization': 'Bearer ' + localStorage.getItem("token") };

        const projectId = id.split('-').pop();

        switch (data.get('submitType')) {
            case 'approve':
                axios.put(`/api/projects/${projectId}`, {
                    id: projectId,
                    name: data.get('projectName'),
                    projectType: data.get('projectType'),
                    projectManager: data.get('projectManager'),
                    productManagerWorkload: data.get('productManagerWorkload'),
                    projectStatus: "Genehmigt",
                    budget: data.get('budget'),
                    internalCost: data.get('internalCost'),
                    externalCost: data.get('externalCost'),
                    investments: data.get('investments'),
                    teamSize: data.get('teamSize'),
                    involvedBusinessUnits: data.get('involvedBusinessUnits'),
                    executiveUnit: data.get('executiveUnit'),
                    startDate: data.get('startDate'),
                    endDate: data.get('endDate'),
                    createdAt: projectData.createdAt,
                    applicantUser: projectData.applicantUser,
                    projectDescription: data.get('projectDescription'),
                    affectedLocation: data.get('affectedLocation'),
                    responsibleLocation: data.get('responsibleLocation'),
                    digitalisation: data.get('digitalisation'),
                    customerSatisfaction: data.get('customerSatisfaction'),
                    everydayBenefit: data.get('everydayBenefit'),
                    projectRisk: data.get('projectRisk'),
                    externalStakeholders: data.get('externalStakeholders'),
                    bufferDays: data.get('bufferDays'),
                    experience: data.get('experience'),
                    solutionScopeProcess: data.get('solutionScopeProcess'),
                    solutionScopeFunctional: data.get('solutionScopeFunctional'),
                    supportEffort: data.get('supportEffort'),
                    turnoverIncreaseY1: data.get('turnoverIncreaseY1'),
                    turnoverIncreaseY2: data.get('turnoverIncreaseY2'),
                    turnoverIncreaseY3: data.get('turnoverIncreaseY3'),
                    turnoverIncreaseY4: data.get('turnoverIncreaseY4'),
                    turnoverIncreaseY5: data.get('turnoverIncreaseY5'),
                    costSavingsY1: data.get('costSavingsY1'),
                    costSavingsY2: data.get('costSavingsY2'),
                    costSavingsY3: data.get('costSavingsY3'),
                    costSavingsY4: data.get('costSavingsY4'),
                    costSavingsY5: data.get('costSavingsY5'),
                    capitalValue: data.get('capitalValue'),
                    projectCost: parseInt(data.get('internalCost')) + parseInt(data.get('externalCost')) + parseInt(data.get('investments')),
                    costReduction: data.get('capitalValue'),
                    comments: {},
                }, { headers })
                    .then(response => {
                        // Handle the success response
                        console.log('Project updated successfully');
                        navigate("/projects");
                        // You can display a success message or perform any other necessary actions
                    })
                    .catch(error => {
                        // Handle the error response
                        console.error('Failed to update project:', error);
                        // You can display an error message or perform any other necessary actions
                    });

                break;
            case 'modify':
                axios.put(`/api/projects/${projectId}`, {
                    id: projectId,
                    name: data.get('projectName'),
                    projectType: data.get('projectType'),
                    projectManager: data.get('projectManager'),
                    productManagerWorkload: data.get('productManagerWorkload'),
                    projectStatus: "Beantragt",
                    budget: data.get('budget'),
                    internalCost: data.get('internalCost'),
                    externalCost: data.get('externalCost'),
                    investments: data.get('investments'),
                    teamSize: data.get('teamSize'),
                    involvedBusinessUnits: data.get('involvedBusinessUnits'),
                    executiveUnit: data.get('executiveUnit'),
                    startDate: data.get('startDate'),
                    endDate: data.get('endDate'),
                    createdAt: projectData.createdAt,
                    applicantUser: projectData.applicantUser,
                    projectDescription: data.get('projectDescription'),
                    affectedLocation: data.get('affectedLocation'),
                    responsibleLocation: data.get('responsibleLocation'),
                    digitalisation: data.get('digitalisation'),
                    customerSatisfaction: data.get('customerSatisfaction'),
                    everydayBenefit: data.get('everydayBenefit'),
                    projectRisk: data.get('projectRisk'),
                    externalStakeholders: data.get('externalStakeholders'),
                    bufferDays: data.get('bufferDays'),
                    experience: data.get('experience'),
                    solutionScopeProcess: data.get('solutionScopeProcess'),
                    solutionScopeFunctional: data.get('solutionScopeFunctional'),
                    supportEffort: data.get('supportEffort'),
                    turnoverIncreaseY1: data.get('turnoverIncreaseY1'),
                    turnoverIncreaseY2: data.get('turnoverIncreaseY2'),
                    turnoverIncreaseY3: data.get('turnoverIncreaseY3'),
                    turnoverIncreaseY4: data.get('turnoverIncreaseY4'),
                    turnoverIncreaseY5: data.get('turnoverIncreaseY5'),
                    costSavingsY1: data.get('costSavingsY1'),
                    costSavingsY2: data.get('costSavingsY2'),
                    costSavingsY3: data.get('costSavingsY3'),
                    costSavingsY4: data.get('costSavingsY4'),
                    costSavingsY5: data.get('costSavingsY5'),
                    capitalValue: data.get('capitalValue'),
                    projectCost: parseInt(data.get('internalCost')) + parseInt(data.get('externalCost')) + parseInt(data.get('investments')),
                    costReduction: data.get('capitalValue'),
                    comments: {},
                }, { headers })
                    .then(response => {
                        // Handle the success response
                        console.log('Project updated successfully');
                        navigate("/projects");
                        // You can display a success message or perform any other necessary actions
                    })
                    .catch(error => {
                        // Handle the error response
                        console.error('Failed to update project:', error);
                        // You can display an error message or perform any other necessary actions
                    });
                break;
            case 'deny':
                axios.put(`/api/projects/${projectId}`, {
                    id: projectId,
                    name: data.get('projectName'),
                    projectType: data.get('projectType'),
                    projectManager: data.get('projectManager'),
                    productManagerWorkload: data.get('productManagerWorkload'),
                    projectStatus: "Abgelehnt",
                    budget: data.get('budget'),
                    internalCost: data.get('internalCost'),
                    externalCost: data.get('externalCost'),
                    investments: data.get('investments'),
                    teamSize: data.get('teamSize'),
                    involvedBusinessUnits: data.get('involvedBusinessUnits'),
                    executiveUnit: data.get('executiveUnit'),
                    startDate: data.get('startDate'),
                    endDate: data.get('endDate'),
                    createdAt: projectData.createdAt,
                    applicantUser: projectData.applicantUser,
                    projectDescription: data.get('projectDescription'),
                    affectedLocation: data.get('affectedLocation'),
                    responsibleLocation: data.get('responsibleLocation'),
                    digitalisation: data.get('digitalisation'),
                    customerSatisfaction: data.get('customerSatisfaction'),
                    everydayBenefit: data.get('everydayBenefit'),
                    projectRisk: data.get('projectRisk'),
                    externalStakeholders: data.get('externalStakeholders'),
                    bufferDays: data.get('bufferDays'),
                    experience: data.get('experience'),
                    solutionScopeProcess: data.get('solutionScopeProcess'),
                    solutionScopeFunctional: data.get('solutionScopeFunctional'),
                    supportEffort: data.get('supportEffort'),
                    turnoverIncreaseY1: data.get('turnoverIncreaseY1'),
                    turnoverIncreaseY2: data.get('turnoverIncreaseY2'),
                    turnoverIncreaseY3: data.get('turnoverIncreaseY3'),
                    turnoverIncreaseY4: data.get('turnoverIncreaseY4'),
                    turnoverIncreaseY5: data.get('turnoverIncreaseY5'),
                    costSavingsY1: data.get('costSavingsY1'),
                    costSavingsY2: data.get('costSavingsY2'),
                    costSavingsY3: data.get('costSavingsY3'),
                    costSavingsY4: data.get('costSavingsY4'),
                    costSavingsY5: data.get('costSavingsY5'),
                    capitalValue: data.get('capitalValue'),
                    projectCost: parseInt(data.get('internalCost')) + parseInt(data.get('externalCost')) + parseInt(data.get('investments')),
                    costReduction: data.get('capitalValue'),
                    comments: {},
                }, { headers })
                    .then(response => {
                        // Handle the success response
                        console.log('Project updated successfully');
                        navigate("/projects");
                        // You can display a success message or perform any other necessary actions
                    })
                    .catch(error => {
                        // Handle the error response
                        console.error('Failed to update project:', error);
                        // You can display an error message or perform any other necessary actions
                    });

                break;
            default:

                break;
        }


    };



    if (error) {
        return (
            <div>
                <div className="mt-5 mb-4">
                    <h1>Fehler</h1>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!projectData) {
        return (
            <div>
                <div className="mt-5 mb-4">
                    <h1><Skeleton width="75%" /></h1>
                    <Skeleton width="50%" />
                </div>

                <Row className='mt-5'>
                    <FigureCard heading={<Skeleton />} content={<Skeleton width={"50%"} />} />
                    <FigureCard heading={<Skeleton />} content={<Skeleton width={"50%"} />} />
                    <FigureCard heading={<Skeleton />} content={<Skeleton width={"50%"} />} />
                    <FigureCard heading={<Skeleton />} content={<Skeleton width={"50%"} />} />
                </Row>
            </div >
        );
    }


    if (projectData)
        return (

            <div>
                {modal && (
                    <Modal isOpen={modal} toggle={toggle}>
                        <ModalHeader toggle={toggle}>Projektantrag ablehnen</ModalHeader>
                        <ModalBody>
                            Bitte geben Sie eine Begründung für die Ablehnung an.
                            <Form id="denyProject" onSubmit={handleSubmit}>
                                <Input type="textarea" id="comment" name="comment" />
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={toggle}>
                                Abbrechen
                            </Button>

                            <Button color="primary" type="submit" form="denyProject" onClick={handleDeny}>
                                Ablehnen

                            </Button>

                        </ModalFooter>
                    </Modal>
                )}

                <div className="d-sm-flex align-items-center justify-content-between mt-5 mb-4">
                    <h1>Projektdetails: {id.toUpperCase()}</h1>
                </div>

                <Card body className='mb-4'>
                    <CardTitle tag="h5">
                        <b>Projektstatus</b>
                    </CardTitle>
                    <CardText>
                        <ProjectStatus status={projectData.projectStatus} />
                        {approverView && (<>
                            <div className='approveButtons'>
                                <Button color="secondary" onClick={toggle}>
                                    Projektantrag ablehnen
                                </Button>
                                <Button color="primary" form='modifyProject' type='submit' onClick={handleApprove}>
                                    Projekt genehmigen
                                </Button>
                            </div>

                        </>)}
                    </CardText>
                </Card>

                {approverView && (<Row>
                    <FigureCard heading={<Skeleton />} content={<Skeleton width={"50%"} />} />
                    <FigureCard heading={<Skeleton />} content={<Skeleton width={"50%"} />} />
                    <FigureCard heading={<Skeleton />} content={<Skeleton width={"50%"} />} />
                    <FigureCard heading={<Skeleton />} content={<Skeleton width={"50%"} />} />
                </Row>)}

                <form ref={formRef} id="modifyProject" onSubmit={handleSubmit}>
                    <Row>
                        <Col sm="6">

                            <Card body>
                                <CardTitle tag="h5">Stammdaten</CardTitle>
                                <CardText>
                                    <input type="hidden" name="submitType" value={submitType} />

                                    <ProjectDetailsEntry id="projectId" name="Projekt-ID" defaultValue={getProjectIdWithPrefix(projectData.id, projectData.projectType, projectData.responsibleLocation)} modifiable />
                                    <ProjectDetailsEntry id="projectName" name="Projektname" type="text" defaultValue={projectData.name} modifiable={!modifiable} />
                                    <ProjectDetailsEntry id="projectType" name="Projektart" type="select" options={["Investitionsprojekt", "Organisationsprojekt", "F&E-Projekt", "IT-Projekt"]} defaultValue={projectData.projectType} modifiable={!modifiable} />
                                    <ProjectDetailsEntry id="teamSize" name="Teamgröße" type="number" min="1" defaultValue={projectData.teamSize} modifiable={!modifiable} />
                                    <ProjectDetailsEntry id="involvedBusinessUnits" name="Beteiligte Geschäftsbereiche" type="number" min="1" defaultValue={projectData.involvedBusinessUnits} modifiable={!modifiable} />
                                    <ProjectDetailsEntry id="projectManager" name="Projektmanager" type="text" defaultValue={projectData.projectManager} modifiable={!modifiable} />
                                    <ProjectDetailsEntry id="productManagerWorkload" name="Auslastung des Projektmanagers" type="number" min="1" formText={"Bitte geben Sie die Auslastung des Projektmanagers in Prozent an."} defaultValue={projectData.productManagerWorkload} modifiable={!modifiable} />
                                    <ProjectDetailsEntry id="executiveUnit" name="Ausführende Abteilung" type="text" defaultValue={projectData.executiveUnit} modifiable={!modifiable} />
                                    <ProjectDetailsEntry id="affectedLocation" name="Betroffener Standort" type="select" options={["Freiburg", "Lörrach", "Berlin", "Mallorca", "München"]} defaultValue={projectData.affectedLocation} modifiable={!modifiable} />
                                    <ProjectDetailsEntry id="responsibleLocation" name="Verantwortlicher Standort" type="select" options={["Freiburg", "Lörrach", "Berlin", "Mallorca", "München"]} defaultValue={projectData.responsibleLocation} modifiable={!modifiable} />
                                    <ProjectDetailsEntry id="startDate" name="Projektstart" type="date" defaultValue={projectData.startDate} modifiable={!modifiable} />
                                    <ProjectDetailsEntry id="endDate" name="Projektende" type="date" defaultValue={projectData.endDate} modifiable={!modifiable} />
                                    <ProjectDetailsEntry id="projectDescription" name="Projektkurzbeschreibung" type="textarea" defaultValue={projectData.projectDescription} modifiable={!modifiable} />
                                </CardText>
                            </Card>

                            <Card body>
                                <CardTitle tag="h5">Kosten</CardTitle>
                                <CardText>
                                    <ProjectDetailsEntry id="budget" name="Budget" type="text" formText={"Bitte geben Sie den Betrag des Projektbudgets in EUR an."} defaultValue={projectData.budget} modifiable={!modifiable} />
                                    <ProjectDetailsEntry id="internalCost" name="Interne Kosten" type="text" defaultValue={projectData.internalCost} modifiable={!modifiable} />
                                    <ProjectDetailsEntry id="externalCost" name="Externe Kosten" type="text" defaultValue={projectData.externalCost} modifiable={!modifiable} />
                                    <ProjectDetailsEntry id="investments" name="Investitionen" type="text" defaultValue={projectData.investments} modifiable={!modifiable} />
                                </CardText>
                            </Card>

                            <Card body>
                                <CardTitle tag="h5">Strategie</CardTitle>
                                <CardText>
                                    <ProjectDetailsEntry id="digitalisation" name="Digitalisierung" type="select" options={["Niedrig", "Mittel", "Hoch"]} defaultValue={projectData.digitalisation} modifiable={!modifiable} />
                                    <ProjectDetailsEntry id="customerSatisfaction" name="Kundenzufriedenheit" type="select" options={["Niedrig", "Mittel", "Hoch"]} defaultValue={projectData.customerSatisfaction} modifiable={!modifiable} />
                                    <ProjectDetailsEntry id="everydayBenefit" name="Everyday Benefit" type="select" options={["Niedrig", "Mittel", "Hoch"]} defaultValue={projectData.everydayBenefit} modifiable={!modifiable} />
                                </CardText>
                            </Card>

                        </Col>
                        <Col sm="6">

                            <Card body>
                                <CardTitle tag="h5">Komplexität</CardTitle>
                                <CardText>
                                    <ProjectDetailsEntry id="projectRisk" name="Projektrisiko-Kennzahl" type="number" min="0" formText={"Bitte geben Sie die Risikokennzahl nach Supernova-Standard an."} defaultValue={projectData.projectRisk} modifiable={!modifiable} />
                                    <ProjectDetailsEntry id="externalStakeholders" name="Externe Stakeholder" type="number" min="0" defaultValue={projectData.externalStakeholders} modifiable={!modifiable} />
                                    <ProjectDetailsEntry id="bufferDays" name="Puffertage" type="number" min="0" defaultValue={projectData.bufferDays} modifiable={!modifiable} />
                                    <ProjectDetailsEntry id="experience" name="Erfahrungen" type="select" options={["Sehr gut", "Gut", "Zufriedenstellend", "Schlecht"]} defaultValue={projectData.experience} modifiable={!modifiable} />

                                    <FormGroup row>
                                        <h6>Lösungsumfang</h6>
                                        <Label for="solutionScopeProcess" sm={3}>
                                            Prozess
                                        </Label>
                                        <Col sm={9}>
                                            <FormGroup check>

                                                <Input type="radio" id="solutionScopeProcess" name="solutionScopeProcess" value="Bekannt" checked={projectData.solutionScopeProcess == "Bekannt" ? true : false} modifiable={!modifiable} />
                                                <Label check>
                                                    Bekannt
                                                </Label>
                                            </FormGroup>
                                            <FormGroup check>
                                                <Input type="radio" id="solutionScopeProcess" name="solutionScopeProcess" value="Unbekannt" checked={projectData.solutionScopeProcess == "Unbekannt" ? true : false} modifiable={!modifiable} />
                                                <Label check>
                                                    Unbekannt
                                                </Label>
                                            </FormGroup>
                                        </Col>

                                    </FormGroup>
                                    <FormGroup row>
                                        <Label for="solutionScopeFunctional" sm={3}>
                                            Funktionsumfang
                                        </Label>
                                        <Col sm={9}>
                                            <FormGroup check>

                                                <Input type="radio" id="solutionScopeFunctional" name="solutionScopeFunctional" value="Klein" checked={projectData.solutionScopeFunctional == "Klein" ? true : false} modifiable={!modifiable} />
                                                <Label check>
                                                    Klein
                                                </Label>
                                            </FormGroup>
                                            <FormGroup check>
                                                <Input type="radio" id="solutionScopeFunctional" name="solutionScopeFunctional" value="Groß" checked={projectData.solutionScopeFunctional == "Groß" ? true : false} modifiable={!modifiable} />
                                                <Label check>
                                                    Groß
                                                </Label>
                                            </FormGroup>
                                        </Col>
                                    </FormGroup>

                                    <ProjectDetailsEntry id="supportEffort" name="Supportaufwand" type="number" min="0" formText={"Bitte geben Sie den Supportaufwand in Stunden pro Jahr an."} defaultValue={projectData.supportEffort} modifiable={!modifiable} />

                                </CardText>
                            </Card>

                            <Card body>
                                <CardTitle tag="h5">Projektleistungen</CardTitle>
                                <CardText>
                                    <Row>
                                        <h6>Erwartete Umsatzsteigerung</h6>
                                        <Col>
                                            <Input type="number" id="turnoverIncreaseY1" name='turnoverIncreaseY1' defaultValue={projectData.turnoverIncreaseY1} readOnly={!modifiable} />
                                            Jahr 1
                                        </Col>
                                        <Col>
                                            <Input type="number" id="turnoverIncreaseY2" name='turnoverIncreaseY2' defaultValue={projectData.turnoverIncreaseY2} readOnly={!modifiable} />
                                            Jahr 2
                                        </Col>
                                        <Col>
                                            <Input type="number" id="turnoverIncreaseY3" name='turnoverIncreaseY3' defaultValue={projectData.turnoverIncreaseY3} readOnly={!modifiable} />
                                            Jahr 3
                                        </Col>
                                        <Col>
                                            <Input type="number" id="turnoverIncreaseY4" name='turnoverIncreaseY4' defaultValue={projectData.turnoverIncreaseY4} readOnly={!modifiable} />
                                            Jahr 4
                                        </Col>
                                        <Col>
                                            <Input type="number" id="turnoverIncreaseY5" name='turnoverIncreaseY5' defaultValue={projectData.turnoverIncreaseY5} readOnly={!modifiable} />
                                            Jahr 5
                                        </Col>
                                    </Row>

                                    <Row>
                                        <h6>Erwartete Kostensenkung</h6>
                                        <Col>
                                            <Input type="number" id="costSavingsY1" name='costSavingsY1' defaultValue={projectData.costSavingsY1} readOnly={!modifiable} />
                                            Jahr 1
                                        </Col>
                                        <Col>
                                            <Input type="number" id="costSavingsY2" name='costSavingsY2' defaultValue={projectData.costSavingsY2} readOnly={!modifiable} />
                                            Jahr 2
                                        </Col>
                                        <Col>
                                            <Input type="number" id="costSavingsY3" name='costSavingsY3' defaultValue={projectData.costSavingsY3} readOnly={!modifiable} />
                                            Jahr 3
                                        </Col>
                                        <Col>
                                            <Input type="number" id="costSavingsY4" name='costSavingsY4' defaultValue={projectData.costSavingsY4} readOnly={!modifiable} />
                                            Jahr 4
                                        </Col>
                                        <Col>
                                            <Input type="number" id="costSavingsY5" name='costSavingsY5' defaultValue={projectData.costSavingsY5} readOnly={!modifiable} />
                                            Jahr 5
                                        </Col>
                                    </Row>
                                </CardText>
                            </Card>

                            <Card body>
                                <CardTitle tag="h5">Finanzkennzahlen</CardTitle>
                                <CardText>
                                    <ProjectDetailsEntry id="capitalValue" name="Kapitalwert (NVP)" type="number" formText={"Bitte geben Sie den Kapitalwert (NVP) des Projekts bei 5% Mindestverzinsung an."} defaultValue={projectData.capitalValue} modifiable={!modifiable} />
                                    <ProjectDetailsEntry id="costReduction" name="Kostenreduktion in Euro" type="number" defaultValue={projectData.costReduction} modifiable={!modifiable} />
                                </CardText>
                            </Card>

                        </Col>
                    </Row>
                    {modifiable && (<>

                        <Button color="primary" form='modifyProject' type='submit' onClick={handleModify}>
                            Überarbeitetes Projekt beantragen
                        </Button>


                    </>)}

                </form>

            </div>
        );




}




export default ProjectDetails;

