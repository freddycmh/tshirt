import { proxy } from 'valtio'

const state = proxy({
  intro: true,
  colors: ['#ccc', '#EFBD4E', '#80C670', '#726DE8', '#EF674E', '#353934'],
  // decals: ['react', 'three2', 'pmndrs'],
  decals: ['smpls1', 'smpls2', 'diskko'],

  selectedColor: '#C0C0C0',
  selectedDecal: 'diskko2',
  customDecal: null
  
})

export { state }
