const $ = require('jquery');
const sprintf = require('sprintf-js').sprintf;

const imp = {
  CALL_nn: function (mem, nn) {
    /*
      Push address of next instruction onto stack and then jump to address n.
    */
    let addr = mem.r.PC + 3; // Address to push to stack

    mem.r.SP = mem.r.SP - 1;
    mem.writeByte(mem.r.SP, addr >> 8); // H part of addr

    mem.r.SP = mem.r.SP - 1;
    mem.writeByte(mem.r.SP, addr & 0x00FF); // L part of addr

    mem.r.PC = parseInt(nn);
  },

  POP_nn: function (mem, nn) {
    /*
      Pop two bytes off stack into register pair nn.
      Increment Stack Pointer (SP) twice.
      nn = AF,BC,DE,HL
    */
    mem.r[nn[1]] = mem.getByteAt(mem.r.SP);
    mem.r.SP = mem.r.SP + 1;
    mem.r[nn[0]] = mem.getByteAt(mem.r.SP);
    mem.r.SP = mem.r.SP + 1;
  },

  PUSH_REG: function (mem, reg) {
    // Reg is expected to be 16bits
    if (reg in mem.r) {
      throw 'Not implemented yet';
    } else {
      mem.r.SP = mem.r.SP - 1;
      mem.writeByte(mem.r.SP, mem.r[reg[0]]);

      mem.r.SP = mem.r.SP - 1;
      mem.writeByte(mem.r.SP, mem.r[reg[1]]);
    }
  },

  JP_cc_n: function (mem, n, cc) { // 0x20, ...
    /*
    Jump to address n if following condition is true:
      n = two byte immediate value. (LSByte first.)

      cc = NZ, Jump if Z flag is reset.
      cc = Z,  Jump if Z flag is set.
      cc = NC, Jump if C flag is reset.
      cc = C,  Jump if C flag is set.
    */
    throw 'Not implemented yet';
  },

  DEC_reg: function (mem, reg) { //0x05
    /*
      Decrement register
      Flags affected:
        Z - Set if result is zero.
        N - Set.
        H - Set if no borrow from bit 4.
        C - Not affected.
    */
    if (mem.r[reg] == 1) {
      mem.setFlag('Z', true);
    } else {
      mem.setFlag('Z', false);
    }

    if ((mem.r[reg] & 0b00001111) > 1) {
      mem.setFlag('H', true);
    } else {
      mem.setFlag('H', false);
    }

    mem.setFlag('N', true);

    mem.r[reg] = (mem.r[reg] - 1) & 0x00FF;
  },

  LD_REG_nn: function (mem, reg, nn) { // 0x21, ...
    /*
    Move nn (16bits) into register reg
    */

    if (reg in mem.r) {
      mem.r[reg] = nn;
    } else {
      // It's a compose register (ex: DE)
      let addr = (mem.r.D << 8) | mem.r.E;
      mem.r[addr] = nn;
    }
  },

  LD_REG_n: function (mem, reg, n) {
    /*
    Move n (8bits) into register reg
    */
    mem.r[reg] = n;
  },

  LD_A_DE: function (mem) { // 0x1A
    /* Load A from address pointed to by DE */
    let addr = (mem.r.D << 8) | mem.r.E;
    mem.r.A = mem.getByteAt(addr);
  },

  LD_HL_A: function (mem) {
    /* Copy A to address pointed by HL" ("LD (HL),A */
    let addr = (mem.r.H << 8) | mem.r.L;
    mem.writeByte(addr, mem.r.A);
  },

  LD_r1_r2: function (mem, r1, r2) { // 0x4F
    mem.r.r1 = mem.r.r2;
  },

  LDH_a8_REG: function (mem, reg, n) { // 0xE0
    /* Put A into memory address $FF00 + n. */
    let addr = n + 0xFF00;
    mem.writeByte(addr, mem.r.A);
  },

  XOR_REG_n: function (mem, reg) {
    /*
    Logical exclusive OR n with register A, result in A.
    flags: Z
    */
    mem.r[reg] = mem.r[reg] ^ mem.r[reg];
    mem.setFlag('F');
  },

  JRNZr8: function (mem, n) { // 0x20
    /*
    Jump to n if Z flag is reset.
    */

    // TODO: Refactor this into JP_cc_n

    if (!(mem.r.F & 0b10000000)) {
      let signed = (n + Math.pow(2, 7)) % Math.pow(2, 8) - Math.pow(2, 7);
      let jumpTo = ((signed + mem.r.PC) & 0x00FF);
      mem.r.PC = jumpTo;
    }
  },

  LD_HL_m_A: function (mem) {
    /*
    Put A into memory address HL. Decrement HL.
    */
    mem.r.HL = mem.r.A;
    mem.r.HL = mem.r.HL - 1;
  },

  XOR_A_n: function (mem) { // 0xAF
    /*
    Logical exclusive OR n with register A, result in A.
    flags: Z
    */
    mem.r.A = mem.r.A ^ mem.r.A;
    mem.setFlag('F');
  },

  LD_C_A: function (mem) { // 0xE2
    /* Put A into address $FF00 + register C */
    let addr = 0xFF00 + mem.r.C;
    mem.writeByte(addr, mem.r.A);
  },

  ENABLE_CB: function (args) {},

  // Prefix CB
  RL_n: function (mem, n) { // 0x11
    /* Rotate n left through Carry flag */

    if (0b00010000 & mem.r.F == 0b00010000) {
      mem.r[n] = (mem.r[n] << 1 | 0b00000001) & 0x00FF;
    } else {
      mem.r[n] = (mem.r[n] << 1 | 0b11111110) & 0x00FF;
    }

    mem.setFlag('C', (0b10000000 & mem.r[n]) == 0b10000000);
    mem.setFlag('F', mem.r.A == 0);
  },

  BIT_7_H: function (mem) { // 0x7C
    mem.setFlag('Z', !(0b10000000 & mem.r.H));
  },
};

