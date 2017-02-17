import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import {Grid, Row, Col, Panel, ListGroup, Checkbox} from 'react-bootstrap';

import { Tasks } from '../api/tasks.js';

import Task from './Task.jsx';

// A checklist contains a list of tasks to check off
export default class Checklist extends Component {
    
  handleSubmit(event) {
    event.preventDefault();
      
      // Find the text field via the React ref
      const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
      
      //TODO use correct checklist id
      Meteor.call('tasks.insert', text, this.props.checklistId);
      
      // Clear form
      ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }
    
  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.props.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => {
        const currentUserId = this.props.currentUser && this.props.currentUser._id;
        const showPrivateButton = task.ownerId === currentUserId;
        const showDeleteButton = showPrivateButton;
        return (
          <Task 
            key={task._id} 
            task={task}
            showPrivateButton = {showPrivateButton}
            showDeleteButton = {showDeleteButton}
          />
        );
    });
  }

  render () {
     
      var incompleteCount = 0;
      if (this.props.tasks.length > 0) {
          incompleteCount = this.props.tasks.reduce(function (sum, task) {
          if (!task.checked) {
              sum++;
          }
          return sum;
        }, 0);
      }
    return (
      
      <Panel collapsible defaultExpanded header={this.props.checklistName + " (" + incompleteCount + ")"}>
        <ListGroup fill>
          { this.props.currentUser ? 
              <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
                <input
                  type="text"
                  ref="textInput"
                  placeholder="Type to add new tasks"
                  />
              </form> : ''
           }
          {this.renderTasks()}
        </ListGroup>
      </Panel>
    );
  }
}

Checklist.propTypes = {
  tasks: PropTypes.array.isRequired,
  hideCompleted: PropTypes.bool.isRequired,
  checklistId: PropTypes.string.isRequired,
  checklistName: PropTypes.string.isRequired,
  currentUser: PropTypes.object,
};

