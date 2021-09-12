type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose';
export interface ILogger {
  log(message: any, ...optionalParams: any[]): any;
  error(message: any, ...optionalParams: any[]): any;
  warn(message: any, ...optionalParams: any[]): any;
  debug?(message: any, ...optionalParams: any[]): any;
  verbose?(message: any, ...optionalParams: any[]): any;
  setLogLevels?(levels: LogLevel[]): any;
}

export class ConsoleLogger implements ILogger {
  // eslint-disable-next-line class-methods-use-this
  log(message: any, ...optionalParams: any[]) {
    console.log(message, ...optionalParams);
  }

  // eslint-disable-next-line class-methods-use-this
  error(message: any, ...optionalParams: any[]) {
    console.error(message, ...optionalParams);
  }

  // eslint-disable-next-line class-methods-use-this
  warn(message: any, ...optionalParams: any[]) {
    console.warn(message, ...optionalParams);
  }
}
