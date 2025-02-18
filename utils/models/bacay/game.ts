interface Game {
  id: string;
  roomId: number;
  seq: number; // thứ tự ván
  gameDetails: GameDetail[];
  createdAt: Date;
  updatedAt: Date;
}
