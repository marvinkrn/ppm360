import React, { Component } from 'react'
import { Button, Form, FormGroup, Input, Label } from 'reactstrap'



export class Login extends Component {
    static displayName = Login.name;

    componentDidMount() {
        document.title = "Log In | Supernova AG";
    }

    render() {
        return (
            <div id="wrapper">

                <div class="d-sm-flex align-items-center justify-content-between mt-5 mb-5">
                    <h1>Anmelden</h1>
                </div>

                <div>
                    <Form>
                        <FormGroup floating>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                            />
                            <Label for="username">
                                Username
                            </Label>
                        </FormGroup>
                        {' '}
                        <FormGroup floating>
                            <Input
                                id="userPassword"
                                name="userPassword"
                                type="password"
                            />
                            <Label for="userPassword">
                                Passwort
                            </Label>
                        </FormGroup>
                        {' '}
                        <Button color="primary" type='submit'>
                            Anmelden
                        </Button>
                    </Form>
                </div>




            </div>

        );
    }
}
