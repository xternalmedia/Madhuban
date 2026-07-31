const fs = require('fs');
const path = require('path');

const directoryToSearch = path.join(__dirname, '../');

function findAndReplace(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.next' || file === '.git') continue;
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findAndReplace(filePath);
    } else if (stat.isFile() && (filePath.endsWith('.tsx') || filePath.endsWith('.ts'))) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // We don't want to replace next/image in our media.tsx itself!
      if (filePath.endsWith('components/shared/media.tsx')) continue;

      let hasChanges = false;
      
      if (content.includes("import Image from 'next/image'")) {
        content = content.replace("import Image from 'next/image'", "import { Media as Image } from '@/components/shared/media'");
        hasChanges = true;
      }
      
      if (content.includes('import Image from "next/image"')) {
        content = content.replace('import Image from "next/image"', 'import { Media as Image } from "@/components/shared/media"');
        hasChanges = true;
      }

      if (hasChanges) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
      }
    }
  }
}

findAndReplace(directoryToSearch);
