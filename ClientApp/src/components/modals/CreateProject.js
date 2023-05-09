
import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Col, Input, FormText } from 'reactstrap';
import axios from 'axios';
import { faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function CreateProject(props) {
    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);

        axios.post('/api/projects', {
            name: data.get('projectName'),
            budget: data.get('projectBudget'),
        })
            .then(response => {
                console.log(response);
                // Reponse verarbeiten, UI updaten, Toast
            })
            .catch(error => {
                console.log(error);
                // Fehler anzeigen?
            });

        toggle();
    }


    return (
        <div>
            <Button color="primary" onClick={toggle}>
                <FontAwesomeIcon icon={faFileCirclePlus} /> Projektantrag hinzufügen
            </Button>

            <Modal isOpen={modal} toggle={toggle} centered size='lg'>
                <ModalHeader toggle={toggle}>Projektantrag hinzufügen</ModalHeader>
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