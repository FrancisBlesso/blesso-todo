import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const TaskLists = new Mongo.Collection('checklists');

if (Meteor.isServer)  {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('checklists', function tasksPublication() {
    return TaskLists.find({
//      $or: [
//        { private: { $ne: true } },
//        { owner: this.userId },
//      ],
    });
  });
}
Meteor.methods({
  'checklists.insert'(text) {
    check(text, String);
    
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    
    TaskLists.insert({
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });
  },
  'checklists.remove'(taskId) {
    check(taskId, String);

    const task = TaskLists.findOne(taskId);

    if (task.owner !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }
    
    TaskLists.remove(taskId);
    //TODO remove the tasks also
  },
  'checklists.setPrivate'(taskId, setToPrivate){
    check(taskId, String);
    check(setToPrivate, Boolean);
    
    const task = TaskLists.findOne(taskId);
    
    // Make sure only the task owner can make a task private
    if (task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    
    TaskLists.update(taskId, {$set: { private: setToPrivate}});
  },
});
