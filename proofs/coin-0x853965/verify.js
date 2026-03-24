#!/usr/bin/env node
// Verify Coin contract bytecode match
// Requires: Docker with solc-umbrella image, curl

const { execSync } = require('child_process');
const crypto = require('crypto');

const TARGET_RUNTIME = '60606040526000357c01000000000000000000000000000000000000000000000000000000009004806390b98a1114610044578063bbd39ac01461007957610042565b005b61006360048080359060200190919080359060200190919050506100c0565b6040518082815260200191505060405180910390f35b61008f60048080359060200190919050506100a5565b6040518082815260200191505060405180910390f35b60006000506020528060005260406000206000915090505481565b600081600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054101561010257600090506101f6565b81600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055507f16cdf1707799c6655baac6e210f52b94b7cec08adcaf9ede7dfe8649da926146338484604051808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060405180910390a1600190506101f6565b9291505056';

const SOURCE = `contract Coin {
    mapping (address => uint) public coinBalanceOf;
    event CoinTransfer(address sender, address receiver, uint amount);
  
    function Coin(uint amount) {
        coinBalanceOf[msg.sender] = amount;
    }
  
    function sendCoin(address receiver, uint amount) returns(uint sufficient) {
        if (coinBalanceOf[msg.sender] < amount) return 0;
        coinBalanceOf[msg.sender] -= amount;
        coinBalanceOf[receiver] += amount;
        CoinTransfer(msg.sender, receiver, amount);
        return 1;
    }
}`;

try {
  const cmd = `docker run --rm solc-umbrella sh -c 'cat > /tmp/Coin.sol << SOLEOF
${SOURCE}
SOLEOF
/umbrella/build/solidity/solc/solc --bin /tmp/Coin.sol 2>&1'`;
  
  const output = execSync(cmd, { encoding: 'utf8' });
  const lines = output.split('\n');
  const binIdx = lines.findIndex(l => l.trim() === 'Binary:');
  if (binIdx < 0) throw new Error('Binary: not found in output');
  const fullBytecode = lines[binIdx + 1].trim().toLowerCase();
  
  // Split at runtime start (after constructor f3)
  const runtimeIdx = fullBytecode.indexOf('f360606040526000357c');
  const compiledRuntime = fullBytecode.substring(runtimeIdx + 2);
  
  console.log('Compiled runtime:', compiledRuntime.length / 2, 'bytes');
  console.log('Target runtime:', TARGET_RUNTIME.length / 2, 'bytes');
  
  if (compiledRuntime === TARGET_RUNTIME) {
    console.log('✅ RUNTIME MATCH — Exact bytecode match confirmed!');
  } else {
    console.log('❌ MISMATCH');
    for (let i = 0; i < Math.min(compiledRuntime.length, TARGET_RUNTIME.length); i += 2) {
      if (compiledRuntime[i] !== TARGET_RUNTIME[i] || compiledRuntime[i+1] !== TARGET_RUNTIME[i+1]) {
        console.log(`First diff at byte ${i/2}:`);
        console.log('Compiled:', compiledRuntime.substring(i, i+20));
        console.log('Target:', TARGET_RUNTIME.substring(i, i+20));
        break;
      }
    }
  }
  
  // Verify SHA-256
  const runtimeHash = crypto.createHash('sha256').update(Buffer.from(TARGET_RUNTIME, 'hex')).digest('hex');
  console.log('Runtime SHA-256:', runtimeHash);
  console.log('Expected:', 'abce4a690ee974efa2a8e58da67ba605c3ca7400f9da0794440d935286902735');
  console.log('Hash match:', runtimeHash === 'abce4a690ee974efa2a8e58da67ba605c3ca7400f9da0794440d935286902735');
  
} catch (e) {
  console.error('Error:', e.message);
  process.exit(1);
}
