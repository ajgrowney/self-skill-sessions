import React, {Component} from 'react'
import { Form, Label, Input, Button, FormGroup, Col, Card, CardHeader,CardBody } from 'reactstrap'
import fire from './fire'
let handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target.email.value);
    const promise = fire.auth().signInWithEmailAndPassword(e.target.email.value,e.target.password.value);

}
class SignIn extends Component{
    render(){
        return(
            <Card body inverse color="primary" className="main-card">
                <CardHeader tag="h3">SELF Skill Sessions</CardHeader>
                <CardBody className="sign-in-body">
                <Form className="sign-in-form" onSubmit={handleSubmit}>
                    <FormGroup row>
                        <Label for="exampleEmail" sm={2}>Email</Label>
                        <Col >
                            <Input type="email" name="email" id="exampleEmail" placeholder="KU Email" />
                        </Col>
                        </FormGroup>
                    <FormGroup row>
                        <Label for="examplePassword" sm={2}>Password</Label>
                        <Col>
                            <Input type="password" name="password" id="examplePassword" placeholder="Password" />
                        </Col>
                    </FormGroup>
                    <Button>Login</Button>
                </Form>
                </CardBody>
            </Card>
        )
    }
}

export default SignIn;