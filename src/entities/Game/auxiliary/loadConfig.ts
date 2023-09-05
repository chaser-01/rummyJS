import { readFileSync } from 'fs';
import * as path from 'path';

/**
 *  Loads and returns the config file, and assigns the specified type.
 * If no file is found, error is thrown and empty object is returned.
*/ 
export function loadConfigFile<ConfigFileType>(directory: string, title: string){
  try {
    const jsonString = readFileSync(path.resolve(directory, `${title}.json`), 'utf8');
    const data = JSON.parse(jsonString) as ConfigFileType;
    return data;
  }
  
  catch (error) {
    console.log(`fuck u`, directory)
    if (typeof error == "string") console.error(`Error loading JSON file: ${error}`);
    else if (error instanceof Error) console.error(`Error loading JSON file: ${error.message}`);
    return {} as ConfigFileType;
  }
}


