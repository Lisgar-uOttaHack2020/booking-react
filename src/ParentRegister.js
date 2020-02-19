
import React from 'react';

import { Segment, Header, Form, Button, Input, Icon } from 'semantic-ui-react';

import './ParentRegister.css';

const fetch = require('node-fetch');

class ParentRegister extends React.Component {

  state = {
    childList: []  // A list of all of the child view objects.
  };

  // Tracks data to be sent for the register request.
  data = {
    'name': null,
    'email': null,
    'tempChildren': {},'children': []
  };

  generateDataChildren = () => {

    // create data.children from data.tempChildren (object to array)
    this.data.children = [];
    for (let key in this.data.tempChildren) {
      if (this.data.tempChildren.hasOwnProperty(key)) {
        this.data.children.push(this.data.tempChildren[key]);
      }
    }
  }

  // Runs when the name or email is changed. Does NOT run when the child views are changed.
  onFormChange = (e, {name, value}) => {

    this.data[name] = value;
  }

  addChild = () => {

    let tempChildList = this.state.childList.slice();
    tempChildList.push(
      <ChildSelection
        key={Date.now()}
        index={Date.now()}
        deleteFunc={this.deleteChild}
        updateValueFunc={this.updateChildValue}
      />
    );

    this.setState({
      childList: tempChildList
    });
  }

  deleteChild = (index) => {

    let tempChildList = this.state.childList.slice();

    tempChildList.forEach((child, i) => {
      if (child.props.index === index) {
        tempChildList.splice(i, 1);
      }
    });

    this.setState({
      childList: tempChildList
    });

    delete this.data.tempChildren['id_' + index];  // Data must be deleted.
    this.generateDataChildren();
  }

  // Runs when the [index] child value changes.
  updateChildValue = (index, newVal) => {

    this.data.tempChildren['id_' + index] = newVal;
    this.generateDataChildren();
  }

  sendData = () => {

    const body = {
      'name': this.data.name,
      'email': this.data.email,
      'children': this.data.children
    };
    let invalidRequest = false;
 
    fetch('/customers', {
      method: 'post',
      body:    JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })
    .then(res => {

      if (res.status !== 200) {
        invalidRequest = true;
      }

      return res.json();
    })
    .then(json => {

      if (!invalidRequest) {
        this.props.changeViewFunc('parentBooking', [
          json.id, this.data.children, 0
        ]);
      }
      else {
        this.props.displayModalMessageFunc(json.error);
      }
    });
    
  }

  render() {

    return (
      <div className='view-container'>
        <Segment.Group>
          <Segment><Header as='h2'>Registration</Header></Segment>
          <Segment>
            <Form>
              <Form.Field>
                <label>Full name</label>
                <Input placeholder='Full name' name='name' onChange={this.onFormChange} />
              </Form.Field>
              <Form.Field>
                <label>Email</label>
                <Input placeholder='Email' name='email' onChange={this.onFormChange} />
              </Form.Field>
              <Form.Field>
                <label>Children</label>
                <div id='child-selection-list'>
                  {
                    this.state.childList.map((child) => {
                      return child;
                    })
                  }
                </div>
              </Form.Field>
              <Form.Field>
                <Button icon labelPosition='left' fluid onClick={this.addChild}>
                  <Icon name='plus' />
                  Add child
                </Button>
              </Form.Field>
            </Form>
          </Segment>
          <Segment>
            <Button icon labelPosition='right' fluid onClick={this.sendData} primary>
              <Icon name='arrow right' />
              Next
            </Button>
          </Segment>
        </Segment.Group>
        <div style={{backgroundColor: '#202020', color: '#ffffff', fontFamily: 'monospace'}} id="res-dump"></div>
      </div>
    );
  }
}

class ChildSelection extends React.Component {

  onUpdate = (e, {name, value}) => {

    this.props.updateValueFunc(this.props.index, value);
  }

  render() {

    return (
      <div className='child-selection' style={{display: 'flex'}}>
        <Input placeholder="Child's full name" onChange={this.onUpdate} />

        <Button icon onClick={() => this.props.deleteFunc(this.props.index)}>
          <Icon name='minus' />
        </Button>
      </div>
    );
  }
}

export default ParentRegister;
