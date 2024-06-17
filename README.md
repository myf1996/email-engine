<h1 align="center">Email Core Engine</h1>

## Description

This project is a core system for an email client, designed to connect with user email accounts, initially focusing on Outlook, and efficiently manage email data. The system is built with scalability and performance in mind, ensuring efficient handling of large numbers of user email addresses. It adheres to best practices in software development and is designed for easy extensibility to support other email providers.

## Features
1. User authentication via Microsoft outlook.
2. Store user profile and emails via Elastic Search indexes (user  - email_messages).
3. Sync user emails message in Elastic Search index (email_messages).
4. Basic Client UI Interface for authentication and email messages read.

## Features Explaination
1. For user authentication using this endpoint `/api/outlook/connect` which redirect to Microsoft Login and Callback to `/api/outlook/callback`.
2. User profile stores in `users` index of Elastic Search include `subscriptionId and deltaLink` and user emails messages stores in `email_messages` index of Elastic Search.
3. Sync user emails message done via combinaation of `/api/outlook/webhook` endpoint & `deltaLink` SyncEmail Function, combinationn of these 2 approches will fix the Rate-Limit Issue for fetching user email messages, for login API we can save user callback code in Elastic Search and use later or we can Implement queue to prevent Rate-Limit Issue.
4. UI can be view from `/index` from here user can login and logout both.


## Pre-requisite

```bash
node
npm
docker
```

## Setup
1. Clone the repository.
2. Update Environment variable from docker-compose.yml file
```bash
$ CLIENT_ID=
$ CLIENT_SECRET=
$ SECRET_KEY=
```
3. Run Docker Containerr

```
$ docker-compose up --build
```

Alternatively, you can update the .env or kubernetes.yml files directly with the environment variables according to the production deployment.

## Test
```
$ npm run test
```

## Deployment
This project is intended to be deployed using containerized systems such as ```Amazon ECS, EC2, Kubernetes, or as serverless microservices with AWS Lambda```. This method provides the project's scalability and adaptability, enabling it to handle shifting loads and adapt to changing infrastructure requirements.

### 1. Containerized Deployment
#### 1.1 Amazon ECS/EC2
- Use Docker to containerize the application.
- Deploy the container on Amazon ECS or EC2 instances.
- Provides a robust environment for managing containerized applications.
#### 1.2 Kubernetes
- Deploy the application on a Kubernetes cluster.
- Leverage Kubernetes for efficient container orchestration, scaling, and management.

### 2. Serverless Deployment 
#### 2.1 AWS Lambda
- Utilize AWS Lambda to deploy the application as serverless microservices.
- Enables automatic scaling, reduced operational overhead, and cost efficiency based on actual usage.

Using these deployment options, the project may achieve high availability and effective resource utilisation, making it ideal for production situations and scalable expansion.

## API Documentation

Detailed API documentation can be found at the `/api/swagger` endpoint. This documentation provides comprehensive information on the available API endpoints.

## Project Structure
```
project/
├── src
│   ├── controllers
│   │   ├── elasticsearch
│   │   │   ├──  ping.js
│   │   ├── outlook
│   │   │   ├──  callback.js
│   │   │   ├──  connect.js
│   │   │   ├──  webhook.js
│   │   ├── health.js
│   │   ├── email.js
│   │   ├── logout.js
│   ├── services
│   │   ├── elasticsearch.service.js
│   │   ├── outlook.service.js
│   ├── test
│   │   ├── elasticsearch.test.js
│   │   ├── email.test.js
│   │   ├── health.test.js
│   │   ├── outlook.test.js
│   ├── views
│   │   ├── index.ejs
│   ├── app.js
│   ├── config.js
│   └── local.js
├── Dockerfile
├── docker-compose.yml
├── package.json
├── .env
├── .mocharc
├── .travisci
├── index.js
└── swagger.json
```


## Stay in touch

- Author - [Yassar Farooq](mailto:g.yassarfarooq@gmail.com)
- LinkedIn - [Yassar Farooq](https://linkedin.com/in/yassar-farooq)
- Github - [myf1996](https://github.com/myf1996/)

