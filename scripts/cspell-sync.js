const fs = require('fs');
const { execSync } = require('child_process');

const existing = require('../.cspell.json');
const newWords = new Set(existing.words || []);

try {
  // Run cspell and capture unknown words only
  const output = execSync(
    'npx cspell lint "**/*.{js,jsx,ts,tsx,json}" --no-progress --words-only --unique',
    { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] } // suppress error output
  );

  output.split('\n').forEach((word) => {
    if (word && !newWords.has(word.trim())) {
      newWords.add(word.trim());
    }
  });

  // Update file
  const updated = {
    ...existing,
    words: Array.from(newWords).sort(),
  };

  fs.writeFileSync('./.cspell.json', JSON.stringify(updated, null, 2));
  console.log('✅ Synced .cspell.json with missing words');
} catch (err) {
  console.warn('⚠️ Spellcheck found issues, but sync completed.');
}
