import Test from './Test';
import Tier from './Tier';
import User from './User';

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
