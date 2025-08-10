# Messenger

## Table of contents

- [Introduction](#introduction)
- [About](#about)
- [Technologies used](#technologies-used)
- [Downloading](#downloading)
- [Prerequisites for assembly and launch](#prerequisites-for-assembly-and-launch)
- [Building](#building)
- [Launch of the project](#launch-of-the-project)
  - [Prerequisites for launch](#prerequisites-for-launch)
  - [Instructions](#instructions)

## Introduction

You can try this application in action by following this [link](https://messenger-client.pages.dev).

## About

A very primitive messenger with very limited functionality. Create chats, send messages, thereby transmitting your thoughts to others, wherever you are.

Implemented functions:

- registration
- login
- search for a user by nickname or email address
- editing by a user of some information related to his account
- creating a chat
- 2 types of chats:
  - personal (for 2 people only)
  - group (for several people)
- adding members to a group chat
- text messages only
- sending messages
- editing messages
- deleting messages
- forwarding messages

This repository is part of the Messenger project. It contains the client application. The source code for the corresponding server application can be found in this [repository](https://github.com/C0o1Pr0g3r/messenger-server).

## Technologies used

The project uses the following technologies:

- [Vue.js](https://vuejs.org/) — framework for creating web user interfaces
- [Vue Router](https://router.vuejs.org/) — routing library for Vue.js
- [Pinia](https://pinia.vuejs.org/) — state management library for Vue.js
- [Axios](https://axios-http.com/) — simple promise-based HTTP client

## Downloading

To download the project, run the following commands:

```sh
git clone https://github.com/C0o1Pr0g3r/messenger-client.git
```

## Prerequisites for assembly and launch

To build and run the project, the following programs must be installed on your computer:

- [Node.js](https://nodejs.org/en/) — JavaScript runtime environment
- [npm](https://docs.npmjs.com/) — program for managing dependencies of [Node.js](https://nodejs.org/en/) projects

Note: the commands to build and run the project must be executed from the project root directory.

Before building or running a project, you must specify the required environment variables.

Create an environment variables file by doing one of the following, depending on your operating system.

On Linux, run the following command:

```sh
cp .env.example .env
```

On another operating system, make a copy of the `.env.example` file named `.env`.

Note: most of the variables in the .env file are already set up to run the project locally.

## Building

To build the project, you need to go to its root directory. To do this, run the following commands:

```sh
npm install
npm run build
```

## Launch of the project

### Prerequisites for launch

Before running a project, you must run the corresponding server application with which this application interacts.

Instructions for running the server application can be found in its [repository](https://github.com/C0o1Pr0g3r/messenger-server).

### Instructions

There are 2 ways to run a project:

- run an already built project
- build and run a project at the same time

To run an already built project, you obviously need to build it first ([see above for how to do this](#building)). After that, run the following commands:

```sh
npm run preview
```

To build and run the project at the same time, run the following commands:

```sh
npm install
npm run dev
```
