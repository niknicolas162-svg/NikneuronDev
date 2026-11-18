import git from 'isomorphic-git';
import fs from 'fs';
import path from 'path';

const dir = process.cwd();

async function initAndCommit() {
  console.log('Initializing git repository in', dir);
  await git.init({ fs, dir, defaultBranch: 'main' });

  console.log('Reading files to add...');
  const filesToIgnore = ['node_modules', '.git', 'dist'];

  function getAllFiles(currentDir, relativePath = '') {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    let files = [];
    for (const entry of entries) {
      if (filesToIgnore.includes(entry.name)) continue;
      const fullPath = path.join(currentDir, entry.name);
      const rel = relativePath ? `${relativePath}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        files = files.concat(getAllFiles(fullPath, rel));
      } else {
        files.push(rel);
      }
    }
    return files;
  }

  const allFiles = getAllFiles(dir);
  console.log(`Adding ${allFiles.length} files to git index...`);

  for (const filepath of allFiles) {
    await git.add({ fs, dir, filepath });
  }

  console.log('Creating initial commit on main...');
  const sha = await git.commit({
    fs,
    dir,
    message: 'Initial commit: NikneuronDev Cyber-Futuristic Developer Hub & Software Library',
    author: {
      name: 'Aditya Tamta',
      email: 'nikneuronofficial@gmail.com',
    },
  });

  console.log('Successfully committed! Commit SHA:', sha);
  const branch = await git.currentBranch({ fs, dir });
  console.log('Current branch:', branch);
}

initAndCommit().catch((err) => {
  console.error('Git error:', err);
  process.exit(1);
});
