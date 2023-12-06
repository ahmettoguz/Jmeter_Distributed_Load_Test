import runTest from './runTest';
import login from './login';
import getFileforSixDepth from './getFileforSixDepth';
import getFileforFiveDepth from './getFileforFiveDepth';
import getFileforFourDepth from './getFileforFourDepth';
import getFileforThreeDepth from './getFileforThreeDepth';
import getFileforTwoDepth from './getFileforTwoDepth';
import showResult from './showResult';

interface Controller {
    runTest: typeof runTest;
    login: typeof login;
    getFileforSixDepth: typeof getFileforSixDepth;
    getFileforFiveDepth: typeof getFileforFiveDepth;
    getFileforFourDepth: typeof getFileforFourDepth;
    getFileforThreeDepth: typeof getFileforThreeDepth;
    getFileforTwoDepth: typeof getFileforTwoDepth;
    showResult: typeof showResult;
}

const controller: Controller = {
    runTest,
    login,
    getFileforSixDepth,
    getFileforFiveDepth,
    getFileforFourDepth,
    getFileforThreeDepth,
    getFileforTwoDepth,
    showResult,
};

export default controller;
