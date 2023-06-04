
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
                    {approverView && (<>
                        <div className='approveButtons'>
                            <Button color="secondary" >
                                Projektantrag ablehnen
                            </Button>
                            <Button color="primary">
                                Projektantrag genehmigen
                            </Button>
                        </div>

                    </>)}
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
                                    <Label for="applicantuser" sm={3}>
                                        Antragsteller
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="applicantuser" name="applicantuser" defaultValue={projectData.applicantUser} />
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
                                    <Label for="pmWorkload" sm={3}>
                                        Auslastung des Projektmanagers (%)
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="pmWorkload" name="pmWorkload" defaultValue={projectData.pmWorkload}/>
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label for="executiveUnit" sm={3}>
                                        Ausführende Abteilung
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="executiveUnit" name="executiveUnit" defaultValue={projectData.executiveUnit} />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label for="affectedLocation" sm={3}>
                                        Betroffener Standord
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="affectedLocation" name="affectedLocation" defaultValue={projectData.affectedLocation} />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label for="responsibleLocation" sm={3}>
                                        Verantwortlicher Standort
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="responsibleLocation" name="responsibleLocation" defaultValue={projectData.responsibleLocation} />
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

                                <FormGroup row>
                                    <Label for="projectDescription" sm={3}>
                                        Verantwortlicher Standort
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="projectDescription" name="projectDescription" defaultValue={projectData.projectDescription} />
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
                                    <Label for="budget" sm={3}>
                                        Budget
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="budget" name="budget" type="text" defaultValue={projectData.budget} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="internalCost" sm={3}>
                                        Interne Kosten
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="internalCost" name="internalCost" type="text" defaultValue={projectData.internalCost} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="externalCost" sm={3}>
                                        Externe Kosten
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="externalCost" name="externalCost" type="text" defaultValue={projectData.externalCost}/>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="investments" sm={3}>
                                        Investitionen
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="investments" name="investments" type="text" defaultValue={projectData.investments}/>
                                    </Col>
                                </FormGroup>
                            </CardText>
                        </Card>
                    </Col>
                </Row>
                <Row>
                <Col sm="6">
                        <Card body>
                            <CardTitle tag="h5">
                                <b>Strategie</b>
                            </CardTitle>
                            <CardText>
                                <FormGroup row>
                                        <Label for="digitalisation" sm={3}>
                                            Digitalisierung
                                        </Label>
                                        <Col sm={9}>
                                            <Input readOnly={!modifiable} id="digitalisation" name="digitalisation" defaultValue={projectData.digitalisation}/>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label for="customerSatisfaction" sm={3}>
                                            Kundenzufriedenheit
                                        </Label>
                                        <Col sm={9}>
                                            <Input readOnly={!modifiable} id="customerSatisfaction" name="customerSatisfaction" defaultValue={projectData.customerSatisfaction} />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label for="everydayBenefit" sm={3}>
                                            Everyday Benefit
                                        </Label>
                                        <Col sm={9}>
                                            <Input readOnly={!modifiable} id="everydayBenefit" name="everydayBenefit" defaultValue={projectData.everydayBenefit} />
                                        </Col>
                                    </FormGroup>
                            </CardText>
                        </Card>
                    </Col>
                    <Col sm="6">
                        <Card body>
                            <CardTitle tag="h5">
                                <b>Komplexität</b>
                            </CardTitle>
                            <CardText>
                                <FormGroup row>
                                    <Label for="projectRisk" sm={3}>
                                        Projektrisiko-Kennzahl
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="projectRisk" name="projectRisk" type="number" defaultValue={projectData.projectRisk} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="externalStakeholders" sm={3}>
                                        Externe Stakeholder
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="externalStakeholders" name="externalStakeholders" type="number" defaultValue={projectData.externalStakeholders} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="bufferDays" sm={3}>
                                        Puffertage
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="bufferDays" name="bufferDays" type="number" defaultValue={projectData.bufferDays} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                        <Label for="experience" sm={3}>
                                            Erfahrungen
                                        </Label>
                                        <Col sm={9}>
                                            <Input readOnly={!modifiable} id="experience" name="experience" defaultValue={projectData.experience} />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup tag="fieldset">
                                <legend>
                                Lösungsumfang
                                </legend>
                                <FormGroup check>
                                <Input
                                    disabled = {!modifiable}
                                    type="radio"
                                    id="solutionScopeExtend" 
                                    name="solutionScopeExtend"
                                    value="1"
                                    checked = {projectData.solutionScopeExtend == "1"? true:false}
                                />
                                {' '}
                                <Label check>
                                    Prozess bekannt, kleiner Funktionsumfang
                                </Label>
                                </FormGroup>
                                <FormGroup check>
                                <Input
                                    disabled = {!modifiable}
                                    type="radio"
                                    id="solutionScopeExtend" 
                                    name="solutionScopeExtend"
                                    value="3"
                                    checked = {projectData.solutionScopeExtend == "3"? true:false}
                                />
                                {' '}
                                <Label check>
                                Prozess bekannt, großer Funktionsumfang
                                </Label>
                                </FormGroup>
                                <FormGroup
                                check
                                disabled
                                >
                                <Input
                                    disabled = {!modifiable}
                                    type="radio"
                                    id="solutionScopeExtend" 
                                    name="solutionScopeExtend"
                                    value="7"
                                    checked = {projectData.solutionScopeExtend == "7"? true:false}
                                />
                                {' '}
                                <Label check>
                                Prozess unbekannt, kleiner Funktionsumfang
                                </Label>
                                </FormGroup>
                                <FormGroup
                                check
                                disabled
                                >
                                <Input
                                    disabled = {!modifiable}
                                    type="radio"
                                    id="solutionScopeExtend" 
                                    name="solutionScopeExtend"
                                    value="10"
                                    checked = {projectData.solutionScopeExtend == "10"? true:false}
                                />
                                {' '}
                                <Label check>
                                Prozess unbekannt, großer Funktionsumfang
                                </Label>
                                </FormGroup>
                            </FormGroup>
                                <FormGroup row>
                                    <Label for="supportExpense" sm={3}>
                                        Supportaufwand in Stunden pro Jahr
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="supportExpense" name="supportExpense" type="number" defaultValue={projectData.supportExpense} />
                                    </Col>
                                </FormGroup>
                            </CardText>
                        </Card>
                    </Col>
                </Row>
                <Row>
                <Col sm="6">
                        <Card body>
                            <CardTitle tag="h5">
                                <b>Projektleistungen</b>
                            </CardTitle>
                            <CardText>
                                <FormGroup row>
                                    <Label for="turnoverIncrease1" sm={3}>
                                    Erwartete Umsatzsteigerung Jahr 1
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="turnoverIncrease1" name="turnoverIncrease1" type="number" defaultValue={projectData.turnoverIncrease1}/>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="turnoverIncrease2" sm={3}>
                                    Erwartete Umsatzsteigerung Jahr 2
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="turnoverIncrease2" name="turnoverIncrease2" type="number" defaultValue={projectData.turnoverIncrease2} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="turnoverIncrease3" sm={3}>
                                    Erwartete Umsatzsteigerung Jahr 3
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="turnoverIncrease3" name="turnoverIncrease3" type="number" defaultValue={projectData.turnoverIncrease3} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="turnoverIncrease4" sm={3}>
                                    Erwartete Umsatzsteigerung Jahr 4
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="turnoverIncrease4" name="turnoverIncrease4" type="number" defaultValue={projectData.turnoverIncrease4} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="turnoverIncrease5" sm={3}>
                                    Erwartete Umsatzsteigerung Jahr 5
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="turnoverIncrease5" name="turnoverIncrease5" type="number" defaultValue={projectData.turnoverIncrease5} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="costSavings1" sm={3}>
                                    Erwartete Kostensenkung Jahr 1
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="costSavings1" name="costSavings1" type="number" defaultValue={projectData.costSavings1} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="costSavings2" sm={3}>
                                    Erwartete Kostensenkung Jahr 2
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="costSavings2" name="costSavings2" type="number" defaultValue={projectData.costSavings2} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="costSavings3" sm={3}>
                                    Erwartete Kostensenkung Jahr 3
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="costSavings3" name="costSavings3" type="number" defaultValue={projectData.costSavings3} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="costSavings4" sm={3}>
                                    Erwartete Kostensenkung Jahr 4
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="costSavings4" name="costSavings4" type="number" defaultValue={projectData.costSavings4} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="costSavings5" sm={3}>
                                    Erwartete Kostensenkung Jahr 5
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="costSavings5" name="costSavings5" type="number" defaultValue={projectData.costSavings5} />
                                    </Col>
                                </FormGroup>
                            </CardText>
                        </Card>
                    </Col>
                    <Col sm="6">
                        <Card body>
                            <CardTitle tag="h5">
                                <b>Finanzkennzahlen</b>
                            </CardTitle>
                            <CardText>
                                <FormGroup row>
                                    <Label for="capitalValue" sm={3}>
                                    Kapitalwert (NVP) des Projekts bei 5% Mindestverzinsung
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="capitalValue" name="capitalValue" type="number" defaultValue={projectData.capitalValue}/>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="costReduction" sm={3}>
                                    Kostenreduktion in Euro
                                    </Label>
                                    <Col sm={9}>
                                        <Input readOnly={!modifiable} id="costReduction" name="costReduction" type="number" defaultValue={projectData.costReduction}/>
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