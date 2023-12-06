import Test from './models/Test';
import Tier from './models/Tier';
import User from './models/User';

interface Models {
    Test: typeof Test;
    Tier: typeof Tier;
    User: typeof User;
}

const models: Models = {
    Test,
    Tier,
    User,
};

export default models;
