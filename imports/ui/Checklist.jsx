import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import {Grid, Row, Col, Panel, ListGroup, Checkbox, Badge} from 'react-bootstrap';

import { Tasks } from '../api/tasks.js';

import Task from './Task.jsx';

// A checklist contains a list of tasks to check off
export default class Checklist extends Component {
    
  handleSubmit(event) {
    event.preventDefault();
      
      // Find the text field via the React ref
      const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
      
      Meteor.call('tasks.insert', text, this.props.checklist._id);
      
      // Clear form
      ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }
  
  renderTasks() {
    return this.props.checklist.tasks.map((task) => {
        if (this.props.hideCompleted && task.checked) {
            return null;
        }
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
    const incompleteCount = this.props.checklist.tasks.fetch().reduce(function (sum, task) {
      if (!task.checked) {
        sum++;
      }
      return sum;
    }, 0);
    const header = (<span>{this.props.checklist.name + " "}<Badge>{incompleteCount}</Badge></span>);
    return (
      
      <Panel collapsible defaultExpanded header={header}>
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
  checklist: PropTypes.object.isRequired,
  hideCompleted: PropTypes.bool.isRequired,
  currentUser: PropTypes.object,
};