const opcodes = {
  '0x05': {
    original: 'DEC B',
    fn: 'DEC_reg',
    register: 'B',
    flags: 'Z1H',
    cycles: 4,
    PC: 1,
  },
  '0x06': {
    original: 'LD B,d8',
    fn: 'LD_REG_n',
    immediate8: true,
    register: 'B',
    flags: 'flagsZNHC',
    cycles: 8,
    PC: 2,
  },
  '0x0E': {
    original: 'LD C,d8',
    fn: 'LD_REG_n',
    register: 'C',
    cycles: 8,
    PC: 2,
  },
  '0x11': {
    original: 'LD DE,d16',
    fn: 'LD_REG_nn',
    register: 'DE',
    immediate16: true,
    cycles: 12,
    PC: 3,
  },
  '0x17': {
    original: 'RLA',
    fn: 'RL_n',
    register: 'A',
    cycles: 4,
    PC: 1,
  },
  '0x1A': {
    original: 'LD A,(DE)',
    fn: 'LD_A_DE',
    cycles: 8,
    PC: 1,
  },
  '0x20': {
    original: 'JR NZ,r8',
    fn: 'JRNZr8',
    immediate8: true,
    cycles: 8,
    PC: 2,
  },
  '0x21': {
    original: 'LD HL,d16',
    fn: 'LD_REG_nn',
    immediate16: true,
    register: 'HL',
    cycles: 12,
    PC: 3,
  },
  '0x22': {

  },
  '0x31': {
    original: 'LD SP,d16',
    fn: 'LD_REG_nn',
    immediate16: true,
    register: 'SP',
    cycles: 12,
    PC: 3,
  },
  '0x32': {
    original: 'LD (HL-),A',
    fn: 'LD_HL_m_A',
    cycles: 8,
    PC: 1,
  },
  '0x3E': {
    original: 'LD A,d8',
    fn: 'LD_REG_n',
    register: 'A',
    cycles: 8,
    PC: 2,
  },
  '0x4F': {
    original: 'LD C,A',
    fn: 'LD_r1_r2',
    registers: ['C', 'A'],
    cycles: 4,
    PC: 1,
  },
  '0x77': {
    original: 'LD (HL),A',
    fn: 'LD_HL_A',
    register: '',
    cycles: 8,
    PC: 1,
  },
  '0xAF': {
    original: 'XOR A',
    fn: 'XOR_A_n',
    cycles: 4,
    register: 'A',
    flags: ['Z'],
    PC: 1,
  },
  '0xC5': {
    original: 'PUSH BC',
    fn: 'PUSH_REG',
    register: 'BC',
    cycles: 16,
    PC: 1,
  },
  '0xC1': {
    original: 'POP BC',
    fn: 'POP_nn',
    registers: ['B', 'C'],
    cycles: 12,
    PC: 1,
  },
  '0xCB': {
    original: 'PREFIX CB',
    fn: 'ENABLE_CB',
    immediate8: true,
    cycles: 1,
    PC: 1,  // It's actually 4 but I'll let the second function the update that
  },
  '0xCD': {
    original: 'CALL a16',
    fn: 'CALL_nn',
    immediate16: true,
    cycles: 12,
    PC: 0,
  },
  '0xE0': {
    original: 'LDH (a8),A',
    fn: 'LDH_a8_REG',
    immediate8: true,
    register: 'A',
    cycles: 12,
    PC: 2,
  },
  '0xE2': {
    original: 'LD (C),A',
    fn: 'LD_C_A',
    cycles: 8,
    PC: 2,
  },
};

