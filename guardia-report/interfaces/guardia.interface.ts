// guardia-report/interfaces/guardia.interface.ts
export interface Guardia {
  id: string;
  date: string;
  state: string;
  guardChief: {
    id: string;
    name: string;
    lastname: string;
    email: string;
  };
  delegation: {
    id: string;
    name: string;
  };
}