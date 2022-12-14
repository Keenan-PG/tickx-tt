import { boardRows } from "const";
import { useRecoilState } from "recoil";
import { boardState, gameOverState, playerState } from "state";
import { Board } from "types";

const testVHWin = (arr: number[]): boolean => /1{4}|2{4}/.test(arr.join(""));
// TODO: update regex above to account for diagonal
// example: diagonal right etc
// example win: (player 1, diagonal right simple - joined board): 1,22,12,1,12,1,2,1
// example win: (player 1, diagonal right simple - joined board 2x): 12212112121
// simple pattern: 1,*,1,*,*,1,*,*,*,1
// regex example: 1[12]1[12]{2}1[12]{3}1 ?

const testDiagonalWin = (filled: Board): boolean => {
  const boardString = filled.map((col) => col.join("").padEnd(6, "0")).join(",");

  return /([12])(\1{3}|(.{5}\1){3}|(.{6}\1){3}|(.{7}\1){3})/.test(boardString);
};

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
      testVHWin(newBoard[col]) || // Did win vertically
      testVHWin(newBoard.map((col) => col[row] || 0)) || // Did win horizontally
      // TODO: Did win diagonally
      testDiagonalWin(newBoard)
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
    console.log('newBoard with 0s', newBoard.map((col) => col.join("").padEnd(6, "0")).join(",")) // trying zeros in full board array for more specific regex?

    setBoard(newBoard);
  };
};

export default usePlayPiece;
