import * as path from 'path';
import Brainfuck from './Brainfuck';

function main() {
  const bf = new Brainfuck();
  bf.runFile(path.resolve(__dirname, 'programs/helloworld.bf'));
}

main();