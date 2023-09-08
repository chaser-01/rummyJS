/**
 *  Loads and returns the config file, and assigns the specified type.
 * If no file is found, error is thrown and empty object is returned.
*/
export declare function loadConfigFile<ConfigFileType>(directory: string, title: string): ConfigFileType;
