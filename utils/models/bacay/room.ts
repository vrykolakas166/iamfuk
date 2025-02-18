// Define the type for a single project
interface Room {
  id: number;
  name: string;
  betAmount: number;
  players: Player[];
  games: Game[];
}
