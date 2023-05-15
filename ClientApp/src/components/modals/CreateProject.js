
import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Col, Input, FormText } from 'reactstrap';
import axios from 'axios';
import { faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Moment from 'moment';

function CreateProject(props) {

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
            <Button color="primary" onClick={toggle}>
                <FontAwesomeIcon icon={faFileCirclePlus} /> Projekt beantragen
            </Button>

            <Modal isOpen={modal} toggle={toggle} centered size='lg'>
                <ModalHeader toggle={toggle}>Projekt beantragen</ModalHeader>
                <ModalBody>
                    <Form id="createProject" onSubmit={handleSubmit}>
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
                                <Input id="teamSize" name="teamSize" type="select">
                                    <option hidden value="">Bitte auswählen (genaue Zahlen tbd.)</option>
                                    <option>S | 5-10</option>
                                    <option>M | 10-25</option>
                                    <option>L | 25-50</option>
                                    <option>XL | 50+</option>
                                </Input>

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

                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggle}>
                        Abbrechen
                    </Button>
                    <Button color="primary" form='createProject' type='submit'>
                        Speichern
                    </Button>{' '}
                </ModalFooter>
            </Modal>
        </div>
    );
}


export default CreateProject;