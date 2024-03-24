import { defineStore } from 'pinia'

export type Upgrade = {
  id?: string
  name: string
  description: string
  costMemory: number
  costMoney: number
  emoji: string
  upgradeType: 'software' | 'hardware' | 'person'
  life?: number
  maxLife?: number
  attack?: number
  attackRange?: number
  launchedAttack?: boolean
}

export type Enemy = {
  id?: string
  name: string
  life: number
  maxLife: number
  damage: number
  emoji: string
  speed: number
}

type CellValue = {
  upgrade?: Upgrade
  enemy?: Enemy
}

export const useGameStateStore = defineStore({
  id: 'gameStateStore',
  persist: {
    storage: persistedState.localStorage
  },
  state: () => ({
    gameActive: false,
    resources: {
      memory: 4 * 1024 * 1024 * 1024,
      money: 150
    },
    selectedUpgrade: null as Upgrade | null,
    upgradeCosts: [
      {
        name: 'Firewall',
        description: 'Blocks incoming threats. Does not actively attack.',
        costMemory: 500 * 1024 * 1024,
        costMoney: 0,
        emoji: '🔥',
        upgradeType: 'software',
        life: 200,
        maxLife: 200,
        attack: 0
      },
      {
        name: 'Basic Antivirus',
        description: 'Detects and removes basic threats that are close.',
        costMemory: 100 * 1024 * 1024,
        costMoney: 0,
        emoji: '🛡️',
        upgradeType: 'software',
        life: 50,
        maxLife: 50,
        attack: 10,
        attackRange: 2
      },
      {
        name: 'Premium Antivirus',
        description: 'Detects and removes advanced threats from a large distance.',
        costMemory: 1000 * 1024 * 1024,
        costMoney: 100,
        emoji: '🔰',
        upgradeType: 'software',
        life: 200,
        maxLife: 200,
        attack: 30,
        attackRange: 4
      },
      {
        name: 'Cyber Security Engineer',
        costMemory: 0,
        costMoney: 1000,
        emoji: '👩‍💻',
        upgradeType: 'person',
        life: 20,
        maxLife: 20,
        attack: 50
      }
    ] as Upgrade[],
    serverRow: [
      { emoji: '🖥️', owned: false },
      { emoji: '🖥️', owned: false },
      { emoji: '🖥️', owned: false },
      { emoji: '🖥️', owned: false },
      { emoji: '🖥️', owned: false },
      { emoji: '🖥️', owned: false },
      { emoji: '🖥️', owned: false },
      { emoji: '🖥️', owned: false },
    ],
    boardState: [
      [{}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}],
    ] as CellValue[][],
    downloadRamCooldown: 0,
    maxDownloadRamCooldown: 30,
    downloadRamTimeout: null as NodeJS.Timeout | null,
    cryptoScamCooldown: 0,
    maxCryptoScamCooldown: 60,
    cryptoScamTimeout: null as NodeJS.Timeout | null,
  }),
  actions: {
    startGame() {
      this.$reset()
      if (this.downloadRamTimeout) {
        clearInterval(this.downloadRamTimeout)
      }
      if (this.cryptoScamTimeout) {
        clearInterval(this.cryptoScamTimeout)
      }
      this.boardState = this.boardState.map(row => row.map(() => ({})))
      this.gameActive = true
    },

    downloadRam() {
      if (this.downloadRamCooldown > 0) {
        return
      }

      this.downloadRamCooldown = this.maxDownloadRamCooldown

      this.downloadRamTimeout = setInterval(() => {
        this.downloadRamCooldown--

        if (this.downloadRamCooldown === 0) {
          this.increaseMemory(1024 * 1024 * 1024)
          if (this.downloadRamTimeout) {
            clearInterval(this.downloadRamTimeout)
          }
        }
      }, 1000)
    },

    launchCryptoScam() {
      if (this.cryptoScamCooldown > 0) {
        return
      }
    
      this.cryptoScamCooldown = this.maxCryptoScamCooldown

      this.cryptoScamTimeout = setInterval(() => {
        this.cryptoScamCooldown--
    
        if (this.cryptoScamCooldown === 0) {
          this.increaseMoney(300)
          if (this.cryptoScamTimeout) {
            clearInterval(this.cryptoScamTimeout)
          }
        }
      }, 1000)
    },

    selectUpgrade(upgrade: Upgrade) {
      if (this.selectedUpgrade?.name === upgrade.name) {
        this.selectedUpgrade = null
        return
      }

      this.selectedUpgrade = upgrade
    },

    canAfford(upgrade: Upgrade) {
      return this.resources.memory >= upgrade.costMemory && this.resources.money >= upgrade.costMoney
    },

    placeUpgrade(x: number, y: number) {
      if (!this.selectedUpgrade || !this.canAfford(this.selectedUpgrade) || this.boardState[y][x].upgrade) {
        return
      }

      const upgradeClone = { ...this.selectedUpgrade }
      upgradeClone.id = crypto.randomUUID()

      this.boardState[y][x].upgrade = upgradeClone
      this.purchaseUpgrade(upgradeClone)
      this.selectedUpgrade = null
    },

    killCell(x: number, y: number, type: 'enemy' | 'upgrade') {
      this.boardState[y][x][type] = undefined
    },

    killCellById(id: string) {
      this.boardState.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell.upgrade?.id === id) {
            this.boardState[y][x].upgrade = undefined
          }

          if (cell.enemy?.id === id) {
            this.boardState[y][x].enemy = undefined
          }
        });
      });
    },

    increaseMoney(amount: number) {
      this.resources.money += amount
    },

    increaseMemory(amount: number) {
      this.resources.memory += amount
    },

    purchaseUpgrade(upgrade: Upgrade) {
      this.resources.money -= upgrade.costMoney
      this.resources.memory -= upgrade.costMemory
    },

    moveEnemies(rafId: number) {
      if (!this.gameActive) {
        return
      }

      this.boardState.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell.upgrade) {
            if (cell.enemy && cell.upgrade.attack) {
              // Attack enemy in current cell
              cell.enemy.life -= cell.upgrade.attack;
            }
    
            // Try to attack first enemy in range
            if (cell.upgrade.attackRange && cell.upgrade.attack) {
              for (let i = 1; i <= cell.upgrade.attackRange; i++) {
                if (x + i >= 8) {
                  break
                }
    
                const enemy = this.boardState[y][x + i].enemy
                if (enemy) {
                  cell.upgrade.launchedAttack = true
                  setTimeout(() => {
                    if (cell.upgrade) {
                      cell.upgrade.launchedAttack = false
                    }
                  }, 500)
    
                  enemy.life -= cell.upgrade.attack
                  if (enemy.life <= 0) {
                    setTimeout(() => {
                      if (enemy?.id) {
                        this.killCellById(enemy.id);
                      }
                    }, 500)
                  }
                  break
                }
              }
            }
          }
    
          if (cell.enemy) {
            if (cell.upgrade && cell.enemy.damage && cell.upgrade.life !== undefined) {
              cell.upgrade.life -= cell.enemy.damage;
            } else {
              const reachedServer = x === 0;
    
              if (reachedServer) {
                if (this.serverRow[y].owned) {
                  cancelAnimationFrame(rafId);
                  this.gameActive = false;
                  if (confirm('Game Over! Restart?')) {
                    this.startGame()
                  }
                  return;
                }
    
                this.serverRow[y].owned = true;
                this.killCell(x, y, 'enemy');
                return;
              }
              // Move up the board
              this.boardState[y][x - cell.enemy.speed].enemy = cell.enemy;
              this.killCell(x, y, 'enemy');
            }
          }
        });
      });
    },

    generateEnemy() {
      if (!this.gameActive) {
        return
      }

      const random = Math.random();
      if (random < 0.8) {
        const enemy = {
          id: crypto.randomUUID(),
          name: 'Basic Virus',
          life: 30,
          maxLife: 30,
          damage: 5,
          emoji: '🦠',
          speed: 1
        };
        const randomColumn = Math.floor(Math.random() * 8);
        this.boardState[randomColumn][7].enemy = enemy;
      } else if (random < 0.9) {
        const enemy = {
          id: crypto.randomUUID(),
          name: 'Advanced Virus',
          life: 50,
          maxLife: 50,
          damage: 15,
          emoji: '🧬',
          speed: 1
        };
        const randomColumn = Math.floor(Math.random() * 8);
        this.boardState[randomColumn][7].enemy = enemy;
      }
    }
  },
})
