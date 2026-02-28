import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const COLORS = {
  red: { bg: 'bg-red-500', border: 'border-red-600' },
  blue: { bg: 'bg-blue-500', border: 'border-blue-600' },
  green: { bg: 'bg-green-500', border: 'border-green-600' },
  yellow: { bg: 'bg-yellow-500', border: 'border-yellow-600' },
}

const PLAYERS = ['red', 'blue', 'green', 'yellow']

export default function App() {
  const [gameState, setGameState] = useState('menu') // menu, betting, playing, ended
  const [currentPlayer, setCurrentPlayer] = useState(0)
  const [dice, setDice] = useState(1)
  const [isRolling, setIsRolling] = useState(false)
  const [betAmount, setBetAmount] = useState(0.1)
  const [wallet, setWallet] = useState(10) // 10 ETH mock
  const [pot, setPot] = useState(0)
  
  // Game board - simplified 52-cell track + 4 home bases
  const [pieces, setPieces] = useState({
    red: [{ pos: -1, home: false }, { pos: -1, home: false }, { pos: -1, home: false }, { pos: -1, home: false }],
    blue: [{ pos: -1, home: false }, { pos: -1, home: false }, { pos: -1, home: false }, { pos: -1, home: false }],
    green: [{ pos: -1, home: false }, { pos: -1, home: false }, { pos: -1, home: false }, { pos: -1, home: false }],
    yellow: [{ pos: -1, home: false }, { pos: -1, home: false }, { pos: -1, home: false }, { pos: -1, home: false }],
  })

  const rollDice = () => {
    if (isRolling) return
    setIsRolling(true)
    
    let rolls = 0
    const interval = setInterval(() => {
      setDice(Math.floor(Math.random() * 6) + 1)
      rolls++
      if (rolls > 10) {
        clearInterval(interval)
        const finalRoll = Math.floor(Math.random() * 6) + 1
        setDice(finalRoll)
        setIsRolling(false)
        handleMove(finalRoll)
      }
    }, 100)
  }

  const handleMove = (roll) => {
    const player = PLAYERS[currentPlayer]
    const playerPieces = pieces[player]
    
    // Find first piece that can move
    let moved = false
    const newPieces = { ...pieces }
    
    for (let i = 0; i < 4; i++) {
      const piece = playerPieces[i]
      
      // If piece is at home (-1), need 6 to exit
      if (piece.pos === -1 && roll === 6) {
        newPieces[player][i].pos = currentPlayer * 13 // Starting position for each player
        moved = true
        break
      }
      
      // If piece is on board, move it
      if (piece.pos >= 0 && !piece.home) {
        let newPos = piece.pos + roll
        
        // Check if reached home
        if (newPos >= 52) {
          newPieces[player][i].home = true
          moved = true
          
          // Check win condition
          const homeCount = newPieces[player].filter(p => p.home).length
          if (homeCount === 4) {
            setGameState('ended')
            setWallet(w => w + pot)
            return
          }
        } else {
          newPieces[player][i].pos = newPos
          moved = true
        }
        break
      }
    }
    
    if (moved) {
      setPieces(newPieces)
    }
    
    // Next player (unless rolled 6)
    if (roll !== 6) {
      setCurrentPlayer((currentPlayer + 1) % 4)
    }
  }

  const startGame = () => {
    if (wallet < betAmount) {
      alert('Insufficient balance!')
      return
    }
    setWallet(w => w - betAmount)
    setPot(betAmount * 4) // 4 players betting
    setGameState('playing')
  }

  const resetGame = () => {
    setGameState('menu')
    setCurrentPlayer(0)
    setPieces({
      red: [{ pos: -1, home: false }, { pos: -1, home: false }, { pos: -1, home: false }, { pos: -1, home: false }],
      blue: [{ pos: -1, home: false }, { pos: -1, home: false }, { pos: -1, home: false }, { pos: -1, home: false }],
      green: [{ pos: -1, home: false }, { pos: -1, home: false }, { pos: -1, home: false }, { pos: -1, home: false }],
      yellow: [{ pos: -1, home: false }, { pos: -1, home: false }, { pos: -1, home: false }, { pos: -1, home: false }],
    })
  }

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            CryptoParchisi
          </h1>
          <p className="text-slate-400 mb-8">Play Parchisi with Crypto Betting</p>
          
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md">
            <div className="mb-6">
              <p className="text-sm text-slate-400 mb-2">Wallet Balance</p>
              <p className="text-3xl font-bold">{wallet.toFixed(2)} ETH</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm text-slate-400 mb-2">Bet Amount (per player)</label>
              <div className="flex gap-2">
                {[0.01, 0.05, 0.1, 0.5, 1].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    className={`flex-1 py-2 rounded-lg transition-colors ${
                      betAmount === amount 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {amount} ETH
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={startGame}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity"
            >
              Start Game (Win {betAmount * 4} ETH)
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (gameState === 'ended') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-4xl font-bold mb-4">You Won!</h1>          
          <p className="text-2xl text-green-400 mb-2">+{pot.toFixed(2)} ETH</p>
          <p className="text-slate-400 mb-8">New Balance: {wallet.toFixed(2)} ETH</p>
          
          <button
            onClick={resetGame}
            className="px-8 py-3 bg-purple-600 rounded-xl font-bold hover:bg-purple-700 transition-colors"
          >
            Play Again
          </button>
        </motion.div>
      </div>
    )
  }

  // Playing state
  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-slate-400">Current Turn</p>
          <div className={`w-8 h-8 rounded-full ${COLORS[PLAYERS[currentPlayer]].bg} border-2 border-white`} />
        </div>
        <div className="text-center">
          <p className="text-sm text-slate-400">Pot</p>
          <p className="text-xl font-bold text-green-400">{pot.toFixed(2)} ETH</p>
        </div>
        <button onClick={resetGame} className="text-sm text-slate-400 hover:text-white">
          Exit
        </button>
      </div>

      {/* Game Board - Simplified */}
      <div className="max-w-2xl mx-auto">
        {/* Home Bases */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {PLAYERS.map((player, i) => (
            <div key={player} className={`p-4 rounded-xl bg-slate-800 border-2 ${currentPlayer === i ? 'border-white' : 'border-transparent'}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-4 h-4 rounded-full ${COLORS[player].bg}`} />
                <span className="capitalize">{player}</span>
                <span className="text-xs text-slate-400">({pieces[player].filter(p => p.home).length}/4 home)</span>
              </div>
              <div className="flex gap-1">
                {pieces[player].map((piece, idx) => (
                  <motion.div
                    key={idx}
                    className={`w-6 h-6 rounded-full ${COLORS[player].bg} border-2 border-white`}
                    animate={{ 
                      scale: piece.pos >= 0 ? 1.2 : 1,
                      opacity: piece.home ? 0.5 : 1
                    }}
                  >
                    {piece.pos >= 0 && <span className="text-[8px] flex items-center justify-center h-full">{piece.pos}</span>}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Dice */}
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="dice"
            animate={{ rotate: isRolling ? 360 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {dice}
          </motion.div>
          
          <button
            onClick={rollDice}
            disabled={isRolling}
            className="px-8 py-3 bg-purple-600 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
          >
            {isRolling ? 'Rolling...' : 'Roll Dice'}
          </button>
          
          <p className="text-sm text-slate-400">
            {PLAYERS[currentPlayer]}'s turn
            {dice === 6 && <span className="text-green-400"> - Roll again!</span>}
          </p>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-slate-800 rounded-xl">
          <h3 className="font-bold mb-2">How to Play:</h3>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>🎲 Roll 6 to move piece from home</li>
            <li>🏃 Move pieces around the board</li>
            <li>🏆 First to get all 4 pieces home wins the pot!</li>
            <li>⚡ Roll 6 = extra turn</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
