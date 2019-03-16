import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Square(props) {
    return (
        <button
            className="square"
            style={{backgroundColor: props.isWinSquare ? '#4CAF50' : '#FFFFFF'}}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                isWinSquare={this.props.winSquaresIndexes.includes(i)}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        const board = [];
        for (let i = 0; i < 3; i++) {
            const row = [];
            for (let j = 0; j < 3; j++) {
                row.push(this.renderSquare(3 * i + j));
            }
            board.push(<div className="board-row">{row}</div>);
        }
        return board;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                moves: Array(2).fill(null)
            }],
            stepNumber: 0,
            orderMovesListAscending: true,
            xIsNext: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const row = i < 3 ? 0 : i < 6 ? 1 : 2;
        const col = i % 3;
        const moves = [row, col];
        const squares = current.squares.slice();
        if (this.calculateWinner(squares).winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                moves: moves
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    toggleSortOrder = () => {
        this.setState({ orderMovesListAscending: !this.state.orderMovesListAscending })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    calculateWinner(squares) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
    
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return {
                    winner: squares[a],
                    winSquaresIndexes: [a, b, c]
                };
            }
        }
        return {
            winner: null,
            winSquaresIndexes: []
        };
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const order = this.state.orderMovesListAscending;
        const gameWon = this.calculateWinner(current.squares);
        const winner = gameWon.winner;
        const winSquaresIndexes = gameWon.winSquaresIndexes.slice();

        const moves = history.map((step, move) => {
            const desc = move ?
                `Go to move #${move}: ${move % 2 === 0 ? 'O' : 'X'} in (${step.moves[0]}-${step.moves[1]})` :
                'Go to game start';
            return (
                <li key={move}>
                    <button
                        onClick={() => this.jumpTo(move)}
                        style={{
                            // Bold the text of the selected step button
                            fontWeight:
                                (move === this.state.stepNumber) ?
                                    'bold' :
                                    'normal'
                        }}>
                        {desc}
                    </button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' +
                (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winSquaresIndexes={winSquaresIndexes}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button
                        onClick= {this.toggleSortOrder}
                    >{order ? 'Sort by newest' : 'Sort by oldest'}
                    </button>
                    <ul>{order ? moves : moves.reverse()}</ul>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);