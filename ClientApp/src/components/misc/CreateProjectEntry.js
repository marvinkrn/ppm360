import React from 'react'
import { Col, FormGroup, FormText, Input, InputGroup, InputGroupText, Label } from 'reactstrap'

export const CreateProjectsEntry = ({ id, name, type, formText, options, min, inputGroupText }) => {

    return (
        <FormGroup row>
            <Label for={id} sm={3}>
                {name}
            </Label>
            <Col sm={9}>
                <InputGroup>
                    <Input type={type} id={id} name={id} min={min}>
                        {options && (
                            <>
                                <option hidden value="">
                                    Bitte auswählen
                                </option>
                                {options.map((option, index) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </>
                        )}
                    </Input>
                    {inputGroupText && (
                        <InputGroupText>
                            {inputGroupText}
                        </InputGroupText>
                    )}
                </InputGroup>
                <FormText>
                    {formText}
                </FormText>
            </Col>
        </FormGroup>
    )

}
