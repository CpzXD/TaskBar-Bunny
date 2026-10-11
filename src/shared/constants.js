const HUNGER_SPEED_FACTORS = {
  relaxed: 0.5,  // ~60 min per carrot
  normal: 1.0,   // ~30 min per carrot
  fast: 2.0      // ~15 min per carrot
};

const FOODS = {
  carrot: {
    id: 'carrot',
    name: 'Crunchy Carrot',
    hungerRestore: 35,
    happinessBonus: 10,
    cost: 10,
    color: '#ff8822',
    description: 'A bunny classic. Rich in beta-carotene!'
  },
  lettuce: {
    id: 'lettuce',
    name: 'Crisp Lettuce',
    hungerRestore: 20,
    happinessBonus: 5,
    cost: 5,
    color: '#76c442',
    description: 'Refreshing and light green leaves.'
  },
  apple: {
    id: 'apple',
    name: 'Sweet Apple Slice',
    hungerRestore: 40,
    happinessBonus: 20,
    cost: 18,
    color: '#ee4444',
    description: 'A juicy, sweet midday treat.'
  },
  clover: {
    id: 'clover',
    name: 'Lucky Four-Leaf Clover',
    hungerRestore: 15,
    happinessBonus: 35,
    cost: 25,
    color: '#28bb67',
    description: 'Guaranteed to bring bunny smiles.'
  },
  strawberry: {
    id: 'strawberry',
    name: 'Ripe Strawberry',
    hungerRestore: 45,
    happinessBonus: 30,
    cost: 30,
    color: '#ff3366',
    description: 'Fragrant and delightfully sweet.'
  }
};

const FUR_COLORS = {
  white: { id: 'white', name: 'Snow White', base: '#fdfbf7', shadow: '#e0dcd3', innerEar: '#ffb5cb' },
  brown: { id: 'brown', name: 'Chestnut Brown', base: '#b5794c', shadow: '#83522d', innerEar: '#df9487' },
  gray: { id: 'gray', name: 'Cloud Gray', base: '#abb0b8', shadow: '#7d848f', innerEar: '#e8afbd' },
  black: { id: 'black', name: 'Midnight Charcoal', base: '#3d3c45', shadow: '#24232b', innerEar: '#b48197' },
  pink: { id: 'pink', name: 'Pastel Sakura', base: '#fcd3de', shadow: '#e2a3b4', innerEar: '#ff85a9' },
  golden: { id: 'golden', name: 'Caramel Honey', base: '#ebb768', shadow: '#c48f43', innerEar: '#f5b5a8' },
  spotted: { id: 'spotted', name: 'Dutch Patch', base: '#fdfbf7', shadow: '#dedbd4', patch: '#704627', innerEar: '#ffb5cb' }
};

const EYE_COLORS = {
  ruby: { id: 'ruby', name: 'Ruby Pink', color: '#e64980' },
  black: { id: 'black', name: 'Deep Onyx', color: '#1a1921' },
  blue: { id: 'blue', name: 'Sky Blue', color: '#339af0' },
  green: { id: 'green', name: 'Emerald Green', color: '#40c057' },
  amber: { id: 'amber', name: 'Golden Amber', color: '#f59f00' }
};

const EAR_STYLES = {
  upright: { id: 'upright', name: 'Perky Upright' },
  floppy: { id: 'floppy', name: 'Floppy Lop' },
  derpy: { id: 'derpy', name: 'One Up One Down' }
};

const ACCESSORIES = {
  head: [
    { id: 'none', name: 'None', tier: 'common', price: 0 },
    { id: 'party_hat', name: 'Party Cone', tier: 'common', price: 20 },
    { id: 'beanie', name: 'Winter Beanie', tier: 'common', price: 30 },
    { id: 'cowboy_hat', name: 'Sheriff Stetson', tier: 'rare', price: 60 },
    { id: 'wizard_hat', name: 'Sorcerer Hat', tier: 'rare', price: 80 },
    { id: 'flower_crown', name: 'Floral Crown', tier: 'rare', price: 70 },
    { id: 'headphones', name: 'Gamer Headset', tier: 'rare', price: 90 },
    { id: 'golden_crown', name: 'Royal Crown', tier: 'epic', price: 150 },
    { id: 'bunny_ears_headband', name: 'Bunny Headband (Joke)', tier: 'epic', price: 180 }
  ],
  face: [
    { id: 'none', name: 'None', tier: 'common', price: 0 },
    { id: 'glasses', name: 'Smart Glasses', tier: 'common', price: 25 },
    { id: 'sunglasses', name: 'Cool Shades', tier: 'rare', price: 50 },
    { id: 'monocle', name: 'Fancy Monocle', tier: 'rare', price: 65 },
    { id: 'mustache', name: 'Gentleman Mustache', tier: 'epic', price: 85 }
  ],
  neck: [
    { id: 'none', name: 'None', tier: 'common', price: 0 },
    { id: 'red_scarf', name: 'Cozy Red Scarf', tier: 'common', price: 25 },
    { id: 'bowtie', name: 'Dapper Bow Tie', tier: 'common', price: 35 },
    { id: 'bell_collar', name: 'Golden Bell Collar', tier: 'rare', price: 60 },
    { id: 'flower_lei', name: 'Tropical Lei', tier: 'rare', price: 70 }
  ],
  back: [
    { id: 'none', name: 'None', tier: 'common', price: 0 },
    { id: 'backpack', name: 'Little Explorer Bag', tier: 'common', price: 35 },
    { id: 'cape', name: 'Hero Cape', tier: 'rare', price: 75 },
    { id: 'angel_wings', name: 'Fairy Wings', tier: 'epic', price: 140 }
  ],
  held: [
    { id: 'none', name: 'None', tier: 'common', price: 0 },
    { id: 'balloon', name: 'Heart Balloon', tier: 'common', price: 30 },
    { id: 'flag', name: 'Cheering Flag', tier: 'common', price: 40 },
    { id: 'lollipop', name: 'Rainbow Swirl', tier: 'rare', price: 60 },
    { id: 'wand', name: 'Star Wand', tier: 'epic', price: 120 }
  ]
};

