const imp = {
  helpers: {
    HELLO_CPU: function () {
      return 'hello cpu';
    },

    resetFlags: function (flags) {
      for (let i = 0; i < flags.length; i++) {
        flags[i] = false;
      }
    },

    ADD_n1_n2: function (n1, n2, flags) {
      /*
        Add n1 + n2 (8bits).
        Update flags [Z, N, H, C]
        Returns:
          - result
      */
      this.resetFlags(flags);
      result = n1 + n2;

      if (result === 0) {
        flags[0] = true;
      }

      if (result > 0xff) {
        flags[3] = true;
      }

      if (((n1 & 0b00001111) + (n2 & 0b00001111)) > 0b00001111) {
        flags[2] = true;
      }

      return result;
    },

    ADD_16_nn1_nn2: function (nn1, nn2, flags) {
      /*
        Add nn1 + nn2 (16bits). Update flags [Z, N, H, C]
      */
      throw 'ADD_16_nn1_nn2 not implemented yet';
    },

    INC_n: function (n, flags) {
      /*
        Increments n (8bits). Update flags [Z, false, H, false]
      */

      let result = (n + 1) & 0x00FF;

      if (result === 0) {
        flags[0] = true;
      }

      if ((n & 0b00001111) === 0b00001111) {
        flags[2] = true;
      }

      return result;
    },

    XOR_n1_n2: function (n1, n2, flags) {
      /*
        n1 ^ n2 (8bits)
        Update flags [Z, false, false, false]
        Returns:
          - result
      */
      this.resetFlags(flags);
      result = n1 ^ n2;

      if (result == 0) {
        flags[0] = true;
      }

      return result;
    },
  },

  ADC_A_n: function (mem, n) {
    /*
      ADC A,n - Add n + Carry flag to A.
      n = A,B,C,D,E,H,L,(HL),#

      Flags affected:
      Z - Set if result is zero.
      N - Reset.
      H - Set if carry from bit 3.
      C - Set if carry from bit 7.
    */
    throw 'ADC_A_n not implemented yet';
  },

  ADD_A_n: function (mem, n) {
    /*
      A,n - Add n to A.
      n = A,B,C,D,E,H,L,(HL),#

      Flags affected:
      Z - Set if result is zero.
      N - Reset.
      H - Set if carry from bit 3.
      C - Set if carry from bit 7.
    */
    throw 'ADD_A_n not implemented yet';
  },

  ADD_HL_nn: function (mem, nn) {
    /*
      ADD HL,n - Add n to HL.
      	n = BC,DE,HL

      	Flags affected:
        Z - Not affected
        N - Reset.
        H - Set if carry from bit 11.
        C - Set if carry from bit 15.
    */
    throw 'ADD_HL_nn not implemented yet';
  },

  ADD_SP_n: function (mem, n) {
    /*
      ADD SP,n - Add n to Stack Pointer (SP).
      	n = one byte signed immediate value

      Flags affected:
      Z - Reset.
      N - Reset.
      H - Set or reset according to operation.
      C - Set or reset according to operation.
    */
    throw 'ADD_SP_n not implemented yet';
  },

  AND_n: function (mem, n) {
    /*
      AND n - Logically AND n with A, result in A.
      n = A,B,C,D,E,H,L,(HL),#

      Flags affected:
      Z - Set if result is zero.
      N - Reset.
      H - Set.
      C - Reset.
    */
    throw 'AND_n not implemented yet';
  },

  BIT_b_n: function (mem, r, b) {
    /*
      BIT b,r - Test bit b in register r.
      b = 0-7, r = A,B,C,D,E,H,L,(HL)

      Flags affected:
        Z - Set if bit b of register r is 0.
        N - Reset.
        H - Set.
        C - Not affected.
    */

    mem.r.resetFlags();
    mem.r.setFlag('H');

    if (b === 7) {
      mem.r.setFlag('Z', !(0b10000000 & mem.r[r]));
      return;
    } else if (b === 6) {
      mem.r.setFlag('Z', !(0b01000000 & mem.r[r]));
      return;
    } else if (b === 5) {
      mem.r.setFlag('Z', !(0b00100000 & mem.r[r]));
      return;
    } else if (b === 4) {
      mem.r.setFlag('Z', !(0b00010000 & mem.r[r]));
      return;
    } else if (b === 3) {
      mem.r.setFlag('Z', !(0b00001000 & mem.r[r]));
      return;
    } else if (b === 2) {
      mem.r.setFlag('Z', !(0b00000100 & mem.r[r]));
      return;
    } else if (b === 1) {
      mem.r.setFlag('Z', !(0b00000010 & mem.r[r]));
      return;
    } else if (b === 0) {
      mem.r.setFlag('Z', !(0b00000001 & mem.r[r]));
      return;
    }
  },

  CALL_nn: function (mem, nn) {
    /*
      CALL n - Push address of next instruction onto
      stack and then jump to address n.

      Flags affected:
      None
    */
    let addr = mem.r.PC + 3; // Address to push to stack

    mem.r.SP = mem.r.SP - 1;
    mem.writeByteAt(mem.r.SP, addr >> 8); // H part of addr

    mem.r.SP = mem.r.SP - 1;
    mem.writeByteAt(mem.r.SP, addr & 0x00FF); // L part of addr

    mem.r.PC = nn;
  },

  CALL_cc_nn: function (mem, cc, nn) {
    /*
    CALL cc,n     - Call address n if following condition is true:
    cc = NZ, Call if Z flag is reset.
    cc = Z,  Call if Z flag is set.
    cc = NC, Call if C flag is reset.
    cc = C,  Call if C flag is set.

    Flags affected:
    None
    */
    throw 'CALL_cc_nn not implemented yet';
  },

  CCF: function (mem) {
    /*
      CCF - Complement carry flag.
        If C flag is set then reset it.
        If C flag is reset then set it.

      Flags affected:
        Z - Not affected.
        N - Reset.
        H - Reset.
        C - Complemented.
    */
    throw 'CCF not implemented yet';
  },

  CP_n: function (mem, n) {
    /*
      CP n - Compare A with n.
      This is basically an A - n subtraction
      instruction but the results are thrown away.
      n = A,B,C,D,E,H,L,(HL),#
      Flags affected:
        Z - Set if result is zero. (Set if A = n)
        N - Set.
        H - Set if no borrow from bit 4.
        C - Set for no borrow. (Set if A < n.)
    */

    mem.r.resetFlags();
    if (['A', 'B', 'C', 'D', 'E', 'H', 'L'].indexOf(n) >= 0) {
      throw 'CP_n not implemented yet';
    } else if (n === 'HL') {
      throw 'CP_n not implemented yet';
    } else {
      if (mem.r.A === n) {
        mem.r.setFlag('Z', true);
      }

      mem.r.setFlag('N', true);

      if ((mem.r.A & 0b00001111) > (n & 0b00001111)) {
        mem.r.setFlag('H', true);
      }

      if (mem.r.A > n) {
        mem.r.setFlag('C', true);
      }
    }
  },

  CPL: function (mem) {
    /*
      CPL - Complement A register. (Flip all bits.)
      Flags affected:

        Z - Not affected.
        N - Set.
        H - Set.
        C - Not affected.
    */
    throw 'CPL not implemented yet';
  },

  DAA: function (mem) {
    /*
      DAA - Decimal adjust register A.
      This instruction adjusts register A so that the
      correct representation of Binary Coded Decimal
      (BCD) is obtained.

      Flags affected:
        Z - Set if register A is zero.
        N - Not affected.
        H - Reset.
        C - Set of reset according to operation.
    */
    throw 'DAA not implemented yet';
  },

  DEC_n: function (mem, n) {
    /*
      DEC n - Decrement register n.
      n = A,B,C,D,E,H,L,(HL)

      Flags affected:
        Z - Set if result is zero.
        N - Set.
        H - Set if no borrow from bit 4.
        C - Not affected.
    */
    let original;
    if (n === 'HL') {
      original = mem.getByteAt(mem.r.HL);
    } else {
      original = mem.r[n];
    }

    mem.r.resetFlags();
    if (original === 1) {
      mem.r.setFlag('Z', true);
    }

    if ((original & 0b00001111) > 1) {
      mem.r.setFlag('H', true);
    }

    let result = (original - 1) & 0x00FF;
    if (n == 'HL') {
      mem.writeByteAt(mem.r.HL, result);
    } else {
      mem.r[n] = result;
    }
  },

  DEC_nn: function (mem, nn) {
    /*
      DEC nn - Decrement register nn.
      nn = BC,DE,HL,SP

      Flags affected:
        None
    */
    throw 'DEC_nn not implemented yet';
  },

  DI: function (mem) {
    /*
      DI - Disable interrupts.

      Flags affected:
        None
    */
    throw 'DI not implemented yet';
  },

  EI: function (mem) {
    /*
      EI - Enable interrupts.
      This instruction enables the interrupts but not immediately.
      Interrupts are enabled after the instruction after EI is
      executed.
      Flags affected:
        None
    */
    throw 'EI not implemented yet';
  },

  INC_n: function (mem, n) {
    /*
      INC n - Increment register n.
      n = A,B,C,D,E,H,L,(HL)

      Flags affected:
        Z - Set if result is zero.
        N - Reset.
        H - Set if carry from bit 3.
        C - Not affected.
    */

    if (n === 'HL') {
      throw 'INC_n not implemented for HL';
    }

    mem.r.resetFlags();
    let result = (mem.r[n] + 1) & 0x00FF;

    if (result === 0) {
      mem.r.setFlag('Z', true);
    }

    if ((n & 0b00001111) === 0b00001111) {
      mem.r.setFlag('H', true);
    }

    mem.r[n] = result;
  },

  INC_nn: function (mem, nn) {
    /*
      INC nn - Increment register nn.
      n = BC,DE,HL,SP

      Flags affected:
        None
    */
    mem.r[nn] = (mem.r[nn] + 1) & 0x00FFFF;
  },

  JP_n: function (mem, n) {
    /*
      JP n - Jump to address n.
      n = two byte immediate value. (LSByte first)
      Flags affected:
        None
    */
    throw 'JP_n not implemented yet';
  },

  JP_cc_n: function (mem, cc, n) {
    /*
      JP cc,n - Jump to address n if following condition is true:
      n = two byte immediate value. (LSByte first.)
      cc = NZ, Jump if Z flag is reset.
      cc = Z,  Jump if Z flag is set.
      cc = NC, Jump if C flag is reset.
      cc = C,  Jump if C flag is set.
      Flags affected:
        None
    */

    let jump = false;

    if (cc === 'NZ' & !(mem.r.F & 0b10000000)) {
      jump = true;
    } else if (cc === 'Z' & (mem.r.F & 0b10000000)) {
      debugger;
      jump = true;
    } else if (cc === 'C' & (mem.r.C & 0b00010000)) {
      jump = true;
    } else if (cc === 'NC' & !(mem.r.C & 0b00010000)) {
      jump = true;
    }

    if (jump) {
      mem.r.PC = ((n + mem.r.PC) & 0x00FF);
    }
  },

  LD_A_n: function (mem, n) {
    /*
      LD A,n - Put value n into A.
      n = A,B,C,D,E,H,L,(BC),(DE),(HL),(nnnn),#
    */
    if (['BC', 'DE', 'HL'].indexOf(n) >= 0) {
      mem.r.A = mem.getByteAt(mem.r[n]);
    } else if (['A', 'B', 'C', 'D', 'E', 'H', 'L'].indexOf(n) >= 0) {
      mem.r.A = mem.r[n];
    } else {
      mem.r.A = n;
    }
  },

  LD_n_A: function (mem, n) {
    /*
      LD n,A - Put value A into n.
      n = A,B,C,D,E,H,L,(BC,(DE),(HL),(nnnn)
      Flags affected: None
    */
    if (['BC', 'DE', 'HL'].indexOf(n) >= 0) {
      mem.writeByteAt(mem.r[n], mem.r.A);
    } else if (['A', 'B', 'C', 'D', 'E', 'H', 'L'].indexOf(n) >= 0) {
      mem.r[n] = mem.r.A;
    } else {
      mem.writeByteAt(n, mem.r.A);
    }
  },

  LD_A_C: function (mem) {
    /*
      LD A,[C] - Put value at address $FF00 + register C into A.
    */
    throw 'LD_A_C not implemented yet';
  },

  LD_A_HLp: function (mem) {
    /*
      LD A,[HL+] - Same as LD A,[HLI].
    */
    throw 'LD_A_HLp not implemented yet';
  },

  LD_A_HLn: function (mem) {
    /*
      LD A,[HLI] - Put value at address HL into A. Increment HL.
    */
    throw 'LD_A_HLn not implemented yet';
  },

  LD_A_HLI: function (mem) {
    /*
      LD A,[HLI] - Put value at address HL into A. Increment HL.
      Flags affected: None
    */
    throw 'LD_A_HLI not implemented yet';
  },

  LD_A_HLD: function (mem) {
    /*
      LD A,[HLD] - Put value at address HL into A. Decrement HL.
      Flags affected: None
    */
    throw 'LD_A_HLD not implemented yet';
  },

  LD_C_A: function (mem) {
    /*
      LD [C],A - Put A into address $FF00 + register C.
    */
    mem.writeByteAt(mem.r.C + 0xFF00, mem.r.A);
  },

  LD_HLp_A: function (mem) {
    /*
      LD [HL+],A - Same as LD [HLI],A.
    */
    mem.writeByteAt(mem.r.HL, mem.r.A);
    mem.r.HL = (mem.r.HL + 1) & 0x00FFFF;
  },

  LD_HLn_A: function (mem) {
    /*
      LD [HL-],A - Same as LD [HLD],A.
    */
    mem.writeByteAt(mem.r.HL, mem.r.A);
    mem.r.HL = mem.r.HL - 1;
  },

  LD_HLI_A: function (mem) {
    /*
      LD [HLI],A - Put A into memory address HL. Increment HL.
    */
    throw 'LD_HLI_A not implemented yet';
  },

  LD_HLD_A: function (mem) {
    /*
      LD [HLD],A - Put A into memory address HL. Decrement HL.
    */
    throw 'LD_HLD_A not implemented yet';
  },

  LD_r1_r2: function (mem, r1, r2) {
    /*
      LD r1,r2 - Put value r2 into r1.
    */
    if (typeof r2 === 'string') {
      mem.r[r1] = mem.r[r2];
    } else {
      mem.r[r1] = r2;
    }
  },

  LD_n_nn: function (mem, n, nn) {
    /*
      LD n,nn - Put value nn into n.
      n = BC,DE,HL,SP
      nn = 16 bit immediate value
      Flags affected: None
    */
    mem.r[n] = nn;
  },

  LD_HL_SP_n: function (mem, n) {
    /*
      LD HL,[SP+n] - Put SP + n into HL.

      n = one byte signed immediate value

      Flags affected:

      Z - Reset.
      N - Reset.
      H - Set or reset according to operation.
      C - Set or reset according to operation.
    */
    throw 'LD_HL_SP_n not implemented yet';
  },

  LD_SP_HL: function (mem) {
    /*
      LD SP,HL - Put HL into Stack Pointer (SP).
      Flags affected: None
    */
    throw 'GENERIC_n not implemented yet';
  },

  LD_n_SP: function (mem, n) {
    /*
      LD [n],SP - Put Stack Pointer (SP) at address n.
      n = two byte immediate address
      Flags affected: None
    */
    throw 'LD_n_SP not implemented yet';
  },

  LDD_A_HL: function (mem, n) {
    /*
      LDD A,[HL] - Same as LD A,[HLD].
    */
    throw 'LDD_A_HL not implemented yet';
  },

  LDD_HL_A: function (mem, n) {
    /*
      LDD [HL],A - Same as LD [HLD],A.
    */
    throw 'LDD_HL_A not implemented yet';
  },

  LDH_n_A: function (mem, n) {
    /*
      LDH [n],A - Put A into memory address $FF00 + n.
      n = one byte immediate value
      Flags affected: None
    */
    mem.writeByteAt(0xFF00 + n, mem.r.A);
  },

  LDH_A_n: function (mem, n) {
    /*
      LDH A,[n] - Put memory address $FF00 + n into A.
      n = one byte immediate value
      Flags affected: None
    */
    debugger;
    mem.r.A = mem.getByteAt((0xFF00 + n) & 0xFFFF);
  },

  LDHL_SP_n: function (mem, n) {
    /*
      LDHL SP,n - Same as LD HL,[SP+n]
    */
    throw 'LDHL_SP_n not implemented yet';
  },

  LDI_A_HL: function (mem, n) {
    /*
      LDI A,[HL] - Same as LD A,[HLI].
    */
    throw 'LDI_A_HL not implemented yet';
  },

  LDI_HL_A: function (mem, n) {
    /*
      LDI [HL],A - Same as LD [HLI],A.
    */
    throw 'LDI_HL_A not implemented yet';
  },

  NOP: function (mem) {
    /*
    NOP - No operation.
    Flags affected: None
    */
    throw 'NOP not implemented yet';
  },

  OR_n: function (mem, n) {
    /*
      OR n - Logical OR n with register A, result in A.
      n = A,B,C,D,E,H,L,(HL),#
      Flags affected:
        Z - Set if result is zero.
        N - Reset.
        H - Reset.
        C - Reset.
    */
    throw 'OR_n not implemented yet';
  },

  POP_nn: function (mem, nn) {
    /*
      POP nn - Pop two bytes off stack into register pair nn.
      Increment Stack Pointer (SP) twice.
      nn = AF,BC,DE,HL
      Flags affected: None
    */
    mem.r[nn[1]] = mem.getByteAt(mem.r.SP);
    mem.r.SP = mem.r.SP + 1;
    mem.r[nn[0]] = mem.getByteAt(mem.r.SP);
    mem.r.SP = mem.r.SP + 1;
  },

  PUSH_nn: function (mem, nn) {
    /*
      PUSH nn - Push register pair nn onto stack.
      Decrement Stack Pointer (SP) twice.
      nn = AF,BC,DE,HL
      Flags affected: None
    */
    mem.r.SP = mem.r.SP - 1;
    mem.writeByteAt(mem.r.SP, mem.r[nn[0]]);

    mem.r.SP = mem.r.SP - 1;
    mem.writeByteAt(mem.r.SP, mem.r[nn[1]]);
  },

  RES_b_r: function (mem, n) {
    /*
      RES b,r - Reset bit b in register r.
      b = 0-7, r = A,B,C,D,E,H,L,(HL)
      Flags affected: None
    */
    throw 'RES_b_r not implemented yet';
  },

  RET: function (mem, n) {
    /*
      RET - Pop two bytes from stack & jump to that address.
      Flags affected: None
    */
    let C = mem.getByteAt(mem.r.SP);
    mem.r.SP +=  1;
    let P = mem.getByteAt(mem.r.SP);
    mem.r.SP +=  1;
    mem.r.PC = (P << 8) | C;
  },

  RET_cc: function (mem, cc) {
    /*
      RET cc - Return if following condition is true:
      cc = NZ, Return if Z flag is reset.
      cc = Z,  Return if Z flag is set.
      cc = NC, Return if C flag is reset.
      cc = C,  Return if C flag is set.
      Flags affected: None
    */
    throw 'RET_cc not implemented yet';
  },

  RETI: function (mem, n) {
    /*
      RETI - Pop two bytes from stack & jump to that
      address then enable interrupts.
      Flags affected: None
    */
    throw 'RETI not implemented yet';
  },

  RL_n: function (mem, n) {
    /*
      RL n - Rotate n left through Carry flag.
      n = A,B,C,D,E,H,L,(HL)

      Flags affected:
        Z - Set if result is zero.
        N - Reset.
        H - Reset.
        C - Contains old bit 7 data.
    */
    if (0b00010000 & mem.r.F == 0b00010000) {
      mem.r[n] = (mem.r[n] << 1 | 0b00000001) & 0x00FF;
    } else {
      mem.r[n] = (mem.r[n] << 1 | 0b11111110) & 0x00FF;
    }

    mem.r.resetFlags();
    mem.r.setFlag('C', (0b10000000 & mem.r[n]) == 0b10000000);
    mem.r.setFlag('F', mem.r.A == 0);
  },

  SUB_n: function (mem, n) {
    /*
      SUB n - Subtract n from A.
      n = A,B,C,D,E,H,L,(HL),#
      Flags affected:
        Z - Set if result is zero.
        N - Set.
        H - Set if no borrow from bit 4.
        C - Set if no borrow.
    */
    throw 'SUB_n not implemented yet';
  },

  SWAP_n: function (mem, n) {
    /*
      SWAP n - Swap upper & lower bits of n.
      n = A,B,C,D,E,H,L,(HL)
      Flags affected:
        Z - Set if result is zero.
        N - Reset.
        H - Reset.
        C - Reset.
    */
    throw 'SWAP_n not implemented yet';
  },

  GENERIC_n: function (mem, n) {
    /*
    */
    throw 'GENERIC_n not implemented yet';
  },

  XOR_n: function (mem, n) {
    /*
      XOR n - Logical exclusive OR n with
      register A, result in A.
      n = A,B,C,D,E,H,L,(HL),#
      Flags affected:
      Z - Set if result is zero.
      N - Reset.
      H - Reset.
      C - Reset.
    */
    mem.r.resetFlags();
    mem.r.A = mem.r.A ^ mem.r[n];

    if (mem.r.A === 0) {
      mem.r.setFlag('Z', true);
    }
  },

  NOT_IMPLEMENTED: function (mem, opcode) {
    throw `${opcode} not implemented`;
  },
};

exports.imp = imp;
