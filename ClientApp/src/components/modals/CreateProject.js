
import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Col, Input, FormText } from 'reactstrap';

function CreateProject(props) {
    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    return (
        <div>
            <Button color="primary" onClick={toggle}>
                Projektantrag hinzufügen
            </Button>

            <Modal isOpen={modal} toggle={toggle} centered size='lg'>
                <ModalHeader toggle={toggle}>Projektantrag hinzufügen</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup row>
                            <Label for="projectName" sm={2}>
                                Projektname
                            </Label>
                            <Col sm={10}>
                                <Input id="projectName" name="name" type="text" />
                            </Col>
                        </FormGroup>

                        <FormGroup row>
                            <Label for="projectType" sm={2}>
                                Projektart
                            </Label>
                            <Col sm={10}>
                                <Input id="projectType" name="select" type="select">
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
                            <Label for="projectCost" sm={2}>
                                Erwartete Kosten
                            </Label>
                            <Col sm={10}>
                                <Input id="projectCost" name="name" type="text" />
                                <FormText>
                                    Bitte geben Sie den Betrag der erwarteten Gesamtkosten des Projekts <b>in EUR</b> an.
                                </FormText>
                            </Col>
                        </FormGroup>

                        <FormGroup row>
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
                            <Col sm={{ size: 10 }}>
                                <FormGroup check>
                                    <Input id="checkbox2" type="checkbox" />
                                    {' '}
                                    <Label check>
                                        Ich bestätige, dass die gemachten Angaben richtig sind (?)
                                    </Label>
                                </FormGroup>
                            </Col>
                        </FormGroup>
                        <FormGroup check row>
                            <Col sm={{ offset: 2, size: 10 }}>
                                <Button>
                                    Submit
                                </Button>
                            </Col>
                        </FormGroup>
                    </Form>

                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggle}>
                        Abbrechen
                    </Button>
                    <Button color="primary" onClick={toggle}>
                        Speichern
                    </Button>{' '}
                </ModalFooter>
            </Modal>
        </div>
    );
}


export default CreateProject;