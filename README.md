# Adventure App

Adventure managing app for tabletop RPG.

## Services Overview

<img alt="Services Overview" src="https://i.imgur.com/Juc2H2H.png"/>

## Service Description

Adventure-users microservice is responsible for authentication, authorization and user management.
It uses JWT token for authentication.

## Installation

Prepare `.env` file, include
variables: `general_port`, `db_user`, `db_password`, `db_host`, `db_db` (
name), `db_port`, `db_secret`, `jwt_expirationTime` (in
seconds), `jwt_verificationToken`, `jwt_verifitationExpirationTime` (in seconds), `jwt_emailConfirmationUrl` (url where
frontend will get verification token from query param), `email_user`, `email_password`, `email_host`

``npm install``

``npm run proto:install``

``npm run proto:auth``

``npm run start:dev``

## Future Features

- Authorization - user role, admin role
- User management - for admin
- Open API - add open api


