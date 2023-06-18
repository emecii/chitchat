import tencent from 'cos-nodejs-sdk-v5';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Tencent Cloud COS SDK
const cos = new tencent({
    SecretId: process.env.TENCENT_SECRET_ID,
    SecretKey: process.env.TENCENT_SECRET_KEY,
});

export async function upload_image(req, res) {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: 'No image file' });
    }

    const user_id = req.body.user_id;
    const model_id = req.body.model_id;

    // Generate the COS key (file path) and upload the image
    const cosKey = `images/${user_id}-${model_id}.jpg`;
    const image_url = `https://${process.env.TENCENT_BUCKET}.cos.${process.env.TENCENT_REGION}.myqcloud.com/${cosKey}`;
    cos.putObject(
        {
        Bucket: process.env.TENCENT_BUCKET,
        Region: process.env.TENCENT_REGION,
        Key: cosKey,
        Body: file.buffer,
        },
        (err, data) => {
        if (err) {
            console.error('Error uploading to Tencent Cloud:', err);
            return res.status(500).json({ error: 'Error uploading the image' });
        }

        console.log('Uploaded to Tencent Cloud:', data);
        res.status(200).json({ message: 'Image uploaded successfully', image_url });
        }
    );
}