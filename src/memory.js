class Registers {
  constructor() {
    this.A = 0;
    this.F = 0;
    this.B = 0;
    this.C = 0;
    this.D = 0;
    this.E = 0;
    this.H = 0;
    this.L = 0;
    this.SP = 0;
    this.PC = 0;

    this.flagHelpers = {
      Z: 0b10000000,
      N: 0b01000000,
      H: 0b00100000,
      C: 0b00010000,
    };

    this.cFlagHelpers = {
      Z: 0b01111111,
      N: 0b10111111,
      H: 0b11011111,
      C: 0b11101111,
    };
  }

  get AF() {
    return ((this.A << 8) | this.F);
  }

  get BC() {
    return ((this.B << 8) | this.C);
  }

  get DE() {
    return ((this.D << 8) | this.E);
  }

  get HL() {
    return ((this.H << 8) | this.L);
  }

  set AF(val) {
    this.A = (val >> 8) & 0b0000000011111111;
    this.F = (val & 0b0000000011111111);
  }

  set BC(val) {
    this.B = (val >> 8) & 0b0000000011111111;
    this.C = (val & 0b0000000011111111);
  }

  set DE(val) {
    this.D = (val >> 8) & 0b0000000011111111;
    this.E = (val & 0b0000000011111111);
  }

  set HL(val) {
    this.H = (val >> 8) & 0b0000000011111111;
    this.L = (val & 0b0000000011111111);
  }

  setFlag(flag, val=true) {
    /*
    0bSZ-H -PNC --> Living in register F
    */
    if (val) {
      this.F = this.F | this.flagHelpers[flag];
    } else {
      this.F = this.F & this.cFlagHelpers[flag];
    }

    return this.F;
  }

  resetFlags() {
    this.F = this.F & 0b00001111;
  }
};

exports.Memory = class Memory {
  constructor(data) {
    this.data = new Uint8Array(65536);
    this.r = new Registers();
    for (let index = 0; index < data.length; index++) {
      this.data[index] = data[index];
    }
  }

  getInstruction(offset=0) {
    /*
      Returns 8bit integer from data at PC + addr location
      It updates the PC
    */
    let addr = this.r.PC + offset;
    this.r.PC = addr;
    return this.data[addr];
  }

  writeByteAt(addr, value) {
    this.data[addr] = value;
  }

  getCurrentByte() {
    return this.data[this.r.PC];
  }

  getByteAt(addr=0) {
    /* returns 8bit integer */
    return this.data[addr];
  }

  getWordAt(addr) {
    /* returns 16bit integer */
    return this.data[addr] | (this.data[addr + 1] << 8);
  }
};
