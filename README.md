# Bookshelf Application
Developed by Taner Maddocks

## Purpose
A web-based application that allows users to add, edit and remove items from a personal book collection, users will also be able to add reviews if they wish.
A user will have their own collection on the app, access via a username and password.
Uses an Express API to access a Mongo database and and allows users to modify and edit data from an Astro-built frontend web application.

## Actions Secrets
As part of the initial setup for the project's CI/CD pipeline, there are a number of repository secrets that need to be declared to make the deployed application functional.
- AWS_ACCESS_KEY_ID: Created as part of AWS IAM services.
- AWS_SECRET_ACCESS_KEY: Created in conjunction with AWS_ACCESS_KEY_ID.
- AWS_REGION: Determines the region in which the registry will exist and from which the server will run.
- ECR_REPO_URI: The address of the registry used to store the pushed images.
- MONGO_DB_URL: The address of the database the backend API will access, hosted by Atlas or a similar service.
- API_URL: This can be identified once the backend service is up and running, as the IP address that the service runs on.
- ECS_CLUSTER_NAME: Determined when creating the ECS cluster on AWS.
- ECS_CLUSTER_SERVICE_NAME: Determined when running the service.

## AWS
This project uses AWS services ECR and ECS to continually deploy the full-stack website to the internet. The workflows test, build and push images to AWS ECR and then updates the running container service with any revisions to the project's frontend and backend images. In order for the workflows to function, the ECR repository and the ECS cluster and services need to be set up and the relevant environment information needs to be passed in the GitHub repository secrets.

## Workflows

### Test
The test.yaml workflow tests the project files using the test files set up in both the frontend and backend components. It uses ubuntu as the operating systme and activates on any push or pull request that target the repository's main branch.
An official mongo image is the only service used in the test job and is used to test the Express API in the backend component.

```yml
name: Run tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  application-test:
    runs-on: ubuntu-latest
    services:
      mongo:
          image: mongo
          ports:
            - 27017:27017

    steps:
      - name: Checkout code
        uses: actions/checkout@v4.2.2
      
      - name: Set up Node
        uses: actions/setup-node@v4.1.0
        with:
          node-version: 'latest'

      - name: Install frontend dependencies
        run: cd frontend/ && npm install

      - name: Run frontend tests
        run: cd frontend/ && npm test
        env: 
          PUBLIC_API_URL: http://localhost:3000

      - name: Install backend dependencies
        run: cd backend/ && npm install

      - name: Run backend tests
        run: cd backend/ && npm test
```

#### Steps:
1. The full project code is checked out using the checkout action from Github Actions
  ```yml
    - name: Checkout code
      uses: actions/checkout@v4.2.2
  ```
2. Node is set up to run the testing through a setup-node action from Github Actions (actions/setup-node@v4.1.0)
  ```yml
    - name: Set up Node
      uses: actions/setup-node@v4.1.0
      with:
        node-version: 'latest'
  ```
3. The next three steps are all run using CLI commands and install dependencies and then run the tests for both the backend and frontend components. For the frontend, an environment variable is declared for the api's url to run testing.
  ```yml
    - name: Run frontend tests
      run: cd frontend/ && npm test
      env: 
        PUBLIC_API_URL: http://localhost:3000

    - name: Install backend dependencies
      run: cd backend/ && npm install

    - name: Run backend tests
      run: cd backend/ && npm test
  ```

### Deploy
Deploy performs three tasks; logins into AWS, builds docker images, and triggers a new deployment of the images. The workflow will only trigger if the test workflow succeeds completely, and so the deploy workflow will trigger on any push or pull request that targets the main branch and passes all tests. Ubuntu is also used as the operating system to run the deploy workflow.

