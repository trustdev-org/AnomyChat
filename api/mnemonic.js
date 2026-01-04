const ADJECTIVES = [
  'autumn', 'hidden', 'bitter', 'misty', 'silent', 'empty', 'dry', 'dark',
  'summer', 'icy', 'delicate', 'quiet', 'white', 'cool', 'spring', 'winter',
  'patient', 'twilight', 'dawn', 'crimson', 'wispy', 'weathered', 'blue',
  'billowing', 'broken', 'cold', 'damp', 'falling', 'frosty', 'green',
  'long', 'late', 'lingering', 'bold', 'little', 'morning', 'muddy', 'old',
  'red', 'rough', 'still', 'small', 'sparkling', 'throbbing', 'shy',
  'wandering', 'withered', 'wild', 'black', 'young', 'holy', 'solitary',
  'fragrant', 'aged', 'snowy', 'proud', 'floral', 'restless', 'divine',
  'polished', 'ancient', 'purple', 'lively', 'nameless'
];

const NOUNS = [
  'water', 'haze', 'mountain', 'night', 'sun', 'moon', 'darkness',
  'wind', 'rain', 'morning', 'snow', 'meadow', 'sunset', 'pine',
  'shadow', 'leaf', 'dawn', 'glitter', 'forest', 'hill', 'cloud', 'breeze',
  'brook', 'butterfly', 'bush', 'dew', 'dust', 'field', 'fire', 'flower',
  'firefly', 'feather', 'grass', 'haze', 'mountain', 'night', 'pond',
  'darkness', 'snowflake', 'silence', 'sound', 'sky', 'shape', 'surf',
  'thunder', 'violet', 'water', 'wildflower', 'wave', 'water', 'resonance',
  'sun', 'wood', 'dream', 'cherry', 'tree', 'fog', 'frost', 'voice', 'paper',
  'frog', 'smoke', 'star'
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const randomAdjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const randomNoun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const randomNumber = Math.floor(Math.random() * 100);

  const mnemonic = `${randomAdjective}-${randomNoun}-${randomNumber}`;

  return res.status(200).json({ mnemonic });
}
