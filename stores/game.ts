// import { defineStore } from 'pinia'

export type Upgrade ={
  name: string
  costMemory: number
  costMoney: number
  emoji: string
  upgradeType: 'software' | 'hardware' | 'person'
  life?: number
  maxLife?: number
  attack?: number
}

// export const useMyGameStore = defineStore({
//   id: 'myGameStore',
//   state: () => ({ }),
//   actions: {}
// })
