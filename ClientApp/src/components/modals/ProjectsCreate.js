
import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Col, Input, FormText, Row, Card, CardTitle, CardText } from 'reactstrap';
import axios from 'axios';
import { faFileCirclePlus, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Moment from 'moment';

function ProjectsCreate(props) {

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

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

        toggle();
    }


    return (
        <div>
            <div className="d-sm-flex align-items-center justify-content-between mt-5 mb-5">
                <h1>Neues Projekt beantragen</h1>



            </div>
            <Row>
                <Col sm="6">
                    <Card body>
                        <CardTitle tag="h5">
                            <b>Projektdaten</b>
                        </CardTitle>
                        <CardText>
                            <Form id="createProject" onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Label for="projectName">
                                        Projektname
                                    </Label>

                                    <Input id="projectName" name="projectName" type="text" />

                                </FormGroup>

                                <FormGroup>
                                    <Label for="projectType">
                                        Projektart
                                    </Label>

                                    <Input id="projectType" name="projectType" type="select">
                                        <option hidden value="">Bitte auswählen</option>
                                        <option>IT-Projekt</option>
                                        <option>Innovationsprojekt</option>
                                        <option>Erneuerungsprojekt</option>
                                        <option>Cooles Projekt</option>
                                        <option>Letztes Projekt</option>
                                    </Input>

                                </FormGroup>

                            </Form>
                        </CardText>
                    </Card>
                </Col>
                <Col sm="6">
                    <Card body>
                        <CardTitle tag="h5">
                            <b>Kosten</b>
                        </CardTitle>
                        <CardText>

                            <FormGroup>
                                <Label for="internalCost">
                                    Interne Kosten
                                </Label>

                                <Input id="internalCost" name="internalCost" type="text" />

                            </FormGroup>
                            <FormGroup>
                                <Label for="externalCost">
                                    Externe Kosten
                                </Label>

                                <Input id="externalCost" name="externalCost" type="text" />

                            </FormGroup><FormGroup>
                                <Label for="investionCost">
                                    Investitionen
                                </Label>

                                <Input id="investionCost" name="investionCost" type="text" />

                            </FormGroup>
                        </CardText>
                    </Card>
                </Col>
            </Row>


            <Form id="createProject" onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="projectName">
                        Projektname
                    </Label>

                    <Input id="projectName" name="projectName" type="text" />

                </FormGroup>

                <FormGroup row>
                    <Label for="projectName" sm={2}>
                        Projektname
                    </Label>
                    <Col sm={10}>
                        <Input id="projectName" name="projectName" type="text" />
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="projectType" sm={2}>
                        Projektart
                    </Label>
                    <Col sm={10}>
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
                    <Label for="teamSize" sm={2}>
                        Teamgröße
                    </Label>
                    <Col sm={10}>
                        <Input id="teamSize" name="teamSize" type="number" min="1" />



                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="involvedBusinessUnits" sm={2}>
                        Beteiligte Geschäftsbereiche
                    </Label>
                    <Col sm={10}>
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
                    <Label for="projectManager" sm={2}>
                        Projekt&shy;verantwortlicher
                    </Label>
                    <Col sm={10}>
                        <Input id="projectManager" name="projectManager" type="text" />
                    </Col>
                </FormGroup>


                <FormGroup row>
                    <Label for="projectBudget" sm={2}>
                        Budget
                    </Label>
                    <Col sm={10}>
                        <Input id="projectBudget" name="projectBudget" type="text" />
                        <FormText>
                            Bitte geben Sie den Betrag des Projektbudgets <b>in EUR</b> an.
                        </FormText>
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="startDate" sm={2}>
                        Projektstart
                    </Label>

                    <Col sm={10}>
                        <Input
                            id="startDate"
                            name="startDate"
                            type="date"
                        />
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="endDate" sm={2}>
                        Projektende
                    </Label>

                    <Col sm={10}>
                        <Input
                            id="endDate"
                            name="endDate"
                            type="date"
                        />
                    </Col>
                </FormGroup>


                {/** <FormGroup row>
                            <Label for="applicationDocument" sm={2}>
                                Projektantrag
                            </Label>
                            <Col sm={10}>
                                <Input id="applicationDocument" name="document" type="file" />
                                <FormText>
                                    Bitte laden Sie hier den Projektantrag in einem üblichen Format hoch.
                                </FormText>
                            </Col>
                        </FormGroup>
                        
                        <FormGroup row>
                            <Label for="projectStatus" sm={2}>
                                Projektstatus
                            </Label>
                            <Col sm={10}>
                                <Input id="projectStatus" name="projectStatus" type="select">
                                    <option>Beantragt</option>
                                    <option>Genehmigt</option>
                                    <option>Abgeschlossen</option>
                                </Input>
                            </Col>
                        </FormGroup>*/}


            </Form>


            <Button color="secondary" onClick={toggle}>
                Abbrechen
            </Button>
            <Button color="primary" form='createProject' type='submit'>
                Speichern
            </Button>{' '}

        </div>
    );
}


export default ProjectsCreate;