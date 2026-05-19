export interface HistoryEntry {
  id: number;
  input: string;
  output: string[];
}

let counter = 0;
export function createEntry(input: string, output: string[]): HistoryEntry {
  return { id: counter++, input, output };
}
