import { readFileSync } from 'fs';

// Loads and returns the config file for a particular varation of rummy. If none is found, error is thrown.
export function loadConfigFile(title) {
  try {
    const jsonString = readFileSync(`${title}.json`, 'utf8');
    const data = JSON.parse(jsonString);
    return data;
  } 
  
  catch (error) {
    console.error(`Error loading JSON file: ${error.message}`);
    return null;
  }
}


