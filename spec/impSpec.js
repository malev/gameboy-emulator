let imp = require('../src/imp').imp;
let helpers = imp.helpers;
const Memory = require('../src/memory').Memory;

describe('helpers', function () {
  it('says hello', function (done) {
    expect(helpers.HELLO_CPU()).toBe('hello cpu');
    done();
  });

  describe('ADD_n1_n2', function () {
    it('Add 1 + 1', function (done) {
      let flags = [true, false, false, false];
      let result = helpers.ADD_n1_n2(0x0001, 0x0001, flags);

      expect(result).toBe(0x0002);
      expect(flags).toEqual([false, false, false, false]);
      done();
    });

    it('Add 0 + 0', function (done) {
      let flags = [false, false, false, false];
      let result = helpers.ADD_n1_n2(0, 0, flags);

      expect(result).toBe(0);
      expect(flags).toEqual([true, false, false, false]);
      done();
    });

    it('Add 0 + 0', function (done) {
      let flags = [false, false, false, false];
      let result = helpers.ADD_n1_n2(0x0f, 0x01, flags);

      expect(result).toBe(0x10);
      expect(flags).toEqual([false, false, true, false]);
      done();
    });

    it('Add 0 + 0', function (done) {
      let flags = [false, false, false, false];
      let result = helpers.ADD_n1_n2(0xff, 1, flags);

      expect(result).toBe(256); // TODO: verify this!
      expect(flags).toEqual([false, false, true, true]);
      done();
    });
  });

  describe('INC_n', function () {
    it('Instruction 1', function (done) {
      let flags = [false, false, false, false];
      let result = helpers.INC_n(1, flags);

      expect(result).toBe(2);
      expect(flags).toEqual([false, false, false, false]);
      done();
    });

    it('INC_n 0x0f', function (done) {
      let flags = [false, false, false, false];
      let result = helpers.INC_n(0x0f, flags);

      expect(result).toBe(0x10);
      expect(flags).toEqual([false, false, true, false]);
      done();
    });
  });

  describe('XOR_n1_n2', function () {
    it('XOR 1 ^ 2', function (done) {
      let flags = [false, false, false, false];
      let result = helpers.XOR_n1_n2(1, 2, flags);

      expect(result).toBe(3);
      expect(flags).toEqual([false, false, false, false]);
      done();
    });

    it('XOR 4 ^ 4', function (done) {
      let flags = [false, false, false, false];
      let result = helpers.XOR_n1_n2(4, 4, flags);

      expect(result).toBe(0);
      expect(flags).toEqual([true, false, false, false]);
      done();
    });
  });

  describe('CP_n', function () {
    it('A: 1, n: 1', function (done) {
      mem = new Memory([]);
      mem.r.A = 1;

      imp.CP_n(mem, 1);

      expect(mem.r.F).toEqual(0b11000000);
      done();
    });

    // it('A: 3, n: 2', function (done) {
    //   mem = new Memory([]);
    //   mem.r.A = 3;
    //
    //   imp.CP_n(mem, 2);
    //
    //   console.log(mem.r.F);
    //   expect(mem.r.F).toEqual(0b00010000);
    //   done();
    // });
  });
});
