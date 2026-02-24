import fs from 'fs';
import path from 'path';

/**
 * Clean up test output directories
 */
export const cleanupDirectories = (): void => {
  const directories = ['downloadfile'];

  directories.forEach((dir) => {
    const dirPath = path.join(process.cwd(), dir);

    if (fs.existsSync(dirPath)) {
      // Delete all files in directory
      fs.readdirSync(dirPath).forEach((file) => {
        const filePath = path.join(dirPath, file);
        try {
          fs.unlinkSync(filePath);
          console.log(`Deleted file: ${filePath}`);
        } catch (error) {
          console.warn(`Failed to delete file: ${filePath}`, error);
        }
      });
      console.log(`Cleaned ${dir} directory`);
    } else {
      // Create directory if it doesn't exist
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created ${dir} directory`);
    }
  });
};

export default cleanupDirectories;

