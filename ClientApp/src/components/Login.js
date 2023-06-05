import React, { Component } from 'react'
import { Button, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap'
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

export class Login extends Component {
    static displayName = Login.name;

    constructor(props) {
        super(props);

        this.state = {
            errorMessage: '',
            isUsernameInvalid: false,
            isPasswordInvalid: false,
            isLoading: false
        };
    }

    componentDidMount() {
        document.title = "Log In | Supernova AG";
    }

    handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const username = formData.get("username");
        const password = formData.get("password");

        if (!username) {
            this.setState({ isUsernameInvalid: true });
            return;
        }

        if (!password) {
            this.setState({ isPasswordInvalid: true });
            return;
        }

        this.setState({ isLoading: true });

        const loginData = {
            username: username,
            password: password,
        };

        fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify(loginData),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                // Saving the token and username to the localStorage when success
                if (data.success === true) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("username", formData.get("username").toLowerCase())
                    window.location.href = "/";
                } else if (data.success === false) {
                    this.setState({ errorMessage: "Ungültiger Benutzername oder Passwort." }); // Update the error message state
                }
            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error(error);
            })
            .finally(() => {
                this.setState({ isLoading: false });
            });
    };

    render() {
        const { errorMessage, isUsernameInvalid, isPasswordInvalid, isLoading } = this.state;

        return (
            <div className="login-wrapper">
                <div className="d-sm-flex align-items-center justify-content-between mt-5 mb-5">
                    <h1>Anmelden</h1>
                </div>

                {errorMessage && (
                    <div className="errorMessage">
                        <span className='errorMessage-icon'><FontAwesomeIcon icon={faCircleExclamation} /></span>
                        {errorMessage}
                    </div>
                )}

                <Form className='login-form' onSubmit={this.handleSubmit}>
                    <FormGroup floating>
                        <Input
                            id="username"
                            name="username"
                            placeholder="Username"
                            type="text"

                            invalid={isUsernameInvalid} // Set the "invalid" prop based on state
                            onChange={() => this.setState({ isUsernameInvalid: false })} // Reset the "invalid" state on input change
                        />
                        <Label for="username">Benutzername</Label>
                        {isUsernameInvalid && <FormFeedback>Bitte geben Sie einen Benutzernamen ein.</FormFeedback>}
                    </FormGroup>

                    {' '}
                    <FormGroup floating>
                        <Input
                            id="password"
                            name="password"
                            placeholder="Password"
                            type="password"

                            invalid={isPasswordInvalid} // Set the "invalid" prop based on state
                            onChange={() => this.setState({ isPasswordInvalid: false })} // Reset the "invalid" state on input change
                        />
                        <Label for="password">Passwort</Label>
                        {isPasswordInvalid && <FormFeedback>Bitte geben Sie ein Passwort ein.</FormFeedback>}
                    </FormGroup>
                    {' '}
                    <Button className="login-button" color="primary" type="submit" disabled={isLoading}>
                        Anmelden
                    </Button>
                </Form>

                <div className='supernova-ag-logo'>
                    <picture>

                        <img style={{ height: '18px', display: 'flex', alignContent: 'center' }}
                            src={require('../images/supernova_logo_dark.png')}
                            alt="Supernova AG"
                        />
                    </picture>
                </div>

            </div>
        );
    }

}
