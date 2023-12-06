import path from 'path';
import Helper from '../../../services/HelperService';

const HelperService = new Helper();

const getFileforTwoDepth = async (req, res) => {
    const id = req.params.id;
    const id1 = req.params.id1;
    const fileId = req.params.fileId;

    const filePath = path.join(__dirname, `../../userfile/result/${id}/report/${id1}/${fileId}`);

    HelperService.setHeaderForExtension(res, fileId);

    res.sendFile(filePath);
};

export default getFileforTwoDepth;
