import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import {Button, Col, ListGroupItem, Checkbox} from 'react-bootstrap';

// Task component - represents a single todo item
export default class Task extends Component {
  toggleChecked() {
    // Set the checked property to the opposite of its current value
      Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
  }
  
  deleteThisTask() {
    Meteor.call('tasks.remove', this.props.task._id);
  }
  
  togglePrivate() {
      Meteor.call('tasks.setPrivate', this.props.task._id, !this.props.task.private);
  }
  
  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    const taskClassName = classnames({
        checked: this.props.task.checked,
        private: this.props.task.private,
    });
    const disabled = this.props.task.checked ? 'disabled' : '';
    return (
    <div className={taskClassName}>
      <ListGroupItem disabled={this.props.task.checked} >
        <Checkbox inline={true}
          checked={this.props.task.checked}
          onClick={this.toggleChecked.bind(this)}
        />
        &nbsp;
        { this.props.showPrivateButton ? (
            <Button bsStyle="primary" bsSize="small" onClick={this.togglePrivate.bind(this)}>
              { this.props.task.private ? 'Private' : 'Public'}
            </Button>
        ) : '' }

        &nbsp; 
        <span className="text">
          <strong>{this.props.task.username}</strong>: {this.props.task.text}
        </span>
        &nbsp;
        { this.props.showDeleteButton ? (
            <Button  bsStyle="danger" bsSize="xsmall" className="delete" onClick={this.deleteThisTask.bind(this)}>
                &times;
            </Button>
        ) : '' }
      </ListGroupItem>
    </div>
    );
  }
}

Task.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  task: PropTypes.object.isRequired,
  showPrivateButton: React.PropTypes.bool.isRequired,
  showDeleteButton: React.PropTypes.bool.isRequired,
};
