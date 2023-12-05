import runTest from './runTest';
import login from './login';

interface Controller {
    runTest: typeof runTest;
    login: typeof login;
}

const controller: Controller = {
    runTest,
    login,
};

export default controller;