const cbOpcodes = {  // Prefix CB
  '0x11': {
    original: 'RL C',
    fn: 'RL_n',
    register: 'C',
    cycles: 8,
    PC: 1,
  },
  '0x7C': {
    original: 'BIT 7,H',
    fn: 'BIT_7_H',
    flags: ['Z'],
    cycles: 8,
    PC: 1,
  },
};

exports.run = function (mem, instruction) {

  let instr = `0x${sprintf('%02X', rom[pc])}`;

  if (!(instr in opcodes)) {
    throw `Instruction ${instr} in ${pc} not implemented.`;
  }

  let cmd = opcodes[instr];

  return pc + cmd.PC;
};

exports.CPU = class CPU {
  constructor(mem) {
    this.mem = mem;
    this.imp = imp;
  }

  getInstruction () {
    let addr = this.mem.r.PC;
    let opcodedInstruction = `0x${sprintf('%02X', this.mem.getByteAt(addr))}`;
    if (!(opcodedInstruction in opcodes)) {
      throw `Instruction ${opcodedInstruction} in ${this.mem.pc} not implemented.`;
    }

    return opcodes[opcodedInstruction];
  }

  getCBInstruction () {
    this.mem.r.PC += 1;
    let addr = this.mem.r.PC;
    let opcodedCBInstruction = `0x${sprintf('%02X', this.mem.getByteAt(addr))}`;
    if (!(opcodedCBInstruction in cbOpcodes)) {
      throw `Instruction ${opcodedCBInstruction} in ${this.mem.pc} not implemented [CB].`;
    }

    return cbOpcodes[opcodedCBInstruction];
  }

  display (command, args) {

    let addr = `0x${sprintf('%02X', this.mem.r.PC)}`;
    let output = `${addr}: ${command} | 0x${sprintf('%02X', this.mem.getCurrentByte())}`;
    if (typeof args === 'undefined') {
      output += '\n';
    } else {
      output += `with ${args}\n`;
    }

    $('#steps').prepend(output);
  }

  run() {
    /*
      Looks for instruction in memory located at PC
      Runs the instruction
      Updates registers
      Updates flags
      Updates PC
    */
    let cmd = this.getInstruction();
    let args = [];

    if (cmd.fn == 'ENABLE_CB') {
      cmd = this.getCBInstruction();
    }

    if ('register' in cmd) {
      args.push(cmd.register);
    } else if ('registers' in cmd) {
      args.concat(cmd.registers);
    }

    if ('immediate16' in cmd) {
      // This will be argument nn
      args.push(this.mem.getWordAt(this.mem.r.PC + 1));
    } else if ('immediate8' in cmd) {
      // This will be argument n
      args.push(this.mem.getByteAt(this.mem.r.PC + 1));
    }

    this.display(cmd.original);
    this.imp[cmd.fn](this.mem, args);

    this.mem.r.PC += cmd.PC;
    return this.mem.r.PC;
  }
};
