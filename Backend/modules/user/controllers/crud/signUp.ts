import HelperService from "../../../../services/HelperService";

const signUp = async (req, res) => {
  return HelperService.returnResponse(res, 200, true, "Sign up.", [
    "a",
    "b",
  ]);
};

export default signUp;
