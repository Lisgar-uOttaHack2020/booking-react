
import React from 'react';
import { Segment, Header, Form, Button, Input, Icon } from 'semantic-ui-react';
import queryString from 'query-string';
import './css/ParentRegister.css';

class ParentRegister extends React.Component {

  state = {
    bodyMaxHeight: 0,
    childSelectionList: []
  };

  data = {};
  childrenObj = {};  // Stores children as an object (later converted to an array). Useful for deleting/updating children.

  onFormChange = (e, { name, value }) => {

    this.data[name] = value;
  }

  childSelection_add = () => {

    let tempList = this.state.childSelectionList.slice();

    tempList.push(
      <ChildSelection key={Date.now()} index={Date.now()}
        deleteFunc={this.childSelection_delete}
        updateFunc={this.childSelection_update}
      />
    );

    this.setState({ childSelectionList: tempList });
  }

  childSelection_delete = (index) => {

    let tempList = this.state.childSelectionList.slice();

    tempList.forEach((child, i) => {
      if (child.props.index === index) {
        tempList.splice(i, 1);
      }
    });

    this.setState({ childSelectionList: tempList });
    delete this.childrenObj[index];
  }

  childSelection_update = (index, newVal) => {

    this.childrenObj[index] = newVal;
  }

  nextScreen = () => {

    // Generate data.children by converting childrenObj from an object to an array.
    this.data.children = [];
    for (let key in this.childrenObj) {
      if (this.childrenObj.hasOwnProperty(key)) {
        this.data.children.push(this.childrenObj[key]);
      }
    }

    // TODO: Transition into Parent / Book Child.
    console.log(this.data); // Temporary.
  }

  componentDidMount() {

    this.setState({
      bodyMaxHeight:
        'calc(100vh - 218px - ' /* 218px = height of footer + height of padding */
          + document.querySelector('#header-segment').clientHeight + 'px - '
          + document.querySelector('#footer-segment').clientHeight + 'px)'
    });

    // Get code from URL.
    this.data.code = queryString.parse(this.props.location.search).code;
  }

  render() {

    return (
      <div className='view-container'>
        <Segment.Group>
          <Segment id='header-segment'><Header as='h2'>Registration</Header></Segment>
          <Segment style={{maxHeight: this.state.bodyMaxHeight, overflowY: 'auto'}}>
            <Form>
              <Form.Input label="Full name" placeholder='Full name' name='name' onChange={this.onFormChange} />
              <Form.Input label="Email" placeholder='Email' name='email' onChange={this.onFormChange} />
              <Form.Field>
                <label>Children</label>
                <div id='child-selection-list'>
                  {this.state.childSelectionList.map(childSelection => childSelection)}
                </div>
              </Form.Field>
            </Form>
          </Segment>
          <Segment id='footer-segment'>
            <Form>
              <Form.Button icon labelPosition='left' fluid onClick={this.childSelection_add}>
                <Icon name='plus' />Add child
              </Form.Button>
              <Form.Button icon labelPosition='right' fluid primary onClick={this.nextScreen}>
                <Icon name='arrow right' />Next
              </Form.Button>
            </Form>
          </Segment>
        </Segment.Group>
      </div>
    );
  }
}

class ChildSelection extends React.Component {

  onUpdate = (e, { value }) => {

    this.props.updateFunc(this.props.index, value);
  }

  render() {

    return (
      <div className='child-selection-container'>
        <Input placeholder="Child's full name" onChange={this.onUpdate} />
        <Button icon onClick={() => this.props.deleteFunc(this.props.index)}>
          <Icon name='minus' />
        </Button>
      </div>
    );
  }
}

export default ParentRegister;
