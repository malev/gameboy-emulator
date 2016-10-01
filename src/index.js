import { sprintf } from 'sprintf-js';
import { data as bios } from 'bios';
import { CPU } from 'cpu';
import { Memory } from 'memory';
const $ = require('jquery');

let drawRegisters = function (mem) {
  let content = `<div class="register">A: ${sprintf('%08b', mem.r.A)} (0x${sprintf('%02x', mem.r.A)})</div>`;
  content += `<div class="register">F: ${sprintf('%08b', mem.r.F)} (0x${sprintf('%02x', mem.r.F)})</div>`;
  content += `<div class="register">B: ${sprintf('%08b', mem.r.B)} (0x${sprintf('%02x', mem.r.B)})</div>`;
  content += `<div class="register">C: ${sprintf('%08b', mem.r.C)} (0x${sprintf('%02x', mem.r.C)})</div>`;
  content += `<div class="register">D: ${sprintf('%08b', mem.r.D)} (0x${sprintf('%02x', mem.r.D)})</div>`;
  content += `<div class="register">E: ${sprintf('%08b', mem.r.E)} (0x${sprintf('%02x', mem.r.E)})</div>`;
  content += `<div class="register">H: ${sprintf('%08b', mem.r.H)} (0x${sprintf('%02x', mem.r.H)})</div>`;
  content += `<div class="register">L: ${sprintf('%08b', mem.r.L)} (0x${sprintf('%02x', mem.r.L)})</div>`;

  let flags = `<div class="register">PC: 0x${sprintf('%02x', mem.r.PC)} (${mem.r.PC})</div>`;
  flags += `<div class="register">SP: 0x${sprintf('%02x', mem.r.SP)} (${mem.r.SP})</div>`;
  flags += `<div class="register">Z: ${!!(0b10000000 & mem.r.F)}</div>`;
  flags += `<div class="register">N: ${!!(0b01000000 & mem.r.F)}</div>`;
  flags += `<div class="register">H: ${!!(0b00100000 & mem.r.F)}</div>`;
  flags += `<div class="register">C: ${!!(0b00010000 & mem.r.F)}</div>`;

  $('#registers').html(content);
  $('#flags').html(flags);
};

let drawInstruction = function (instr) {
  let content = [];

  content.push(`0x${sprintf('%02X', instr.address)}`);
  content.push(`| <b>${instr.original}</b>`);
  if (instr.argument) {
    content.push(` (0x${sprintf('%04X', instr.argument)})`);
  }

  content.push(`| <i>${sprintf('%02X', instr.opcode)}</i>`);
  content = content.join(' ');

  $('#instructions').append(`<div class="instruction" id="pos_${instr.address}">${content}</div>`);
};

let offset = 0;
let maxSteps = 110;
let currentStep = 0;
let mem = new Memory(bios);
let cpu = new CPU(mem);

while (currentStep < maxSteps) {
  drawInstruction(cpu.parseNext());
  currentStep++;
};

drawRegisters(mem);

// Reset memory and start excecution
let looping = false;
let commands = [];
mem = new Memory(bios);
cpu = new CPU(mem);
window.mem = mem;
window.cpu = cpu;

let start = function (maxSteps) {
  let currentStep = 0;
  while (looping & currentStep < maxSteps) {
    $('.instruction').removeClass('current');
    $(`#pos_${mem.r.PC}`).addClass('current');

    try {
      cpu.exec();
    } catch (e) {
      drawRegisters(mem);
      throw `Failed in ${mem.r.PC}. ${e}`;
    }

    currentStep++;
  }

  console.log('done');
};

$('#start').on('click', function (event) {
  if (parseInt($('#n-steps').val()) !== NaN) {
    maxSteps = parseInt($('#n-steps').val());
  } else {
    maxSteps = 24900;
  }

  looping = true;
  start(maxSteps);
});

$('#stop').on('click', function (event) {
  looping = false;
  console.log('Stopped');
});

$('#next').on('click', function (event) {
  console.log('Next');
  let content = `0x${sprintf('%02X', mem.r.PC)}`;
  let instr = cpu.exec();

  drawRegisters(mem);
  content += ` | <b>${instr.original}</b> (${instr.fn}) <i>(${sprintf('%02X', instr.opcode)})</i>
`;

  commands.push(content);
  if (commands.length > 10) {
    commands.shift();
  }

  $('#steps').html('');
  for (let cmd of commands) {
    $('#steps').append(cmd);
  }
});
