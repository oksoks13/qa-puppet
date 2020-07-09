# qa-puppet

## Steps to run

- git clone
- git checkout test-my-app
- npm i
- npm run test
- npm run test:watch

## Links

https://vagusx.github.io/you-dont-need-selenium/

TEST PLAN

1. Testing search buttons on the tab Active

- click on Active
- click on search button
- click on search field
- in the search field enter the name of one of the tasks
- wait some time
- expect to see task which we type in the list

2. Testing plus button on tab All

- click on All
- click plus button
- excpect to see that the input field disappear

3. Testing when I click to some Task on the tab All it became no active

- click on tab All
- click on some Item from the list
- wait some time
- expected to see that Task became non active

4. Testing that after click on some task from the tab All,he displayed on the Completed tab

- click on tab All
- click to some Task
- wait
- click to tab Complete
- expected to see there selected task

5. Testing that when I select some Task from tab All in tab Active displayed only active tasks (all except the selected task)

- click on tab Active
- click on some task
- wait
- click on tab Active
- wait
- expected to see all tasks excep the selected task from tab All

6. Testing that after I click on non active task on the tab All he bacame active and I can't see it on the tab Complete.

- click on tab All
- click on non active task
- wait
- expected that task became in Active status
- click on tab Complete
- expected that task doesn't displayed on the tab Complete
