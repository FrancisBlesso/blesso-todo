import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import {Grid, Row, Checkbox} from 'react-bootstrap';

import { Tasks } from '../api/tasks.js';

import Checklist from './Checklist.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
    };
  }
  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  render () {
    return (
      <div>  
        <header>
    	  <h1>Todo List ({this.props.incompleteCount})</h1>
            <label className="hide-completed" >
    	      <Checkbox inline="true"
                checked={this.state.hideCompleted}
                onClick={this.toggleHideCompleted.bind(this)}
              />
              Hide Completed Tasks
            </label>
            <AccountsUIWrapper />
        </header>
        <Grid fluid="true">	    
          <Row>
            <Checklist 
              tasks={this.props.tasks}
              hideCompleted={this.state.hideCompleted}
              checklistName="groceries"
              checklistId="1"
              currentUser = {this.props.currentUser}
            />
          </Row>
        </Grid>
      </div>
    );
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('tasks');
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, App);
