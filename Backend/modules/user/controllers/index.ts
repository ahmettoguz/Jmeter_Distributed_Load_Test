import runTest from './runTest';

interface Controller {
    runTest: typeof runTest;
}

const controller: Controller = {
    runTest,
};

export default controller;
