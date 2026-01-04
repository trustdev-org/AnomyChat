// 本地词汇生成 - 无需服务器
export const generateRoomMnemonic = (): string => {
  const adjectives = [
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

  const nouns = [
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

  const r = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  const randomNumber = Math.floor(Math.random() * 100);
  return `${r(adjectives)}-${r(nouns)}-${randomNumber}`;
};