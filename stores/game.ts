// import { defineStore } from 'pinia'

export type Upgrade ={
  id?: string
  name: string
  costMemory: number
  costMoney: number
  emoji: string
  upgradeType: 'software' | 'hardware' | 'person'
  life?: number
  maxLife?: number
  attack?: number
}

export type Enemy = {
  id?: string
  name: string
  life: number
  maxLife: number
  damage: number
  emoji: string
}

// export const useMyGameStore = defineStore({
//   id: 'myGameStore',
//   state: () => ({ }),
//   actions: {}
// })
