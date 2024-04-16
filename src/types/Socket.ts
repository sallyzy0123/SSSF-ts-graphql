
type ServerToClientEvents = {
  addAnimal: (message: string) => void;
  addSpecies: (message: string) => void;
}

type ClientToServerEvents = {
  update: (msg: string) => void;
}

export {ServerToClientEvents, ClientToServerEvents};
