import * as fs from 'fs';

export default class Brainfuck {
  private tape: Array<number>;
  private pointer: number;
  debug: boolean;

  constructor() {
    this.tape = [0];
    this.pointer = 0;
    this.debug = false;
  }

  private movePointer(dir: number): void {
    const newPointer = this.pointer + dir;
    if (newPointer < 0) {
      return;
    }
    if (!this.tape[newPointer]) {
      this.tape[newPointer] = 0;
    }

    this.pointer = newPointer;
  }

  private outputCharacter(): void {
    const character = String.fromCharCode(this.tape[this.pointer]);
    process.stdout.write(character);
  }
  
  private buildBracketMap(commands: Array<string>): object {
    const bracketMap = {};
    const bracketStack = [];

    for (const [position, command] of commands.entries()) {
      if (command === '[') {
        bracketStack.push(position);
      }

      if (command === ']') {
        const start = <number> bracketStack.pop();
        bracketMap[start] = position;
        bracketMap[position] = start;
      }
    }

    return bracketMap;
  }
  
  run(program: string, input: string = ''): void {
    const splitted = program.split('');
    const programFiltered = splitted.filter(char => '><+-.,[]'.includes(char));

    const commands: Array<string> = programFiltered;
    const bracketMap = this.buildBracketMap(commands);

    let position = 0;
    let inputPos = 0;

    while (position < commands.length) {
      const command = commands[position];

      if (command === '>') {
        this.movePointer(1);
      }

      if (command === '<') {
        this.movePointer(-1);
      }
      
      if (command === '+') {
        this.tape[this.pointer]++;
      }

      if (command === '-') {
        this.tape[this.pointer]--;
      }

      if (command === '.') {
        this.outputCharacter();
      }

      if (command === ',') {
        if (inputPos === input.length) {
          this.tape[this.pointer] = 10;
        } else {
          this.tape[this.pointer] = input.charCodeAt(inputPos);
          inputPos++;
        }
      }

      if (command === '[' && this.tape[this.pointer] === 0) {
        position = bracketMap[position];
      }

      if (command === ']' && this.tape[this.pointer] !== 0) {
        position = bracketMap[position];
      }

      position++;
    }

    if (this.debug) {
      this.showTape();
      this.showPointer();
    }
  }
  
  runFile(filePath: string, input: string = ''): void {
    fs.exists(filePath, () => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          throw err;
        }

        this.run(data, input);
      });
    });
  }

  showTape(): void {
    console.log(`[${this.tape.join(', ')}]`);
  }

  showPointer(): void {
    console.log(`Pointer is at: ${this.pointer}`);
  }
}