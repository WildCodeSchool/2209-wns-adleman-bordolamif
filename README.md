# Getting started

Copy each **".env.sample"** file and Paste it has **".env"** file.

Filled every environment variables with the corresponding data.

### To launch the project, use this command in your terminal :

```sh
docker compose up --build
```

You need to use ```--build ``` only if you add a new package or if you modify a file outside **"src"** directory (*ex :
add a theme in **"tailwind.config"** file or add an environment variable in **".env"** file*).

### else, you just have to run

```sh
docker compose up
```

Client run on http://localhost:3000/

Apollo Sandbox run on http://localhost:4000/


## ESlint config
First, you need to run at the root of the project: 
```sh
npm run setup
```

If you use VScode, install the ESlint extension which will allow you to choose it as the default code formatter.

If you use WebStorm, in config window, search **"Action on Save"** option and select **"Run eslint --fix"**.
