import React from 'react'
import { Col, FormGroup, FormText, Input, Label } from 'reactstrap'

export const ProjectDetailsEntry = ({ id, name, defaultValue, type, modifiable = true, formText, options, min }) => {

    return (
        <FormGroup row>
            <Label for={id} sm={3}>
                {name}
            </Label>
            <Col sm={9}>
                <Input type={modifiable ? undefined : type} readOnly={modifiable} id={id} name={id} defaultValue={defaultValue} min={min} >
                    {options && (
                        <>
                            {options.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </>
                    )}
                </Input>
                <FormText>
                    {!modifiable && (formText)}
                </FormText>
            </Col>
        </FormGroup>
    )

}
