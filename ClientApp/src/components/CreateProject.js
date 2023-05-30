
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

        axios.post('/api/projects', {
            name: data.get('projectName'),
            projecttype: data.get('projectType'),
            projectmanager: data.get('projectManager'),
            projectstatus: "Beantragt",
            budget: data.get('projectBudget'),
            teamsize: data.get('teamSize'),
            involvedbusinessunits: data.get('involvedBusinessUnits'),
            executiveUnit: data.get('executiveUnit'),
            startdate: data.get('startDate'),
            enddate: data.get('endDate'),
            createdat: Moment(new Date()).format('YYYY-MM-DD'),
            applicantuser: localStorage["username"],
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
                                    <Label for="executiveUnit" sm={3}>
                                        Ausführende Abteilung
                                    </Label>
                                    <Col sm={9}>
                                        <Input id="executiveUnit" name="executiveUnit" type="text" />
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