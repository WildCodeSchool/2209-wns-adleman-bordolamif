# Getting started
First, you need to run this command :
```sh
npm run setup
```

Copy each **".env.sample"** file and Paste it has **".env"** file.

You must fill every environment variables with the corresponding data.

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

If you use VScode, install the ESlint extension which will allow you to choose it as the default code formatter.

If you use WebStorm, in config window, search **"Action on Save"** option and check **"Run eslint --fix"**.

## Husky pre-commit checking

When you commit your work, a code fix is started automatically. It will correct your code according to the 
rules of ESlint. If one of the code errors cannot be corrected by the fixer, you will have to go back to your
code and correct it yourself. An interface with the concerned errors will be displayed in your terminal so that you can 
locate them more easily.

Once the correction is done, relaunch your commit.
