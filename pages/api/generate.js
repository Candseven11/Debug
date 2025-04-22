import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const image = req.body.image;
        const buffer = await image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');

        // 调用阿里通义API
        const response = await axios.post('https://dashscope.aliyuncs.com/api/v1/services/aigc/image-generation/generation', {
            model: "wanx-v1",
            input: {
                image_url: `data:image/jpeg;base64,${base64Image}`
            },
            parameters: {
                style: "cartoon"  // 可以改为"fairy_tale"获取通话风格
            }
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.ALI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.status(200).json({ 
            resultImage: response.data.output.image_url 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '生成失败' });
    }
}