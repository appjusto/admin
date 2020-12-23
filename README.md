# Setup

## 1. Clone repo and install dependecies

```bash
git clone git@github.com:appjusto/admin.git
cd admin && yarn install
```

## 2. Configure enviroment variables

Create a file named `.env.local` filling up these variables:

```bash
echo "REACT_APP_PUBLIC_URL=
REACT_APP_FIREBASE_API_KEY=
REACT_APP_GOOGLE_MAPS_API_KEY=
REACT_APP_FIREBASE_REGION=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_FIREBASE_MEASUREMENT_ID=
REACT_APP_FIREBASE_EMULATOR=
REACT_APP_FIREBASE_EMULATOR_HOST=
REACT_APP_FIREBASE_EMULATOR_PORT=
" > .env.local2
```

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn deploy`

Deploy on firebase.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
