namespace EditorJS.API {
  export interface Events {
    emit(eventName: string, data: any): void;
    off(eventName: string, callback: (data?: any) => void): void;
    on(eventName: string, callback: (data?: any) => void): void;
  }
}
