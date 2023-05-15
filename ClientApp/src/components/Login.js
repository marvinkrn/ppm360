import React, { Component } from 'react'
import { Button, Form, FormGroup, Input, Label } from 'reactstrap'
import './Login.css';

export class Login extends Component {
    static displayName = Login.name;



    componentDidMount() {
        document.title = "Log In | Supernova AG";
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);


        const loginData = {
            username: formData.get("username"),
            password: formData.get("password"),
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
                if (data.success === true) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("username", formData.get("username"))
                    console.log("SUCCESS");
                    window.location.href = "/";
                }

            })
            .catch((error) => {
                // Handle any errors that occurred during the request
                console.error(error);
            });
    };

    render() {
        return (

            <div className="login-wrapper">

                <div className="d-sm-flex align-items-center justify-content-between mt-5 mb-5">
                    <h1>Anmelden</h1>
                </div>

                <Form className='login-form' onSubmit={this.handleSubmit}>
                    <FormGroup floating>
                        <Input
                            id="username"
                            name="username"
                            placeholder="Username"
                            type="text"
                        />
                        <Label for="username">
                            Username
                        </Label>
                    </FormGroup>
                    {' '}
                    <FormGroup floating>
                        <Input
                            id="password"
                            name="password"
                            placeholder="Password"
                            type="password"
                        />
                        <Label for="password">
                            Passwort
                        </Label>
                    </FormGroup>
                    {' '}
                    <Button className="login-button" color="primary" type='submit'>
                        Anmelden
                    </Button>
                </Form>



            </div>

        );
    }
}
