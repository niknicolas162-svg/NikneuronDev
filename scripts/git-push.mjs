import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node/index.js';
import fs from 'fs';

const dir = process.cwd();

// Usage: node scripts/git-push.mjs <repo-url> <token>
// e.g.: node scripts/git-push.mjs https://github.com/Nikneuron/NikneuronDev.git ghp_xxxx
const remoteUrl = process.argv[2] || process.env.GITHUB_REPO;
const token = process.argv[3] || process.env.GITHUB_TOKEN;

if (!remoteUrl) {
  console.error('Usage: node scripts/git-push.mjs <repo-url> [github-token]');
  console.error('Example: node scripts/git-push.mjs https://github.com/Nikneuron/NikneuronDev.git ghp_yourToken');
  process.exit(1);
}

async function push() {
  console.log('Adding remote origin:', remoteUrl);
  try {
    await git.addRemote({ fs, dir, remote: 'origin', url: remoteUrl, force: true });
  } catch (e) {
    // remote might already exist
  }

  console.log('Pushing main branch to origin...');
  const pushResult = await git.push({
    fs,
    http,
    dir,
    remote: 'origin',
    ref: 'main',
    onAuth: () => ({
      username: token || 'git',
      password: token || '',
    }),
  });

  console.log('Push succeeded!', pushResult);
}

push().catch((err) => {
  console.error('Push error:', err.message || err);
  process.exit(1);
});
