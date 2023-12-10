import runTest from './runTest';
import login from './crud/login';
import signUp from './crud/signUp';
import getFileforSixDepth from './result/getFileforSixDepth';
import getFileforFiveDepth from './result/getFileforFiveDepth';
import getFileforFourDepth from './result/getFileforFourDepth';
import getFileforThreeDepth from './result/getFileforThreeDepth';
import getFileforTwoDepth from './result/getFileforTwoDepth';
import showResult from './result/showResult';

interface Route {
    signUp: typeof signUp;
    login: typeof login;
    runTest: typeof runTest;
    getFileforSixDepth: typeof getFileforSixDepth;
    getFileforFiveDepth: typeof getFileforFiveDepth;
    getFileforFourDepth: typeof getFileforFourDepth;
    getFileforThreeDepth: typeof getFileforThreeDepth;
    getFileforTwoDepth: typeof getFileforTwoDepth;
    showResult: typeof showResult;
}

const route: Route = {
    signUp,
    login,
    runTest,
    getFileforSixDepth,
    getFileforFiveDepth,
    getFileforFourDepth,
    getFileforThreeDepth,
    getFileforTwoDepth,
    showResult,
};

export default route;
