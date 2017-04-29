# 1. Initialize and run ngBlood

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.1.

## Development server: front end only

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build the ngBlood

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build. Then index file will ve also located there

## Run the ngBlood: front and back
An express api is biult here, then to run the app just type this in the root folder: `node server.js`
Now access it via http://localhost:3000

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

# 2. Done:
- Save share in mongoDB
- Show share to patiens
- Create, List and Get blood share point
- Display contact detail via an event: to preven robot to got them
- Material design
- 

# 3. Not Yet done
- Push data via socket.io, but there it was an express api

## Notify all user when a new blood is shared or updated
Using socket.io to emit to type of event bloodUpdated and bloodSaved to display notification in the front
when we create or edit a share


# 4. Feeback to improve
Logging users with two types of accounts: patients and donors

