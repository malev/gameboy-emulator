exports.Memory = class Memory {
  constructor(data) {
    this.data = new Uint8Array(data);
    this.resetRegisters();
    this.resetFlags();
  }

  getInstruction(offset=0) {
    /*
      Returns 8bit integer from data at PC + addr location
      It updates the PC
    */
    let addr = this.r.PC + offset;
    if (addr > this.data.length) {
      throw `addr: ${addr} is overflowing the memory`;
    }

    this.r.PC = addr;
    return this.data[addr];
  }

  writeByte(addr, value) {
    this.data[addr] = value;
  }

  getCurrentByte() {
    return this.data[this.r.PC];
  }

  getByteAt(addr=0) {
    /* returns 8bit integer */
    if (addr > this.data.length) {
      throw `addr: ${addr} is overflowing the memory`;
    }

    if (addr == 0xFF0F) {
      console.log('byte read from interrupt flag (IF)');
    } else if (addr == 0xFF44) {
      console.log('byte read from LY');
    }  // TODO: remove this debug messages

    return this.data[addr];
  }

  getWordAt(addr) {
    /* returns 16bit integer */
    return this.data[addr] | (this.data[addr + 1] << 8);
  }

  setFlag(flag, val=true) {
    // TODO: test this!
    if (val) {
      this.r.F = this.r.F | this.f[flag];
    } else {
      this.r.F = this.r.F & this.f[flag];
    }
  }

  resetRegisters() {
    this.r = {
      A: 0,
      F: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
      H: 0,
      L: 0,
      SP: 0,
      PC: 0,
    };
    return this.r;
  }

  resetFlags() {
    this.f = {
      Z: 0b10000000,
      N: 0b01000000,
      H: 0b00100000,
      C: 0b00010000,
    };
    this.cF = {
      Z: 0b01111111,
      N: 0b10111111,
      H: 0b11011111,
      C: 0b11101111,
    };

    return this.f, this.cF;
  }
};
