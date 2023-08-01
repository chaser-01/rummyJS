import { readFileSync } from 'fs';
import * as path from 'path';

// Loads and returns the config file for a particular variation of rummy from the specified directory.
// If none is found, error is thrown.
export function loadConfigFile(directory, title) {
  try {
    const jsonString = readFileSync(path.resolve(directory, `${title}.json`), 'utf8');
    const data = JSON.parse(jsonString);
    return data;
  }
  
  catch (error) {
    console.error(`Error loading JSON file: ${error.message}`);
    return null;
  }
}


