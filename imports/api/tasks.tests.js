/* esLint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';

import { Tasks } from './tasks.js';

if (Meteor.isServer) {
  describe('Tasks', () => {
    describe('methods', () => {
      Meteor.users.remove({});
      const userId = Meteor.users.insert({username: 'tesstuser'});
      let taskId;
      beforeEach(() => {
        Tasks.remove({});
        taskId = Tasks.insert({
          text: 'test task',
          checklistId: "1",
          createdAt: new Date(),
          ownerId: userId,
          username: 'tesstuser',
        });
      });
      
      it('can delete owned task', () => {
        const deleteTask = Meteor.server.method_handlers['tasks.remove'];
        
        const invocation = { userId };
        
        deleteTask.apply(invocation, [taskId]);
        assert.equal(Tasks.find().count(), 0);
      });
      it('cannot insert task with empty text', () => {
        const insertTask = Meteor.server.method_handlers['tasks.insert'];
        
        const invocation = { userId };
        
        assert.throws(() => {
            insertTask.apply(invocation, ['', "1"]);
        }
        , /Text is required/);
      });
    });
  });
}