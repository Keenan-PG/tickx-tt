import { boardRows } from "const";
import { useRecoilState } from "recoil";
import { boardState, gameOverState, playerState } from "state";

const testWin = (arr: number[]): boolean => /1{4}|2{4}/.test(arr.join(""));
// TODO: update regex above to account for diagonal
// example: diagonal right etc
// example win: (player 1, diagonal right simple - joined board): 1,22,12,1,12,1,2,1

const usePlayPiece = () => {
  const [board, setBoard] = useRecoilState(boardState);
  const [player, setPlayerTurn] = useRecoilState(playerState);
  const [gameOver, setGameOver] = useRecoilState(gameOverState);

  return (col: number) => {
    // Prevent adding a piece when the game is over
    if (gameOver) {
      return;
    }

    // Prevent adding a piece when the column is full
    if (board[col].length === boardRows) {
      return;
    }

    // Play piece (non mutating)
    const newBoard = board.map((column, i) =>
      i === col ? [...column, player] : column
    );

    const row = newBoard[col].length - 1;

    if (
      testWin(newBoard[col]) || // Did win vertically
      testWin(newBoard.map((col) => col[row] || 0)) // Did win horizontally
      // TODO: Did win diagonally
    ) {
      setGameOver(true);
    } else {
      setPlayerTurn(player === 1 ? 2 : 1);
    }

    // figuring out structure / how wins are done
    console.log('newBoard[col]', newBoard[col])
    console.log('newBoard[col] joined', newBoard[col].join("")) // passed into testWin and joined before regex in testWin
    console.log('newBoard.map((col) => col[row] || 0)', newBoard.map((col) => col[row] || 0)) 
    console.log('newBoard.map((col) => col[row] || 0) joined', newBoard.map((col) => col[row] || 0).join("")) // passed into testWin and joined before regex in testWin
    console.log('newBoard', newBoard) // testing what newboard looks like
    console.log('newBoard joined', newBoard.join("")) // testing what newboard joined looks like

    setBoard(newBoard);
  };
};

export default usePlayPiece;
