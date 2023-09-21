# Infrastructure Resource Name Generator

## Target Users

- IT Team

## Synopsis

When the IT team is tasked with creating new infrastructure resources, such as VMs, S3 buckets, database 
server instances, etc., they often need to provide unique names for these resources within the client's 
account. Traditionally, resource names are chosen from predefined lists, such as the names of planets, 
Greek/Roman gods, rivers, or other geographical locations. However, this approach has limitations as it 
can lead to name exhaustion and may not always be culturally appropriate.

To address this challenge, the Infrastructure Resource Name Generator provides a solution that allows for 
the dynamic generation of unique and culturally-neutral resource names. It eliminates the need for predefined 
lists and incorporates features to ensure that generated names are both unique and suitable for use in 
diverse environments.

## Solution

The Infrastructure Resource Name Generator is an application, not a command-line tool, designed to remember past 
resource names by leveraging a database. Its main features include:

1. **Dynamic Name Generation**: The application generates resource names on-the-fly, eliminating the need for 
predefined lists.

2. **Uniqueness Check**: The tool checks the central repository (database) to ensure that the generated name has 
not been used before, preventing naming conflicts.

3. **Language Analysis**: The application uses third-party language analysis tools to validate generated names, 
ensuring they are not inappropriate or offensive.

4. **Email Scheduling**: The Infrastructure Resource Name Generator also offers a powerful email scheduling 
feature. Users can schedule automated emails on a weekly, monthly, quarterly, or yearly basis, depending on their 
preferences. These emails provide important updates and summaries of resources stored in the database, enhancing 
communication within the IT team.

5. **JWT Authentication**: To enhance security and restrict access to authorized users, the application incorporates 
JWT (JSON Web Token) authentication. This ensures that only authenticated users can access and interact with the 
application's features, safeguarding sensitive data and resources.

6. **User Interface**: It provides a user-friendly interface for performing CRUD (Create, Read, Update, Delete) 
operations on the name repository, making it easy to manage generated names, email schedules, and user access 
through JWT authentication.

## Implementation

The Infrastructure Resource Name Generator can be implemented in various ways. Some suggestions include:

1. **Simple Method**: Implement a script that uses common syllables to randomly generate names.

2. **Advanced Method**: Develop a machine learning model that generates names based on patterns in the English 
language, using an English dictionary as input.

## Technologies Used

- Frontend: React
- Backend: Node.js with Express
- Database: MongoDB

## Getting Started

### To run the application locally, follow these steps:

1. Clone the repository to your local machine.

2. Navigate to the project directory using the terminal.

3. Set up the backend and frontend development environment for the application.

### To set up the backend development environment, follow these steps:

1. Open a terminal window and navigate to the project directory then run the command:

    ```bash
    cd node-backend
    ```

2. Install the required dependencies for the backend by running:

    ```bash
    npm install
    ```
      
3. Make sure to set up the necessary environment variables in a .env file for the backend. The required environment 
variables are:

- `ACCESS_TOKEN_SECRET` (used for the access token)
- `REFRESH_TOKEN_SECRET` (used for the refresh token)
- `DATABASE_URL` (used to connect to the MongoDB server)
- `EMAIL_USER` (email address for sending scheduled emails)
- `EMAIL_PASSWORD` (app password for the email account to allow access)

4. Start the backend server in development mode with:

    ```bash
    npm run dev
    ```

### To set up the frontend development environment, follow these steps:

1. Open a new terminal window and navigate to the project directory then run the command:

    ```bash
    cd reactapp_frontend
    ```

2. Install the required dependencies for the frontend by running:

    ```bash
    npm install
    ```

3. Start the frontend application in development mode:

    ```bash
    npm start
    ```

4. Open `http://localhost:3000` in your web browser to access the application.

### Available Scripts

In the project directory, you can use the following npm scripts:

- `npm start`: Runs the frontend application in development mode.
- `npm test`: Launches the test runner in interactive watch mode for the frontend.
- `npm run build`: Builds the frontend application for production to the build folder.

### Deployment

To deploy the frontend application, refer to the [Create React App documentation](https://facebook.github.io/create-react-app/docs/deployment) 
for detailed instructions.

### Learn More

For more information on React and its features, check out the [React documentation](https://reactjs.org/docs).

For advanced configurations, code splitting, bundle size analysis, and other topics, refer to the appropriate 
sections in the [Create React App documentation](https://facebook.github.io/create-react-app/docs).

### Troubleshooting

If you encounter issues with building the frontend application, refer to the troubleshooting section in the 
[Create React App documentation](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify).