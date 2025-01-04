import path from 'path';
import fs from 'fs';

/**
 * Retrieves details of a file from its extracted JSON data
 * 
 * This function reads a JSON file containing extracted data for a given fileId
 * and returns basic file details including the name and ID.
 * 
 * @param fileId - Unique identifier for the file
 * @returns Object containing file name and ID
 * @throws Will throw an error if file cannot be read or parsed
 */
export const getFileDetails = (fileId: string) => {
  // Construct path to the extracted JSON file
  const fileLoc = path.join(
    process.cwd(), 
    './uploads',
    fileId + '-extracted.json',
  );

  // Read and parse the JSON file
  const parsedFile = JSON.parse(fs.readFileSync(fileLoc, 'utf8'));

  // Return relevant file details
  return {
    name: parsedFile.title,
    fileId: fileId,
  };
};
