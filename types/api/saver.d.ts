import IInputOutputData from '../input-output-data';

namespace EditorJS.API {
  export interface Saver {
    save(): Promise<IInputOutputData>;
  }
}
