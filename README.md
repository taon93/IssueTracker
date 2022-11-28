# IssueTracker

This is simple practice fullstack CRUD project, it was implemented using:
### Frontend:
- JavaScript (Vanilla)
- HTML
- SCSS with Bootstrap 5.0
- Axios HTTP Library
### Backend
- Java with Spirng
- H2 for database

Currently there are implemented following features: 
- Getting all tasks from server during loadup
- Adding new tasks to status columns: **NEW, IN PROGRESS, IN REVIEW, DONE**
- Editing existing tasks
- Logging hours to existing tasks
- Deleting tasks
- Shifting between columns which represents status change
- **All of those operations are preserved on the database**

What will be added in next iterations: 
- Clear all tasks functionality, fix small problems, add validation to the fields, add mandatory fields, differentiate between new tasks and already in progress - new tasks don't need to be assigned to anybody whereas in progress/in review /done must be assigned to the user, when changing state of unassigned task give prompt that task don't have owner. Change drag & drop functionality.
- Logging up
- Securing connection
- Backlog view, terminating sprint based on the date date and starting new sprint
- Sharing project with other users, assigning items only to available users, craeting more than one project, user projects view.

Issue tracker is tool used by teams or single users to track their progress with tasks, this impelementation is right now really simple and rather crude, to add item click add item on the bottom part of the respective column, you can edit/delete/log hours to already created item by clicking ... button. You can change status of the item by dragging and dropping. 
