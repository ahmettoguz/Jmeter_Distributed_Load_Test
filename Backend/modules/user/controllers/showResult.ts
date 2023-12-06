import path from 'path';
import HelperService from '../../../services/HelperService';

const getFile = async (req, res) => {
    const id = req.params.id;
    const fileId = req.params.fileId;

    const filePath = path.join(__dirname, `../../userfile/result/${id}/report/${fileId}`);

    HelperService.setHeaderForExtension(res, fileId);

    res.sendFile(filePath);
};

export default getFile;
