# Sample WoW Signature Generator - Node.js

This application serves as an example node.js application for consuming OAuth APIs exposed for [World of Warcraft](https://develop.battle.net/documentation/world-of-warcraft). The app leverages the Client Credentials flow to retrieve an OAuth token and then generate a PNG image for a given character.

## Example Output

http://localhost:3000/signature?region=us&realmName=tichondrius&characterName=tmpikaboo

![Image of example generated image](./example-signature.png)

## API Usage

In accordance with the [World of Warcraft Community API Migration](https://develop.battle.net/documentation/world-of-warcraft/community-api-migration-status) this application leverages only the WoW Game Data APIs.

## Getting Started

To get started experimenting with this application, you will first need to follow the [getting started guide](https://develop.battle.net/documentation/guides/getting-started) to create a new OAuth client on develop.battle.net.

## Configuration

Once you have created your OAuth client on develop.battle.net, copy the `.env.example` file to `.env`, and fill in the values for the `CLIENT_ID` and `CLIENT_SECRET` variables. The values from the `.env` file will be loaded by the [dotenv](https://www.npmjs.com/package/dotenv) library at startup.

## ImageMagick

This application leverages [ImageMagic](https://imagemagick.org/) abstracted through the [gm](https://www.npmjs.com/package/gm) node module to manipulate and produce the image output files.

Depending on which platform you are developing on, you may be required to install ImageMagic on your system before you can successfully run and invoke the application.

## Docker Support

To simplify the ImageMagick dependency described above, this application is also set up to run in a docker container with an existing [docker-compose](https://docs.docker.com/compose/) file already written for convenience.

You can run the application easily by invoking the `docker-compose -f docker-compose.yml up` command in a command-line shell, granted that you already have [Docker](https://www.docker.com/products/docker-desktop) installed on your system.

## Development

Should you wish to experiment with this code and make changes, the application is setup to work with [nodemon](https://www.npmjs.com/package/nodemon) to watch the filesystem and restart anytime a `.js` file is changed. This functionality is enabled by default when running with the above docker-compose command.

## Deploy to Heroku

Additionally, this application is compatible with deploying on a free Heroku Account.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
