# Image Processing API

A simple API endpoint that resizes uploaded images per query parameters.

## Installation

Use the node package manager [npm](https://www.npmjs.com/) to install requirements.

## Environment
Initializing npm and installing dependencies
```bash
npm init -y
npm i --save-dev typescript ts-node nodemon jasmine jasmine-spec-reporter supertest
npm i --save-dev @types/node @types/express @types/sharp @types/jasmine @types/supertest
npm i --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier @typescript-eslint/parser
npm i express sharp

```
additionally, this package.json can be used to setup the environment, ```npm install```
```json
{
  "devDependencies": {
    "@types/express": "^4.17.13",
    "@types/jasmine": "^3.10.3",
    "@types/node": "^17.0.21",
    "@types/sharp": "^0.29.5",
    "@types/supertest": "^2.0.11",
    "@typescript-eslint/parser": "^5.12.1",
    "eslint": "^8.9.0",
    "eslint-config-prettier": "^8.4.0",
    "eslint-plugin-prettier": "^4.0.0",
    "jasmine": "^4.0.2",
    "jasmine-spec-reporter": "^7.0.0",
    "nodemon": "^2.0.15",
    "prettier": "^2.5.1",
    "supertest": "^6.2.2",
    "ts-node": "^10.5.0",
    "typescript": "^4.5.5"
  },
  "dependencies": {
    "express": "^4.17.3",
    "sharp": "^0.30.1"
  }
}
```
Initializing tsc, generating a tsconfig.json file
```bash
npx tsc --init
```
The directory structure should be as it is in the project folder (workspace)

## Usage
Available scripts are defined in package.json
```json
{
  "scripts": {
    "lint": "eslint ./src/**/*.ts --fix",
    "prettier": "prettier --config .prettierrc \"src/**/*.ts\" --write",
    "build": "npx tsc",
    "dev": "nodemon --exec npx ts-node \"./src/index.ts\"",
    "start": "node ./dist/.",
    "jaz": "jasmine",
    "test": "npm run build && npm run jaz"
  },
}
```
to run server using nodemon
```bash
npm run start
```
to run server using node
```bash
node ./dist/.
```
The API has one endpoint ```/api/images```,
accepts http [GET] requests and expects three query parameters to be present in the URL: ```?filename=imgname.extension&width=300&height=300```

Assuming the server-name is "localhost"
an example on the endpoint URL would be: ```http://localhost:3000/api/images?filename=testimage.jpg&width=520&height=520```
## Validation
The API will apply a number of validation rules before serving a request,  
1. The image must be (uploaded) on the server at ```./images``` and with a valid extension and name, otherwise the server may respond with 404 not found or 400 invalid file name.  
Note: The API is using the [sharp](https://www.npmjs.com/package/sharp) module to resize and process images.  
2. Both parameters width and height must be as positive numbers  

3. All three parameters must be present in the URL.

## References
1. [https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client](https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client)
Excellent question/answers that explains the issue where the next() might cause ```Error: Can't render headers after they are sent to the client.```

2. [https://sharp.pixelplumbing.com/api-constructor](https://sharp.pixelplumbing.com/api-constructor)  
npm sharp documentation.


## My Gratitude & Special Thanks
I wanted to take a moment to thank the amazing Udacity team and to thank the engineers who spare the time to view our work.
I sincerely apologize to you guys for submitting this late, I have tried to work hard on it from scratch, I wish you guys view my work and can't wait to learn from your advice.

Thank you  
Mostafa M.
