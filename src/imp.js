exports.imp = {
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

  BIT_b_n: function (mem, b, n) {
    /*
      BIT b,r - Test bit b in register r.
      b = 0-7, r = A,B,C,D,E,H,L,(HL)
      Flags affected:
      Z - Set if bit b of register r is 0.
      N - Reset.
      H - Set.
      C - Not affected.
    */
    throw 'BIT_b_n not implemented yet';
  },

  CALL_nn: function (mem, nn) {
    /*
      CALL n - Push address of next instruction onto
      stack and then jump to address n.

      Flags affected:
      None
    */
    throw 'CALL_n not implemented yet';
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
    throw 'CP_n not implemented yet';
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
    throw 'DEC_n not implemented yet';
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
    throw 'INC_n not implemented yet';
  },

  INC_nn: function (mem, n) {
    /*
      INC nn - Increment register nn.
      n = BC,DE,HL,SP

      Flags affected:
        None
    */
    throw 'INC_nn not implemented yet';
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
    throw 'XOR_n not implemented yet';
  },
};
