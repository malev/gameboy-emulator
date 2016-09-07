const sprintf = require('sprintf-js').sprintf;
const opcodes = require('opcodes').opcodes;
const cbOpcodes = require('opcodes').cbOpcodes;
const imp = require('imp').imp;

exports.CPU = class CPU {
  constructor(mem) {
    this.mem = mem;
    this.imp = imp;
    this.opcodes = opcodes;
    this.cbOpcodes = cbOpcodes;
  }

  getInstruction () {
    let addr = this.mem.r.PC;
    let opcodedInstruction = `0x${sprintf('%02X', this.mem.getByteAt(addr))}`;
    if (!(opcodedInstruction in this.opcodes)) {
      throw `Instruction ${opcodedInstruction} in 0x${sprintf('%02X', addr)} not implemented.`;
    }

    let instruction = this.opcodes[opcodedInstruction];
    instruction.opcode = opcodedInstruction;
    return instruction;
  }

  getCBInstruction () {
    this.mem.r.PC += 1;
    let addr = this.mem.r.PC;
    let opcodedCBInstruction = `0x${sprintf('%02X', this.mem.getByteAt(addr))}`;
    if (!(opcodedCBInstruction in this.cbOpcodes)) {
      throw `Instruction ${opcodedCBInstruction} in ${this.mem.pc} not implemented [CB].`;
    }

    let instruction = this.cbOpcodes[opcodedCBInstruction];
    instruction.opcode = opcodedCBInstruction;
    return instruction;
  }

  getInstructionWithArguments () {
    let instruction = this.getInstruction();
    let args = [];

    if (instruction.fn == 'ENABLE_CB') {
      instruction = this.getCBInstruction();
    }

    if ('register' in instruction) {
      args.push(instruction.register);
    }

    if ('registers' in instruction) {
      args = args.concat(instruction.registers);
    }

    if ('other' in instruction) {
      args.push(instruction.other);
    }

    if ('immediate16' in instruction) {
      // This will be argument nn
      args.push(this.mem.getWordAt(this.mem.r.PC + 1));
    } else if ('immediate8' in instruction) {
      // This will be argument n
      args.push(this.mem.getByteAt(this.mem.r.PC + 1));
    }

    return [instruction, args];
  }

  parseNext () {
    if ((0x93 < this.mem.r.PC) & (this.mem.r.PC < 0xE0)) {
      this.mem.r.PC = 0xE0;
    }

    let temp = this.getInstructionWithArguments();
    let instruction = temp[0];
    instruction.address = this.mem.r.PC;
    // let args = temp[1];

    if (instruction.PC === 0) {
      this.mem.r.PC += 1;
    } else {
      this.mem.r.PC += instruction.PC;
    }

    return instruction;
  }

  exec () {
    let temp = this.getInstructionWithArguments();
    let instruction = temp[0];
    let args = temp[1];

    // Arguments order: [register, other, immediate]
    if (typeof this.imp[instruction.fn] === 'function') {
      this.imp[instruction.fn](this.mem, ...args);
    } else {
      console.log(`${instruction.original} ${instruction.fn} ${args}`);
      throw `${instruction.fn} not defined.`;
    }

    this.mem.r.PC += instruction.PC;
    return instruction;
  }
};
