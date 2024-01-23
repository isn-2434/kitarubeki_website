// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Storage } from '@google-cloud/storage';

const googleApplicationCredential = JSON.parse(
  Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'base64').toString()
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    videoUrlArray: string[];
    imageUrlArray: string[];
  } | null>
) {
  const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    credentials: googleApplicationCredential,
  });

  async function listFiles() {
    // Lists files in the bucket
    const [files] = await storage
      .bucket('kitarubeki-video-and-thumbnail')
      .getFiles({});
    const videoUrlArray: string[] = [];
    const imageUrlArray: string[] = [];

    files.forEach(async (file) => {
      if (
        file.name.includes('video-interview-thumbnail') &&
        file.name.includes('image_')
      ) {
        const link = file.metadata.mediaLink;
        imageUrlArray.push(link);
      }
      if (
        file.name.includes('vantan-interview') &&
        file.name.includes('video_')
      ) {
        const link = file.metadata.mediaLink;
        videoUrlArray.push(link);
      }
    });
    return { videoUrlArray: videoUrlArray, imageUrlArray: imageUrlArray };
  }

  const response = await listFiles().catch((e) => {
    return null
  });

  res.json(response);
}
