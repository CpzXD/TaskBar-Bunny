const PALETTES = {
  fur: {
    white: {
      outline: '#2b2633',
      base: '#ffffff',
      shadow: '#d8dee9',
      highlight: '#ffffff',
      innerEar: '#ffb3c6',
      innerEarShadow: '#f092ab',
      nose: '#ff7597'
    },
    brown: {
      outline: '#2b1b17',
      base: '#b5794c',
      shadow: '#804c27',
      highlight: '#cf9263',
      innerEar: '#e8a599',
      innerEarShadow: '#cc8477',
      nose: '#5a341b'
    },
    gray: {
      outline: '#27292d',
      base: '#9aa0a6',
      shadow: '#6e747c',
      highlight: '#bec4cc',
      innerEar: '#f0b1c0',
      innerEarShadow: '#d691a3',
      nose: '#494d54'
    },
    black: {
      outline: '#151419',
      base: '#3a3942',
      shadow: '#222129',
      highlight: '#565561',
      innerEar: '#a37084',
      innerEarShadow: '#7d5263',
      nose: '#1f1e24'
    },
    pink: {
      outline: '#422432',
      base: '#fcc2d7',
      shadow: '#e599b2',
      highlight: '#ffdeeb',
      innerEar: '#ff87a8',
      innerEarShadow: '#e66589',
      nose: '#d6336c'
    },
    golden: {
      outline: '#38250f',
      base: '#f5c069',
      shadow: '#c99238',
      highlight: '#fce29d',
      innerEar: '#fab6ab',
      innerEarShadow: '#d99285',
      nose: '#875114'
    },
    spotted: {
      outline: '#2b1b17',
      base: '#ffffff',
      shadow: '#dcdfe6',
      highlight: '#ffffff',
      patch: '#6e4426',
      patchShadow: '#4d2e18',
      innerEar: '#ffb3c6',
      innerEarShadow: '#f092ab',
      nose: '#4d2e18'
    }
  },
  eyes: {
    ruby: '#e64980',
    black: '#1f1e24',
    blue: '#339af0',
    green: '#40c057',
    amber: '#f59f00'
  },
  blush: 'rgba(255, 107, 107, 0.65)',
  effects: {
    heart: '#ff4d6d',
    heartShadow: '#c9184a',
    star: '#ffd166',
    zzz: '#74c0fc',
    tear: '#4dabf7'
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PALETTES };
}
