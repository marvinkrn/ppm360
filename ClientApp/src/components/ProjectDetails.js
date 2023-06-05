
import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Col, Input, Row, Card, CardTitle, CardText } from 'reactstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Moment from 'moment';
import FigureCard from './misc/FigureCard';
import Skeleton from 'react-loading-skeleton';
import jwt_decode from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircleQuestion, faCircleXmark, faClock, faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import { ProjectDetailsEntry } from './misc/ProjectDetailsEntry';
import { useNavigate } from 'react-router-dom';
import { getProjectIdWithPrefix } from './misc/helper';
import { getInitials } from './misc/InitialsAvatar';
import { evaluateBufferDays, evaluateComplexity, evaluateCosts, evaluateCustomerSatisfaction, evaluateDigitalisation, evaluateEverydayBenefit, evaluateFinancialFigures, evaluateProject, evaluateProjectPerformance, evaluateProjectRisk, evaluateProjectScope, evaluateProjectToString, evaluateStrategy } from './misc/evaluations';

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

        const form = event.target;
        const data = new FormData(form);

        setDenyMessage(data.get("comment"));

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

        var comments = projectData.comments;

        if (denyMessage != '') {
            var commentEntry = {
                "User": localStorage.getItem("username"),
                "Comment": denyMessage,
                "Timestamp": Moment(new Date()).format('DD.MM.YYYY HH:mm'),
            }

            comments.push(commentEntry);
        }

        var projectStatus = "";

        switch (data.get('submitType')) {
            case 'approve':
                projectStatus = "Genehmigt"
                break;
            case 'modify':
                projectStatus = "Beantragt"
                break;
            case 'deny':
                projectStatus = "Abgelehnt"
                break;
        }

        axios.put(`/api/projects/${projectId}`, {
            id: projectId,
            name: data.get('projectName'),
            projectType: data.get('projectType'),
            projectManager: data.get('projectManager'),
            productManagerWorkload: data.get('productManagerWorkload'),
            projectStatus: projectStatus,
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
            comments: comments,
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
                            <form id="denyProject" onSubmit={handleDeny}>
                                <Input type="textarea" id="comment" name="comment" />
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={toggle}>
                                Abbrechen
                            </Button>

                            <Button color="primary" type="submit" form="denyProject">
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
                        {modifiable && (
                            <>
                                <h5 className='comments-heading'>Anmerkungen</h5>
                                <div className="comments-wrapper">
                                    {projectData.comments.map((comment, index) => (
                                        <div key={index}>
                                            <div className='d-flex justify-content-between mb-4'>
                                                <div className="comments-avatar-wrapper">
                                                    <div role="img" className="comments-avatar">
                                                        <div className="avatar-content">
                                                            {getInitials(comment.User)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card comments-content">
                                                    <div className="card-header d-flex justify-content-between">
                                                        <p className="fw-bold mb-0">{comment.User}</p>
                                                        <p className="small mb-0"><FontAwesomeIcon icon={faClock} /> {comment.Timestamp}</p>
                                                    </div>
                                                    <div className="card-body">
                                                        <p className="mb-0">
                                                            {comment.Comment}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </CardText>
                </Card>

                {approverView && (<Row>
                    <FigureCard heading="Gesamtbewertung" content={evaluateProjectToString(evaluateProject(projectData))} />
                    <FigureCard heading="Projektumfang" content={evaluateProjectScope(projectData)} />
                    <FigureCard heading="Kosten" content={evaluateCosts(projectData)} />
                    <FigureCard heading="Strategie" content={evaluateStrategy(projectData)} />
                    <FigureCard heading="Projektrisiko" content={evaluateProjectRisk(projectData)} />
                    <FigureCard heading="Komplexität" content={evaluateComplexity(projectData)} />
                    <FigureCard heading="Projektleistungen" content={evaluateProjectPerformance(projectData)} />
                    <FigureCard heading="Finanzkennzahlen" content={evaluateFinancialFigures(projectData)} />
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

                                                <Input type="radio" id="solutionScopeProcess" name="solutionScopeProcess" value="Bekannt" checked={projectData.solutionScopeProcess == "Bekannt" ? true : false} readOnly={!modifiable} />
                                                <Label check>
                                                    Bekannt
                                                </Label>
                                            </FormGroup>
                                            <FormGroup check>
                                                <Input type="radio" id="solutionScopeProcess" name="solutionScopeProcess" value="Unbekannt" checked={projectData.solutionScopeProcess == "Unbekannt" ? true : false} readOnly={!modifiable} />
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

                                                <Input type="radio" id="solutionScopeFunctional" name="solutionScopeFunctional" value="Klein" checked={projectData.solutionScopeFunctional == "Klein" ? true : false} readOnly={!modifiable} />
                                                <Label check>
                                                    Klein
                                                </Label>
                                            </FormGroup>
                                            <FormGroup check>
                                                <Input type="radio" id="solutionScopeFunctional" name="solutionScopeFunctional" value="Groß" checked={projectData.solutionScopeFunctional == "Groß" ? true : false} readOnly={!modifiable} />
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
                        <div className='d-flex justify-content-start'>
                            <Button color="primary" form='modifyProject' type='submit' onClick={handleModify}>
                                Überarbeitetes Projekt beantragen
                            </Button>
                        </div>
                    </>)}

                </form>

            </div>
        );




}




export default ProjectDetails;

