const $ = require('jquery');
const sprintf = require('sprintf-js').sprintf;
const bios = require('bios').data;
const CPU = require('cpu').CPU;
const Memory = require('memory').Memory;

let drawRom = function () {
  let output = '';
  for (let index = 0; index < bios.length; index++) {
    output += `<div class="element pc-${index}">0x${sprintf('%02X', bios[index])}</div>`;
  }

  $('#rom').html(output);
};

let drawRegisters = function (pc=0) {
  $('#registers').html(`PC: ${sprintf('%02X', pc)}`);
};

drawRom();
drawRegisters(0);

let offset = 0;
let maxSteps = 30;
let currentStep = 0;
let mem = new Memory(bios);
let cpu = new CPU(mem);

while (currentStep < maxSteps) {
  console.log(`PC at ${mem.r.PC + offset}: 0x${sprintf('%02X', mem.getByteAt(mem.r.PC + offset))}`);
  cpu.run();
  currentStep++;
};
