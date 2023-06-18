declare module 'nativeshare' {
    export default class NativeShare {
      constructor(config?: any);
      setConfig(config: any): void;
      setShareData(shareData: any): void;
      call(command?: string): void;
    }
  }
  