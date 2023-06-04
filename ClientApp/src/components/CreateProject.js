
import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Col, Input, FormText, Row, Card, CardTitle, CardText } from 'reactstrap';
import axios from 'axios';
import Moment from 'moment';
import { CreateProjectsEntry } from './misc/CreateProjectEntry';

function ProjectsCreate(props) {

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        const headers = { 'Authorization': 'Bearer ' + localStorage.getItem("token") };

        axios.post('/api/projects', {
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
        }, { headers }
        )
            .then(response => {
                const data = response.json();
                console.log(data);
                // Reponse verarbeiten, UI updaten, Toast
            })
            .catch(error => {
                const data = JSON.stringify(error);
                console.log(data);
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
                                    <Label for="solutionScopeProcess" sm={3}>
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
                                    <Label for="solutionScopeFunctional" sm={3}>
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
                                        <Input type="number" id="turnoverIncreaseY1" name='turnoverIncreaseY1' />
                                        Jahr 1
                                    </Col>
                                    <Col>
                                        <Input type="number" id="turnoverIncreaseY2" name='turnoverIncreaseY2' />
                                        Jahr 2
                                    </Col>
                                    <Col>
                                        <Input type="number" id="turnoverIncreaseY3" name='turnoverIncreaseY3' />
                                        Jahr 3
                                    </Col>
                                    <Col>
                                        <Input type="number" id="turnoverIncreaseY4" name='turnoverIncreaseY4' />
                                        Jahr 4
                                    </Col>
                                    <Col>
                                        <Input type="number" id="turnoverIncreaseY5" name='turnoverIncreaseY5' />
                                        Jahr 5
                                    </Col>
                                </Row>

                                <Row>
                                    <h6>Erwartete Kostensenkung</h6>
                                    <Col>
                                        <Input type="number" id="costSavingsY1" name='costSavingsY1' />
                                        Jahr 1
                                    </Col>
                                    <Col>
                                        <Input type="number" id="costSavingsY2" name='costSavingsY2' />
                                        Jahr 2
                                    </Col>
                                    <Col>
                                        <Input type="number" id="costSavingsY3" name='costSavingsY3' />
                                        Jahr 3
                                    </Col>
                                    <Col>
                                        <Input type="number" id="costSavingsY4" name='costSavingsY4' />
                                        Jahr 4
                                    </Col>
                                    <Col>
                                        <Input type="number" id="costSavingsY5" name='costSavingsY5' />
                                        Jahr 5
                                    </Col>
                                </Row>
                            </CardText>
                        </Card>

                        <Card body>
                            <CardTitle tag="h5">Finanzkennzahlen</CardTitle>
                            <CardText>
                                <CreateProjectsEntry id="capitalValue" name="Kapitalwert (NVP)" type="number" formText={"Bitte geben Sie den Kapitalwert (NVP) des Projekts bei 5% Mindestverzinsung an."} />
                                <CreateProjectsEntry id="costReduction" name="Kostenreduktion in Euro" type="number" />
                            </CardText>
                        </Card>

                    </Col>
                </Row>
            </Form>

            <Button color="secondary">
                Abbrechen
            </Button>
            <Button color="primary" form='createProject' type='submit'>
                Speichern
            </Button>{' '}

        </div>
    );
}


export default ProjectsCreate;