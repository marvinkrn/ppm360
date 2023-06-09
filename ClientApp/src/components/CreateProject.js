import React from 'react';
import { Button, Form, FormGroup, Label, Col, Input, Row, Card, CardTitle, CardText } from 'reactstrap';
import axios from 'axios';
import Moment from 'moment';
import { CreateProjectsEntry } from './misc/CreateProjectEntry';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProjectsCreate(props) {

    const validate = (elementID, elementData) => {
        const inputElement = document.getElementById(elementID);
        if (elementData === '' || elementData == null) {
          inputElement.style.borderColor = 'red';
        } else {
          inputElement.style.borderColor = '';
        }
      };

      const validateR = (elementID, elementData) => {
        const inputElement = document.getElementById(elementID);
        if (elementData === '' || elementData == null) {
          inputElement.style.color = 'red';
          inputElement.style.textDecoration = 'underline';
        } else {
          inputElement.style.color = 'black';
          inputElement.style.textDecoration = 'none';
        }
      };

      const validateD = (elementID, elementData) => {
        const inputElement = document.getElementById(elementID);
        const isValid = /^\d+$/.test(elementData);
        if (elementData === '' || elementData == null || !isValid) {
          inputElement.style.borderColor = 'red';
        }
        else {
          inputElement.style.borderColor = '';
        }
      };

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        const headers = { 'Authorization': 'Bearer ' + localStorage.getItem("token") };

        const fields = ['projectName', 'projectType', 'projectManager', 'productManagerWorkload', 'teamSize',
        'involvedBusinessUnits', 'executiveUnit', 'startDate', 'endDate', 'projectDescription', 'affectedLocation', 'responsibleLocation', 'digitalisation',
        'customerSatisfaction', 'everydayBenefit', 'projectRisk', 'externalStakeholders', 'bufferDays', 'experience', 'supportEffort'];

        const fieldsD = ['budget', 'internalCost', 'externalCost', 'investments', 'turnoverIncreaseY1', 'turnoverIncreaseY2', 'turnoverIncreaseY3', 
        'turnoverIncreaseY4', 'turnoverIncreaseY5', 'costSavingsY1', 'costSavingsY2', 'costSavingsY3', 'costSavingsY4', 'costSavingsY5', 'capitalValue',
        'costReduction'];

        fields.forEach(field => {
            validate(field, data.get(field));
        });

        fieldsD.forEach(fieldD => {
            validateD(fieldD, data.get(fieldD).replace(".", "").replace(",", ""));
        });

        validateR('solScopeProc', data.get('solutionScopeProcess'));
        validateR('solScopeFunc', data.get('solutionScopeFunctional'));

        axios.post('/api/projects', {
            name: data.get('projectName'),
            projectType: data.get('projectType'),
            projectManager: data.get('projectManager'),
            productManagerWorkload: data.get('productManagerWorkload'),
            projectStatus: "Beantragt",
            budget: data.get('budget').replace(".", "").replace(",", "."),
            internalCost: data.get('internalCost').replace(".", "").replace(",", "."),
            externalCost: data.get('externalCost').replace(".", "").replace(",", "."),
            investments: data.get('investments').replace(".", "").replace(",", "."),
            teamSize: data.get('teamSize'),
            involvedBusinessUnits: data.get('involvedBusinessUnits'),
            executiveUnit: data.get('executiveUnit'),
            startDate: data.get('startDate'),
            endDate: data.get('endDate'),
            createdAt: Moment(new Date()).format('YYYY-MM-DD'),
            applicantUser: localStorage["username"],
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
            turnoverIncreaseY1: data.get('turnoverIncreaseY1').replace(".", "").replace(",", "."),
            turnoverIncreaseY2: data.get('turnoverIncreaseY2').replace(".", "").replace(",", "."),
            turnoverIncreaseY3: data.get('turnoverIncreaseY3').replace(".", "").replace(",", "."),
            turnoverIncreaseY4: data.get('turnoverIncreaseY4').replace(".", "").replace(",", "."),
            turnoverIncreaseY5: data.get('turnoverIncreaseY5').replace(".", "").replace(",", "."),
            costSavingsY1: data.get('costSavingsY1').replace(".", "").replace(",", "."),
            costSavingsY2: data.get('costSavingsY2').replace(".", "").replace(",", "."),
            costSavingsY3: data.get('costSavingsY3').replace(".", "").replace(",", "."),
            costSavingsY4: data.get('costSavingsY4').replace(".", "").replace(",", "."),
            costSavingsY5: data.get('costSavingsY5').replace(".", "").replace(",", "."),
            capitalValue: data.get('capitalValue').replace(".", "").replace(",", "."),
            projectCost: parseFloat(data.get('internalCost').replace(".", "").replace(",", ".")) + parseFloat(data.get('externalCost').replace(".", "").replace(",", ".")) + parseFloat(data.get('investments').replace(".", "").replace(",", ".")),
            costReduction: data.get('costReduction').replace(".", "").replace(",", "."),
            comments: [],

        }, { headers }
        )
            .then(response => {
                const data = JSON.stringify(response);
                console.log("Success");
                window.location.href = "/projects/?success=true";

                // Reponse verarbeiten, UI updaten, Toast
            })
            .catch(error => {
                const data = JSON.stringify(error);
                console.log("Fehler:" + data);
                toast.error('Submit nicht erfolgreich! Überprüfen Sie Ihre Eingaben.');
                // Fehler anzeigen?
            });

    }


    return (
        <div>
            <div className="d-sm-flex align-items-center justify-content-between mt-5 mb-5">
                <h1>Neues Projekt beantragen</h1>
            </div>
            <Form id="createProject" onSubmit={handleSubmit}>
                <Row>
                    <Col sm="6">

                        <Card body>
                            <CardTitle tag="h5">Stammdaten</CardTitle>
                            <CardText>
                                <CreateProjectsEntry id="projectName" name="Projektname" type="text" />
                                <CreateProjectsEntry id="projectType" name="Projektart" type="select" options={["Investitionsprojekt", "Organisationsprojekt", "F&E-Projekt", "IT-Projekt"]} />
                                <CreateProjectsEntry id="teamSize" name="Teamgröße" type="number" min="1" />
                                <CreateProjectsEntry id="involvedBusinessUnits" name="Beteiligte Geschäftsbereiche" type="number" min="1" />
                                <CreateProjectsEntry id="projectManager" name="Projektmanager" type="text" />
                                <CreateProjectsEntry id="productManagerWorkload" name="Auslastung des Projektmanagers" type="number" min="1" formText={"Bitte geben Sie die Auslastung des Projektmanagers in Prozent an."} />
                                <CreateProjectsEntry id="executiveUnit" name="Ausführende Abteilung" type="text" />
                                <CreateProjectsEntry id="affectedLocation" name="Betroffener Standort" type="select" options={["Freiburg", "Lörrach", "Berlin", "Mallorca", "München"]} />
                                <CreateProjectsEntry id="responsibleLocation" name="Verantwortlicher Standort" type="select" options={["Freiburg", "Lörrach", "Berlin", "Mallorca", "München"]} />
                                <CreateProjectsEntry id="startDate" name="Projektstart" type="date" />
                                <CreateProjectsEntry id="endDate" name="Projektende" type="date" />
                                <CreateProjectsEntry id="projectDescription" name="Projektkurzbeschreibung" type="textarea" />
                            </CardText>
                        </Card>


                        <Card body>
                            <CardTitle tag="h5">Kosten</CardTitle>
                            <CardText>
                                <CreateProjectsEntry id="budget" name="Budget" type="text" formText={"Bitte geben Sie den Betrag des Projektbudgets in EUR an."} />
                                <CreateProjectsEntry id="internalCost" name="Interne Kosten" type="text" />
                                <CreateProjectsEntry id="externalCost" name="Externe Kosten" type="text" />
                                <CreateProjectsEntry id="investments" name="Investitionen" type="text" />
                            </CardText>
                        </Card>

                        <Card body>
                            <CardTitle tag="h5">Strategie</CardTitle>
                            <CardText>
                                <CreateProjectsEntry id="digitalisation" name="Digitalisierung" type="select" options={["Niedrig", "Mittel", "Hoch"]} />
                                <CreateProjectsEntry id="customerSatisfaction" name="Kundenzufriedenheit" type="select" options={["Niedrig", "Mittel", "Hoch"]} />
                                <CreateProjectsEntry id="everydayBenefit" name="Everyday Benefit" type="select" options={["Niedrig", "Mittel", "Hoch"]} />
                            </CardText>
                        </Card>

                    </Col>
                    <Col sm="6">

                        <Card body>
                            <CardTitle tag="h5">Komplexität</CardTitle>
                            <CardText>
                                <CreateProjectsEntry id="projectRisk" name="Projektrisiko-Kennzahl" type="number" min="0" formText={"Bitte geben Sie die Risikokennzahl nach Supernova-Standard an."} />
                                <CreateProjectsEntry id="externalStakeholders" name="Externe Stakeholder" type="number" min="0" />
                                <CreateProjectsEntry id="bufferDays" name="Puffertage" type="number" min="0" />
                                <CreateProjectsEntry id="experience" name="Erfahrungen" type="select" options={["Sehr gut", "Gut", "Zufriedenstellend", "Schlecht"]} />


                                <FormGroup row>
                                    <h6>Lösungsumfang</h6>
                                    <Label id = 'solScopeProc' for="solutionScopeProcess" sm={3}>
                                        Prozess
                                    </Label>
                                    <Col sm={9}>
                                        <FormGroup check>
                                            <Input type="radio" id="solutionScopeProcess" name="solutionScopeProcess" value="Bekannt" />
                                            <Label check>
                                                Bekannt
                                            </Label>
                                        </FormGroup>
                                        <FormGroup check>
                                            <Input type="radio" id="solutionScopeProcess" name="solutionScopeProcess" value="Unbekannt" />
                                            <Label check>
                                                Unbekannt
                                            </Label>
                                        </FormGroup>
                                    </Col>

                                </FormGroup>
                                <FormGroup row>

                                    <Label id = 'solScopeFunc' for="solutionScopeFunctional" sm={3}>
                                        Funktionsumfang
                                    </Label>
                                    <Col sm={9}>
                                        <FormGroup check>
                                            <Input type="radio" id="solutionScopeFunctional" name="solutionScopeFunctional" value="Klein" />
                                            <Label check>
                                                Klein
                                            </Label>
                                        </FormGroup>
                                        <FormGroup check>
                                            <Input type="radio" id="solutionScopeFunctional" name="solutionScopeFunctional" value="Groß" />
                                            <Label check>
                                                Groß
                                            </Label>
                                        </FormGroup>
                                    </Col>
                                </FormGroup>

                                <CreateProjectsEntry id="supportEffort" name="Supportaufwand" type="number" min="0" formText={"Bitte geben Sie den Supportaufwand in Stunden pro Jahr an."} />


                            </CardText>
                        </Card>

                        <Card body>
                            <CardTitle tag="h5">Projektleistungen</CardTitle>
                            <CardText>

                                <Row>
                                    <h6>Erwartete Umsatzsteigerung</h6>
                                    <Col>
                                        <Input type="text" id="turnoverIncreaseY1" name='turnoverIncreaseY1' />
                                        Jahr 1

                                    </Col>
                                    <Col>
                                        <Input type="text" id="turnoverIncreaseY2" name='turnoverIncreaseY2' />
                                        Jahr 2
                                    </Col>
                                    <Col>
                                        <Input type="text" id="turnoverIncreaseY3" name='turnoverIncreaseY3' />
                                        Jahr 3
                                    </Col>

                                    <Col>
                                        <Input type="text" id="turnoverIncreaseY4" name='turnoverIncreaseY4' />
                                        Jahr 4

                                    </Col>
                                    <Col>
                                        <Input type="text" id="turnoverIncreaseY5" name='turnoverIncreaseY5' />
                                        Jahr 5
                                    </Col>
                                </Row>

                                <Row>
                                    <h6>Erwartete Kostensenkung</h6>
                                    <Col>
                                        <Input type="text" id="costSavingsY1" name='costSavingsY1' />
                                        Jahr 1
                                    </Col>
                                    <Col>
                                        <Input type="text" id="costSavingsY2" name='costSavingsY2' />
                                        Jahr 2
                                    </Col>
                                    <Col>
                                        <Input type="text" id="costSavingsY3" name='costSavingsY3' />
                                        Jahr 3
                                    </Col>
                                    <Col>
                                        <Input type="text" id="costSavingsY4" name='costSavingsY4' />
                                        Jahr 4
                                    </Col>
                                    <Col>
                                        <Input type="text" id="costSavingsY5" name='costSavingsY5' />
                                        Jahr 5
                                    </Col>
                                </Row>
                            </CardText>
                        </Card>

                        <Card body>
                            <CardTitle tag="h5">Finanzkennzahlen</CardTitle>
                            <CardText>
                                <CreateProjectsEntry id="capitalValue" name="Kapitalwert (NVP)" type="text" formText={"Bitte geben Sie den Kapitalwert (NVP) des Projekts bei 5% Mindestverzinsung an."} />
                                <CreateProjectsEntry id="costReduction" name="Kostenreduktion in Euro" type="text" />
                            </CardText>
                        </Card>

                    </Col>
                </Row>
            </Form>

            <Button color="secondary" onClick={() => { window.location.href = "/projects" }}>
                Abbrechen
            </Button>
            <Button color="primary" form='createProject' type='submit'>
                Speichern
            </Button>{' '}
        <ToastContainer position="bottom-left" />
        </div>
    );
}

export default ProjectsCreate;