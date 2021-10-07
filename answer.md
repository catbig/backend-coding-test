# Detail Answer

## Prerequisite
1. Create a new repository in your own github profile named `backend-coding-test`  
https://github.com/catbig/backend-coding-test

2. Rename `main` branch to `master`
3. Initial commit the contents of this folder
4. Install `node (>8.6 and <= 10)` and `npm`  
You can download the installer from below link:  
https://nodejs.org/download/release/v10.24.1/

5. Install the package  
Run `npm install`

6. Testing the server  
Run `npm test`  
sample output:
```
$ npm test
> backend-coding-test@1.0.0 test ~\backend-coding-test
> mocha tests
  API tests
    GET /health
      √ should return health
  1 passing (42ms)
```

7. Run the server  
Run `npm start`

## Task

### 1. Documentation

We will use apidoc to build API documentation in web format.  
https://www.npmjs.com/package/apidoc

1. Install apidoc package  
Run `npm install -g apidoc --save-dev`

2. Configure the apidoc in `package.json`  
Add configuration under the `"apidoc": { }` parameter.
```
  "apidoc": {
    "name": "Backend Test Documentation",
    "description": "Backend Test Documentation",
    "title": "Backend Test Documentation"
  }
```

3. Add block of API doc in `src/app.js`  
How to: https://apidocjs.com

4. Generate API doc in web format  
Run bellow command everytime you have update the block of API doc in your code file  
`apidoc -i src/ -o src/ --single`

5. Publish api doc as `/developer`  
Add below code in `src/app.js`  
```
    app.get('/developer', (req, res) => {
		res.sendFile(__dirname+'/index.html');
	});
```

6. Restart the server

### 2. Implement Tooling

Connect `eslint` and `nyc` with `npm test`

#### a. Linting

1. Install `eslint`  
Run `npm i -g eslint --save-dev`

2. Setup a configuration file  
Run `./node_modules/.bin/eslint --init`  
sample output:  
```
√ How would you like to use ESLint? · problems
√ What type of modules does your project use? · commonjs
√ Which framework does your project use? · none
√ Does your project use TypeScript? · No / Yes
√ Where does your code run? · browser, node
√ What format do you want your config file to be in? · JSON
```  
&ensp;You can modify the configuration file directly also.  
&ensp;refer [.eslintrc.json](.eslintrc.json)

3. Install `mocha` plugin  
Run `npm install prettier eslint-plugin-mocha --save-dev`

3. Install `prettier` plugin  
Run `npm install prettier eslint-plugin-prettier --save-dev`

4. Extend eslint with plugin  
Add below code in `.eslintrc.json`  
```
    "extends": [
        "eslint:recommended",
		"plugin:prettier/recommended",
		"plugin:mocha/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "plugins": [
        "@typescript-eslint",
		"mocha",
		"prettier"
    ],
    "rules": {
		"semi": ["error", "always"],
		"prettier/prettier": "error",
		"@typescript-eslint/no-var-requires": 0,
		"@typescript-eslint/no-unused-vars": 0
    }
```  
&ensp;refer [.eslintrc.json](.eslintrc.json)

5. Configure the prettier  
Create file `.prettierrc.json`  
sample configuration:  
```
{
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "none",
  "bracketSpacing": true,
  "arrowParens": "always"
}
```  
&ensp;refer [.prettierrc.json](.prettierrc.json)

6. Linting code manually  
Run `eslint **/**js`

7. Connect eslint to `npm test` as `pretest`  
Add below code in `package.json`  
```
  "scripts": {
	"pretest": "eslint **/**js"
  },
```  
&ensp;refer [package.json](package.json)

8. Linter fixing  
Run `eslint **/**js  --fix`  
> 341 problems (341 errors, 0 warnings) has been fixed

9. Rerun test  
Run `npm test`

#### b. Code Coverage

1. Install `nyc`  
Run `npm i -D nyc`

2. Configure `nyc`  
Add `nyc` in `test` script inside `package.json` file.  
```
  "scripts": {
    "test": "nyc mocha tests"
  },
```

3. Rerun test  
Run `npm test`

4. Initial coverage
```
------------|---------|----------|---------|---------|---------------------------
File        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------|---------|----------|---------|---------|---------------------------
All files   |   23.18 |        0 |   27.27 |   22.05 |
 app.js     |   18.46 |        0 |      20 |   17.18 | 14,53-150,172-190,211-232
 schemas.js |     100 |      100 |     100 |     100 |
------------|---------|----------|---------|---------|---------------------------
```

5. Create new testing script  
refer [api.test.js](tests/api.test.js)

6. Latest coverage
```
------------|---------|----------|---------|---------|-------------------------
File        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------|---------|----------|---------|---------|-------------------------
All files   |   90.47 |    83.33 |     100 |   90.32 |
 app.js     |   89.09 |    83.33 |     100 |   88.88 | 131,145,177,185,219,227
 logger.js  |     100 |      100 |     100 |     100 |
 schemas.js |     100 |      100 |     100 |     100 |
------------|---------|----------|---------|---------|-------------------------
```

#### c. Pre-push Test
It will ensure that your npm test (or other specified scripts) passes before you can push your changes.  
But don't worry, you can still force a push by telling `git` to skip the `pre-push` hooks by simply pushting using `--no-verify`.

1. Install `pre-push`  
Run `npm install --save-dev pre-push`

2. Configure `pre-push`  
Add a `pre-push` array to your `package.json` that specifies which `scripts` you want to have ran.  
```
  "pre-push": [
    "test"
  ],
```

#### d. Logging
1. Install `winston` as logger  
Run `npm install winston`

2. Create file `log.js` as logger  
Define the logger as global variable so can be use everywhere  
refer [log.js](src/log.js)

3. Implement logging in `app.js`

### 3. Implement Pagination
1. Modify the `/rides` method to support pagination  
Modify the API `/rides` to `/rides/:page/:pageSize`  
refer [app.js](src/app.js)

2. Add initial data in test script  
refer [api.test.js](tests/api.test.js)

3. Modify test script for post `/rides`  
refer [api.test.js](tests/api.test.js)

