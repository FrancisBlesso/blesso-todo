import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import {Grid, Row, Checkbox, Badge} from 'react-bootstrap';

import { Tasks } from '../api/tasks.js';
import { Checklists } from '../api/checklists.js';

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
    
  handleSubmit(event) {
    event.preventDefault();
      
      // Find the text field via the React ref
      const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
      
      Meteor.call('checklists.insert', text);
      
      // Clear form
      ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }
  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  
  renderChecklists() {
   return  this.props.checklists.map((checklist) => {
        return (
          <Row>
                <Checklist 
                  checklist={checklist}
                  hideCompleted={this.state.hideCompleted}
                  currentUser = {this.props.currentUser}
                />
          </Row>
        );
    });
  }

  render () {
    return (
      <div>  
        <header>
    	  <h1>Todo List <Badge>{this.props.incompleteCount}</Badge></h1>
            <label className="hide-completed" >
    	      <Checkbox inline={true}
                checked={this.state.hideCompleted}
                onClick={this.toggleHideCompleted.bind(this)}
              />
              Hide Completed Tasks
            </label>
            <AccountsUIWrapper />
              { this.props.currentUser ? 
                      <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
                        <input
                          type="text"
                          ref="textInput"
                          placeholder="New Checklist"
                          />
                      </form> : ''
              }
        </header>
        <Grid fluid="true">	    
          {
            this.renderChecklists()
          }
        </Grid>
      </div>
    );
  }
}

App.propTypes = {
  checklists: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('checklists');
  Meteor.subscribe('tasks');
  return {
    checklists: Checklists.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, App);