const ACHIEVEMENTS = [
  { id: 'first_carrot', name: 'First Crunch', description: 'Feed your bunny for the first time.', rewardCoins: 20, rewardXp: 30 },
  { id: 'fed_25', name: 'Carrot Connoisseur', description: 'Feed 25 treats to your bunny.', rewardCoins: 50, rewardXp: 60 },
  { id: 'fed_100', name: 'Feast Master', description: 'Feed 100 treats to your bunny.', rewardCoins: 150, rewardXp: 200 },
  { id: 'pet_50', name: 'True Affection', description: 'Pet your bunny 50 times.', rewardCoins: 40, rewardXp: 50 },
  { id: 'pet_200', name: 'Fluffy Bestie', description: 'Pet your bunny 200 times.', rewardCoins: 100, rewardXp: 150 },
  { id: 'first_harvest', name: 'Green Thumb', description: 'Harvest your first homegrown carrot.', rewardCoins: 30, rewardXp: 40 },
  { id: 'fashion_pioneer', name: 'Fashion Pioneer', description: 'Equip any accessory in the Wardrobe.', rewardCoins: 25, rewardXp: 35 },
  { id: 'three_presets', name: 'Stylist Guru', description: 'Save all 3 outfit presets.', rewardCoins: 60, rewardXp: 75 },
  { id: 'level_5', name: 'Growing Up', description: 'Reach Bunny Level 5.', rewardCoins: 80, rewardXp: 100 },
  { id: 'level_10', name: 'Legendary Bunny', description: 'Reach Bunny Level 10.', rewardCoins: 200, rewardXp: 300 }
];

const DEFAULT_STATE = {
  version: 1,
  bunny: {
    name: 'Barnaby',
    furColor: 'white',
    earStyle: 'upright',
    eyeColor: 'ruby',
    blush: true,
    equipped: {
      head: 'none',
      face: 'none',
      neck: 'none',
      back: 'none',
      held: 'none'
    },
    hunger: 85,
    happiness: 90,
    level: 1,
    xp: 0,
    totalCarrotsFed: 0,
    totalPetCount: 0,
    outfitPresets: [
      { name: 'Preset 1', head: 'none', face: 'none', neck: 'none', back: 'none', held: 'none' },
      { name: 'Preset 2', head: 'none', face: 'none', neck: 'none', back: 'none', held: 'none' },
      { name: 'Preset 3', head: 'none', face: 'none', neck: 'none', back: 'none', held: 'none' }
    ]
  },
  inventory: {
    coins: 50,
    foods: {
      carrot: 5,
      lettuce: 3,
      apple: 1,
      clover: 1,
      strawberry: 1
    },
    unlockedCosmetics: [
      'head:party_hat',
      'face:glasses',
      'neck:red_scarf'
    ]
  },
  garden: {
    plots: [
      { id: 1, planted: true, plantedAt: Date.now() - 60000, growDurationMs: 120000, ready: false }
    ]
  },
  settings: {
    bunnyScale: 2.5,
    menuScale: 1.0,
    monitorIndex: 0,
    volume: 0.6,
    isMuted: false,
    hungerSpeed: 'normal',
    roamingArea: 'cozy',
    floorMode: 'taskbar',
    menuPosition: null,
    startWithWindows: false,
    doNotDisturb: false
  },
  achievements: {
    unlocked: []
  },
  meta: {
    lastSaved: Date.now(),
    lastLoginDate: new Date().toISOString().slice(0, 10),
    loginStreak: 1
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    HUNGER_SPEED_FACTORS,
    FOODS,
    FUR_COLORS,
    EYE_COLORS,
    EAR_STYLES,
    ACCESSORIES,
    ACHIEVEMENTS,
    DEFAULT_STATE
  };
}
