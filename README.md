[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=18186863)
# Starter Project

![GameLog Logo](./app/assets/svg/gamelog-logo.svg)

## Setup 🚀

1. When you first open this project, click 'Install' on the alert that appears:

    ![Install applications](/app/assets/webp/install-extensions.webp)

2. Ensure you have [NodeJs](https://nodejs.org/en) downloaded and installed on your machine
3. Open a terminal in VS Code by selecting `Terminal > New Terminal` from the menu
4. Type the command below into your terminal:

    ```bash
    npm i
    ```

    Hit `Return` on your keyboard to run it.
    
    This will download all of the [Node Packages](https://nodejs.org/en/learn/getting-started/an-introduction-to-the-npm-package-manager) you need to run the Remix starter project on your machine.

    It takes a while, so be patient! 😴

## Database setup

1. Find the file in your project called `.env.example`.
2. Right-click this file and select 'Copy', then 'Paste' it straight away to create a duplicate file.
3. Right-click the duplicate file and select 'Rename'. Call this new file `.env`

<img src="./app/assets/webp/create-env-file.webp" alt="Create env file" style="max-width: 30rem;" />

5. Next, run the following command in your terminal:

    ```bash
    npm run setup
    ```

    This will create the database for your project. Again, it takes a while so be patient.

## Starting your server

 - Run the following command in your terminal:

    ```bash
    npm run dev
    ```
    
    This starts your app in development mode, rebuilding assets and refreshing your browser page on file changes.

    If everything has worked, you should seen the screen below in your default browser:

    <img src="./app/assets/webp/gamelog-start.webp" style="max-width: 30rem; border-radius: 1rem">

## Fly setup and Deployment

### 1. Fly Setup

1. [Install `flyctl`](https://fly.io/docs/getting-started/installing-flyctl/)

2. Sign up and log in to Fly

```sh
flyctl auth signup
```

3. Setup Fly. It might ask if you want to deploy, say no since you haven't built the app yet.

```sh
flyctl launch
```

### 2. Deployment

If you've followed the setup instructions already, all you need to do is run this:

```sh
npm run deploy
```

You can run `flyctl info` to get the url and ip address of your server.

Check out the [fly docs](https://fly.io/docs/getting-started/node/) for more information.

## Help and support

- [Remix Docs](https://remix.run/docs)
