# Getting started

First, you need to run this command :

```sh
npm run setup
```

Copy each **".env.sample"** file and Paste it has **".env"** file.

You must fill every environment variables with the corresponding data.

### To launch the project, use this command in your terminal :

```sh
docker-compose up --build
```

You need to use ```--build ``` only if you add a new package or if you modify a file outside **"src"** directory (*ex :
add a theme in **"tailwind.config"** file or add an environment variable in **".env"** file*).

### else, you just have to run

```sh
docker-compose up
```

Client run on http://localhost:3000/

Apollo Sandbox run on http://localhost:4000/

## Mobile app

You need to install Expo Go on your phone and scan the QR code displayed in your terminal when you launch this command :

```sh
npm run start:mobile
```

App will refresh automatically when you save a file.

## Run tests

```sh
npm run test:docker
```

## Save local database

If you want to save your database from docker volume to your desktop, you can use this command :

```sh
npm save:docker-db
```
It will create a **"waitit-development_db.tar"** archive on your Desktop.

## Import database

If you want to import an archived database in yours, you need to run this command :

### ⚠️ Important : The archive must be on your Desktop. ⚠️
```sh
npm run import:docker-db
```

## ESlint config

If you use VScode, install the ESlint extension which will allow you to choose it as the default code formatter.

If you use WebStorm, in config window, search **"Action on Save"** option and check **"Run eslint --fix"**.

## Husky pre-commit checking

When you commit your work, a code fix is started automatically. It will correct your code according to the
rules of ESlint. If one of the code errors cannot be corrected by the fixer, you will have to go back to your
code and correct it yourself. An interface with the concerned errors will be displayed in your terminal so that you can
locate them more easily.

Once the correction is done, relaunch your commit.

## Default admin 
On app start the function checkDefaultAdmin checks in the database if it exist. If it doesn't it create one with random password. 
To login the first time you have to use the forgottenPassword function. 

## Create an admin 
To create an admin user you have to go to localhost:4000
Use the login mutation as an admin, copy the token that is returned
Use the createUser mutation, complete the variables and in the Headers section add a new Header : 
Header key = Authorization
value = Bearer + " " + token
Now you can create your admin 