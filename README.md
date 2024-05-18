# wiq_es2b

[![Deploy on release](https://github.com/Arquisoft/wiq_es2b/actions/workflows/release.yml/badge.svg)](https://github.com/Arquisoft/wiq_es2b/actions/workflows/release.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Arquisoft_wiq_es2b&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Arquisoft_wiq_es2b)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Arquisoft_wiq_es2b&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Arquisoft_wiq_es2b)

## Welcome to WIQ2024!
WIQ2024 is a web application based on the RTVE game Saber y Ganar developed for the Software Architecture subject (Course 2023-24). This is a base repo for the [Software Architecture course](http://arquisoft.github.io/) in [2023/2024 edition](https://arquisoft.github.io/course2324.html).

> ✨ New URL: http://4.233.221.247:3000/

### Team ES2B

- Member 1 - [Carlos ](https://github.com/baraganio)
- Member 2 - [Coral](https://github.com/coral2742)
- Member 3 - [Pablo](https://github.com/uo264915)
- Member 4 - [Raymond](https://github.com/UO290054)

![Video of WIQ2024](./resources/WIQ%202024%20ES2B.gif)




For the implementation it was decided to implement the following elements in the infrastructure:

- **Quiz Game Application**: In the development environment, the main application will be deployed in different Docker containers on each team member's local server, so that a web application built with React is created. In the case of the production environment, the application would be deployed in the Microsoft Azure cloud and is publicly accessible.

- **Questions API**: This is an API that dynamically generates questions for the WikiData API and also keeps a history of questions that have already been asked.

- **WikiData API**: The application makes calls to the WikiData API to dynamically generate questions for the game, and is accessed in both the development and production environments.

- **MongoDB database**: The database runs inside a Docker container in the development environment to store user data and game information. In the production environment, this database is managed in a Microsoft Azure service.

- **Authentication Service**: The authentication service allows a user to register and log in to the application so that the data associated with their games is always linked and accessible to the user.

- **Data Monitoring Service**: The application data monitoring and analysis service consists of two different services, one with Grafana and the other with Prometheus. Both services work together to analyse and monitor application data so that the information obtained can be recorded in the form of dashboards.

> Both the user and auth service share a Mongo database that is accessed with mongoose.


## Quick start guide

### Using docker

The fastest way for launching this sample project is using docker. Just clone the project:

```sh
git clone https://github.com/Arquisoft/wiq_es2b.git
```

and launch it with docker compose:

```sh
docker compose --profile dev up --build
```

and tear it down:

```sh
docker compose --profile dev down
```

### Starting Component by component

First, start the database. Either install and run Mongo or run it using docker:

```docker run -d -p 27017:27017 --name=my-mongo mongo:latest```

You can also use services like Mongo Altas for running a Mongo database in the cloud.

Now, launch the auth, user and gateway services. Just go to each directory and run `npm install` followed by `npm start`.

Lastly, go to the webapp directory and launch this component with `npm install` followed by `npm start`.

After all the components are launched, the app should be available in localhost in port 3000.

## Deployment

For the deployment, we have several options. 

The first and more flexible is to deploy to a virtual machine using SSH. This will work with any cloud service (or with our own server). 

Other options include using the container services that most cloud services provide. This means, deploying our Docker containers directly. 

We are going to use the first approach, creating a virtual machine in a cloud service and after installing docker and docker-compose, deploy our containers there using GitHub Actions and SSH.

### Machine requirements for deployment

The machine for deployment can be created in services like Microsoft Azure or Amazon AWS. These are in general the settings that it must have:

- Linux machine with Ubuntu > 20.04.
- Docker and docker-compose installed.
- Open ports for the applications installed (in this case, ports 3000 for the webapp and 8000 for the gateway service).

Once you have the virtual machine created, you can install **docker** and **docker-compose** using the following instructions:

```ssh
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
sudo apt update
sudo apt install docker-ce
sudo usermod -aG docker ${USER}
sudo curl -L "https://github.com/docker/compose/releases/download/1.28.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Continuous delivery (GitHub Actions)

Once we have our machine ready, we could deploy by hand the application, taking our docker-compose file and executing it in the remote machine. 

In this repository, this process is done automatically using **GitHub Actions**. The idea is to trigger a series of actions when some condition is met in the repository. 

As you can see, unitary tests of each module and e2e tests are executed before pushing the docker images and deploying them. Using this approach we avoid deploying versions that do not pass the tests.

The deploy action is the following:

```yml
deploy:
    name: Deploy over SSH
    runs-on: ubuntu-latest
    needs: [docker-push-userservice,docker-push-authservice,docker-push-gatewayservice,docker-push-webapp]
    steps:
    - name: Deploy over SSH
      uses: fifsky/ssh-action@master
      with:
        host: ${{ secrets.DEPLOY_HOST }}
        user: ${{ secrets.DEPLOY_USER }}
        key: ${{ secrets.DEPLOY_KEY }}
        command: |

          wget https://raw.githubusercontent.com/arquisoft/wiq_0/master/docker-compose.yml -O docker-compose.yml
          wget https://raw.githubusercontent.com/arquisoft/wiq_0/master/.env -O .env
          docker compose --profile prod down
          docker compose --profile prod up -d --pull always

```

This action uses three secrets that must be configured in the repository:
- DEPLOY_HOST: IP of the remote machine.
- DEPLOY_USER: user with permission to execute the commands in the remote machine.
- DEPLOY_KEY: key to authenticate the user in the remote machine.

Note that this action logs in the remote machine and downloads the docker-compose file from the repository and launches it. 
Obviously, previous actions have been executed which have uploaded the docker images to the GitHub Packages repository.
