# Infrastructure Resource Name Generator

## Target Users:
IT Team

## Synopsis:
The IT team when tasked with creating a new infrastructure resource, such as, a VM, S3 bucket, database server instance, etc, needs to provide a unique name for that resource in the client account where the resource is being created. Traditionally, the resouce names are picked from a pre-decided list of names such as:
1. Names of planets and other celestial bodies (E.g. titan)
2. Names of Greek/Roman gods
3. Rivers or other geographical locations (E.g. talpona)

Eventually, we will run out of names since each infra resource created has to be named uniquely across environments. Also, with CCI employees being from different parts of the country/world, pronounciation of local geographical names may not be something that they are familiar with.

## Solution:
This needs to be application. Not a command line tool. It needs to remember the past resource names, hence DB also will be required.

## Optional Features:
1. Names should not refer to any human or real-world entiy/event to avoid any controveries (E.g. hitler)
2. Store the names in a central repository (database) to enable the tool to check if the name had already been generated.
3. Allow to flag a generated name as "inappropriate" so that it does not get generated again.
4. Use 3rd party language analysis tools to check and validate the name to ensure it is not inappropriate.
5. Provide a user interface to perform CRUD operations on the name repository.

## Implementation:
The solution could be implemented in a variety of ways. Some suggestions:
1. Simple method: Hard-code common syllables in the name generation script and randomly generate names.
2. Advanced method: Build a machine learning model that consumes the words from the English dictionary and generates the names based on common patterns in the English language


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
