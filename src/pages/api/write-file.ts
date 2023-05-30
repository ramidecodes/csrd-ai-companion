import fs from 'fs';
import { FileLite } from '../../types';
import type { NextApiRequest, NextApiResponse } from 'next';

const embeddings = 'src/pages/api/data/file_embeddings';

const writeFile = (file: FileLite) => {
  const stringifiedFile = JSON.stringify(file);
  console.log('Got ' + file.name);
  const currentDir = process.cwd();

  // writing the JSON string content to a file
  fs.writeFile(
    `${currentDir}/${embeddings}/${file.name}.json`,
    stringifiedFile,
    (error) => {
      // throwing the error
      // in case of a writing problem
      if (error) {
        // logging the error
        console.error(error);
        throw error;
      }
      console.log(file.name + ' json written correctly');
    },
  );
};

type Data = {
  fileNames?: string[];
  error?: string;
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try {
    const parsedFiles = JSON.parse(req.body);
    // console.log('🚀 ~ file: write-e.ts:42 ~ parsedFiles:', parsedFiles);

    const files = parsedFiles as FileLite[];

    if (!Array.isArray(files) || files.length === 0) {
      res.status(400).json({ error: 'files must be a non-empty array' });
      return;
    }

    files.forEach((file) => {
      try {
        writeFile(file);
      } catch (error) {
        console.error(error);
      }
    });

    const fileNames = files.map((file) => file.name);
    res.status(200).json({ fileNames });
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: 'Something went wrong' });
  }
}
