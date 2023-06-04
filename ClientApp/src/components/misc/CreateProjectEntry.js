import React from 'react'
import { Col, FormGroup, FormText, Input, Label } from 'reactstrap'

export const CreateProjectsEntry = ({ id, name, type, formText, options, min }) => {

    return (
        <FormGroup row>
            <Label for={id} sm={3}>
                {name}
            </Label>
            <Col sm={9}>
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
                <FormText>
                    {formText}
                </FormText>
            </Col>
        </FormGroup>
    )

}