```yml
name: Build and Push Containers to AWS ECR

on:
  workflow_run:
    workflows: ["Run tests"]
    types:
      - completed

jobs:
  build-and-push:
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4.2.2
      
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4.2.1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Log in to ECR
        run: |
          aws ecr get-login-password --region ${{ secrets.AWS_REGION }} | \
          docker login --username AWS --password-stdin ${{ secrets.ECR_REPO_URI }}

      - name: Build backend Docker image
        run: |
          docker build --build-arg DB_URL="${{ secrets.MONGO_DB_URL }}" -t bookshelf-express-api ./backend

      - name: Build frontend Docker image
        run: |
          docker build --build-arg API_URL="${{ secrets.API_URL }}" -t bookshelf-astro-app ./frontend

      - name: Tag both images for ECR
        run: |
          docker tag bookshelf-express-api:latest ${{ secrets.ECR_REPO_URI }}/backend:latest && \
          docker tag bookshelf-astro-app:latest ${{ secrets.ECR_REPO_URI }}/frontend:latest
          
      - name: Push both images to ECR
        run: |
          docker push ${{ secrets.ECR_REPO_URI }}/backend:latest && \
          docker push ${{ secrets.ECR_REPO_URI }}/frontend:latest

      - name: Deploy backend to ECS Fargate
        run: |
          aws ecs update-service \
          --cluster bookshelf-cluster \
          --service bookshelf-backend-service-trx8rr01 \
          --force-new-deployment
          
      - name: Deploy frontend to ECS Fargate
        run: |
          aws ecs update-service \
          --cluster bookshelf-cluster \
          --service bookshelf-frontend-service-8k8zn0vw \
          --force-new-deployment
```

#### Steps:
1. Similar to test workflow, the deploy workflow starts by checking out the project's files using the same action.
2. The workflow then configures AWS credentials using an official action from AWS, loading secrets kept in the action secrets in GitHub by using variables.
  ```yml
    - name: Configure AWS Credentials
      uses: aws-actions/configure-aws-credentials@v4.2.1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ${{ secrets.AWS_REGION }}
  ```
3. 'Log in to ECR' used AWS CLI commands to login to AWS ECR and into docker, again using actions secrets.
  ```yml
    - name: Log in to ECR
      run: |
        aws ecr get-login-password --region ${{ secrets.AWS_REGION }} | \
        docker login --username AWS --password-stdin ${{ secrets.ECR_REPO_URI }}
  ```
4. The next two steps build backend and frontend images respectively, using docker commands and build arguments from actions secrets. After that, the following two steps use docker commands to add tags to the images to help identify them.
  ```yml
    - name: Build backend Docker image
      run: |
        docker build --build-arg DB_URL="${{ secrets.MONGO_DB_URL }}" -t bookshelf-express-api ./backend

    - name: Build frontend Docker image
      run: |
        docker build --build-arg API_URL="${{ secrets.API_URL }}" -t bookshelf-astro-app ./frontend

    - name: Tag both images for ECR
      run: |
        docker tag bookshelf-express-api:latest ${{ secrets.ECR_REPO_URI }}/backend:latest && \
        docker tag bookshelf-astro-app:latest ${{ secrets.ECR_REPO_URI }}/frontend:latest
  ```
5. Both images are then pushed to AWS ECR in the 'Push both images...' step, again using docker commands and the same ECR_REPO_URI secret. If all secrets and set were configure correctly the images will be found in the user's AWS ECR account.
  ```yml
    - name: Push both images to ECR
      run: |
        docker push ${{ secrets.ECR_REPO_URI }}/backend:latest && \
        docker push ${{ secrets.ECR_REPO_URI }}/frontend:latest
  ```
6. As the final step, the workflow will initiate an update to an existing service, determined by GitHub actions secrets, using AWS CLI commands.
  ```yml
    - name: Deploy backend to ECS Fargate
      run: |
        aws ecs update-service \
        --cluster ${{ secrets.ECS_CLUSTER_NAME }} \
        --service ${{ secrets.ECS_CLUSTER_SERVICE_NAME }}  \
        --force-new-deployment

    - name: Deploy frontend to ECS Fargate
      run: |
        aws ecs update-service \
        --cluster ${{ secrets.ECS_CLUSTER_NAME }} \
        --service ${{ secrets.ECS_CLUSTER_SERVICE_NAME }} \
        --force-new-deployment
  ```

Notably, not all environment variables can be acquired until after the workflow has run successfully up to the 'Push both images to ECR' step is complete. In order to remedy this issue in future another workflow that pushes the images with updating the service would need to be created or a workflow that either updates the service or creates it would be needed.