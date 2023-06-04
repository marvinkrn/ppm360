
import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Col, Input, FormText, Row, Card, CardTitle, CardText } from 'reactstrap';
import axios from 'axios';
import Moment from 'moment';

function ProjectsCreate(props) {

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        const headers = { 'Authorization': 'Bearer ' + localStorage.getItem("token") };
        console.log(data.get('solutionScopeExtend'));

        axios.post('/api/projects', {
            name: data.get('projectName'),
            projecttype: data.get('projectType'),
            projectmanager: data.get('projectManager'),
            pmWorkload: data.get('pmWorkload'),
            projectstatus: "Beantragt",
            budget: data.get('budget'),
            internalCost: data.get('internalCost'),
            externalCost: data.get('externalCost'),
            investments: data.get('investments'),
            teamsize: data.get('teamSize'),
            involvedbusinessunits: data.get('involvedBusinessUnits'),
            executiveUnit: data.get('executiveUnit'),
            startdate: data.get('startDate'),
            enddate: data.get('endDate'),
            createdat: Moment(new Date()).format('YYYY-MM-DD'),
            applicantuser: localStorage["username"],
            projectDescription: data.get('projectDescription'),
            affectedLocation:  data.get('affectedLocation'),
            responsibleLocation:  data.get('responsibleLocation'),
            digitalisation: data.get('digitalisation'),
            customerSatisfaction: data.get('customerSatisfaction'),
            everydayBenefit: data.get('everydayBenefit'),
            projectRisk: data.get('projectRisk'),
            externalStakeholders: data.get('externalStakeholders'),
            bufferDays: data.get('bufferDays'),
            experience: data.get('experience'),
            solutionScopeExtend: data.get('solutionScopeExtend'),
            supportExpense: data.get('supportExpense'),
            turnoverIncrease1: data.get('turnoverIncrease1'),
            turnoverIncrease2: data.get('turnoverIncrease2'),
            turnoverIncrease3: data.get('turnoverIncrease3'),
            turnoverIncrease4: data.get('turnoverIncrease4'),
            turnoverIncrease5: data.get('turnoverIncrease5'),
            costSavings1: data.get('costSavings1'),
            costSavings2: data.get('costSavings2'),
            costSavings3: data.get('costSavings3'),
            costSavings4: data.get('costSavings4'),
            costSavings5: data.get('costSavings5'),
            capitalValue: data.get('capitalValue'),
            projectCost: parseInt(data.get('internalCost')) + parseInt(data.get('externalCost')) + parseInt(data.get('investments')),
            costReduction: data.get('capitalValue'),
            comments: { "user1": "Kommentar 1", "user2": "Kommentar 2" },
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
                            <CardTitle tag="h5">
                                <b>Stammdaten</b>
                            </CardTitle>
                            <CardText>

                                <FormGroup row>
                                    <Label for="projectName" sm={3}>
                                        Projektname
                                    </Label>
                                    <Col sm={9}>
                                        <Input id="projectName" name="projectName" type="text" />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label for="projectType" sm={3}>
                                        Projektart
                                    </Label>
                                    <Col sm={9}>
                                        <Input id="projectType" name="projectType" type="select">
                                            <option hidden value="">Bitte auswählen</option>
                                            <option>IT-Projekt</option>
                                            <option>Innovationsprojekt</option>
                                            <option>Erneuerungsprojekt</option>
                                            <option>Cooles Projekt</option>
                                            <option>Letztes Projekt</option>
                                        </Input>
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label for="teamSize" sm={3}>
                                        Teamgröße
                                    </Label>
                                    <Col sm={9}>
                                        <Input id="teamSize" name="teamSize" type="number" min="1" />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label for="involvedBusinessUnits" sm={3}>
                                        Beteiligte Geschäftsbereiche
                                    </Label>
                                    <Col sm={9}>
                                        <Input id="involvedBusinessUnits" name="involvedBusinessUnits" type="select">
                                            <option hidden value="">Bitte auswählen (genaue Zahlen tbd.)</option>
                                            <option>S | 1-3</option>
                                            <option>M | 3-6</option>
                                            <option>L | 7-15</option>
                                            <option>XL | 15+</option>
                                        </Input>

                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label for="projectManager" sm={3}>
                                        Projektverantwortlicher
                                    </Label>
                                    <Col sm={9}>
                                        <Input id="projectManager" name="projectManager" type="text" />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label for="pmWorkload" sm={3}>
                                        Auslastung des Projektmanagers (%)
                                    </Label>
                                    <Col sm={9}>
                                        <Input id="pmWorkload" name="pmWorkload" type="number"  min="1" />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label for="executiveUnit" sm={3}>
                                        Ausführende Abteilung
                                    </Label>
                                    <Col sm={9}>
                                        <Input id="executiveUnit" name="executiveUnit" type="text" />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label for="affectedLocation" sm={3}>
                                        Betroffener Standort
                                    </Label>
                                    <Col sm={9}>
                                        <Input id="affectedLocation" name="affectedLocation" type="select">
                                            <option hidden value="">Bitte auswählen</option>
                                            <option>Freiburg</option>
                                            <option>Loerrach</option>
                                            <option>Mallorca</option>
                                            <option>Berlin</option>
                                        </Input>

                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="responsibleLocation" sm={3}>
                                        Verantwortlicher Standort
                                    </Label>
                                    <Col sm={9}>
                                        <Input id="responsibleLocation" name="responsibleLocation" type="select">
                                            <option hidden value="">Bitte auswählen</option>
                                            <option>Freiburg</option>
                                            <option>Loerrach</option>
                                            <option>Mallorca</option>
                                            <option>Berlin</option>
                                        </Input>
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label for="startDate" sm={3}>
                                        Projektstart
                                    </Label>

                                    <Col sm={9}>
                                        <Input
                                            id="startDate"
                                            name="startDate"
                                            type="date"
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label for="endDate" sm={3}>
                                        Projektende
                                    </Label>

                                    <Col sm={9}>
                                        <Input
                                            id="endDate"
                                            name="endDate"
                                            type="date"
                                        />
                                    </Col>
                                </FormGroup>

                                <FormGroup row>
                                    <Label for="projectDescription" sm={3}>
                                        Projektkurzbeschreibung
                                    </Label>
                                    <Col sm={9}>
                                        <Input id="projectDescription" name="projectDescription" type="text" />
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
                                        <Input id="budget" name="budget" type="text" />
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
                                    <Label for="investments" sm={3}>
                                        Investitionen
                                    </Label>
                                    <Col sm={9}>
                                        <Input id="investments" name="investments" type="text" />
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
                                            <Input id="digitalisation" name="digitalisation" type="select">
                                                <option hidden value="">Bitte auswählen</option>
                                                <option>Niedrig</option>
                                                <option>Mittel</option>
                                                <option>Hoch</option>
                                            </Input>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label for="customerSatisfaction" sm={3}>
                                            Kundenzufriedenheit
                                        </Label>
                                        <Col sm={9}>
                                            <Input id="customerSatisfaction" name="customerSatisfaction" type="select">
                                                <option hidden value="">Bitte auswählen</option>
                                                <option>Niedrig</option>
                                                <option>Mittel</option>
                                                <option>Hoch</option>
                                            </Input>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label for="everydayBenefit" sm={3}>
                                            Everyday Benefit
                                        </Label>
                                        <Col sm={9}>
                                            <Input id="everydayBenefit" name="everydayBenefit" type="select">
                                                <option hidden value="">Bitte auswählen</option>
                                                <option>Niedrig</option>
                                                <option>Mittel</option>
                                                <option>Hoch</option>
                                            </Input>
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
                                        <Input id="projectRisk" name="projectRisk" type="number"  min="0" />
                                        <FormText>
                                            Bitte geben Sie die Risikokennzahl nach Supernove-Standard an.
                                        </FormText>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="externalStakeholders" sm={3}>
                                        Externe Stakeholder
                                    </Label>
                                    <Col sm={9}>
                                        <Input id="externalStakeholders" name="externalStakeholders" type="number" min="0" />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="bufferDays" sm={3}>
                                        Puffertage
                                    </Label>
                                    <Col sm={9}>
                                        <Input id="bufferDays" name="bufferDays" type="number" min="0" />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                        <Label for="experience" sm={3}>
                                            Erfahrungen
                                        </Label>
                                        <Col sm={9}>
                                            <Input id="experience" name="experience" type="select">
                                                <option hidden value="">Bitte auswählen</option>
                                                <option>Sehr gut</option>
                                                <option>Gut</option>
                                                <option>Zufriedenstellend</option>
                                                <option>Schlecht</option>
                                            </Input>
                                        </Col>
                                    </FormGroup>
                                <FormGroup tag="fieldset">
                                <legend>
                                Lösungsumfang
                                </legend>
                                <FormGroup check>
                                <Input
                                    type="radio"
                                    id="solutionScopeExtend" 
                                    name="solutionScopeExtend"
                                    value="1"
                                />
                                {' '}
                                <Label check>
                                    Prozess bekannt, kleiner Funktionsumfang
                                </Label>
                                </FormGroup>
                                <FormGroup check>
                                <Input
                                    type="radio"
                                    id="solutionScopeExtend" 
                                    name="solutionScopeExtend"
                                    value="3"
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
                                    type="radio"
                                    id="solutionScopeExtend" 
                                    name="solutionScopeExtend"
                                    value="7"
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
                                    type="radio"
                                    id="solutionScopeExtend" 
                                    name="solutionScopeExtend"
                                    value="10"
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
                                        <Input id="supportExpense" name="supportExpense" type="number" min="0" />
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
                                        <Input id="turnoverIncrease1" name="turnoverIncrease1" type="number" />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="turnoverIncrease2" sm={3}>
                                    Erwartete Umsatzsteigerung Jahr 2
                                    </Label>
                                    <Col sm={9}>
                                        <Input id="turnoverIncrease2" name="turnoverIncrease2" type="number" />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="turnoverIncrease3" sm={3}>
                                    Erwartete Umsatzsteigerung Jahr 3
                                    </Label>
                                    <Col sm={9}>
                                        <Input id="turnoverIncrease3" name="turnoverIncrease3" type="number" />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="turnoverIncrease4" sm={3}>
                                    Erwartete Umsatzsteigerung Jahr 4
                                    </Label>
                                    <Col sm={9}>
                                        <Input id="turnoverIncrease4" name="turnoverIncrease4" type="number" />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="turnoverIncrease5" sm={3}>
                                    Erwartete Umsatzsteigerung Jahr 5
                                    </Label>
                                    <Col sm={9}>
                                        <Input id="turnoverIncrease5" name="turnoverIncrease5" type="number" />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="costSavings1" sm={3}>
                                    Erwartete Kostensenkung Jahr 1
                                    </Label>
                                    <Col sm={9}>
                                        <Input id="costSavings1" name="costSavings1" type="number" />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="costSavings2" sm={3}>
                                    Erwartete Kostensenkung Jahr 2
                                    </Label>
                                    <Col sm={9}>
                                        <Input id="costSavings2" name="costSavings2" type="number" />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="costSavings3" sm={3}>
                                    Erwartete Kostensenkung Jahr 3
                                    </Label>
                                    <Col sm={9}>
                                        <Input id="costSavings3" name="costSavings3" type="number" />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="costSavings4" sm={3}>
                                    Erwartete Kostensenkung Jahr 4
                                    </Label>
                                    <Col sm={9}>
                                        <Input id="costSavings4" name="costSavings4" type="number" />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="costSavings5" sm={3}>
                                    Erwartete Kostensenkung Jahr 5
                                    </Label>
                                    <Col sm={9}>
                                        <Input id="costSavings5" name="costSavings5" type="number" />
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
                                        <Input id="capitalValue" name="capitalValue" type="number" />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="costReduction" sm={3}>
                                    Kostenreduktion in Euro
                                    </Label>
                                    <Col sm={9}>
                                        <Input id="costReduction" name="costReduction" type="number" />
                                    </Col>
                                </FormGroup>
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