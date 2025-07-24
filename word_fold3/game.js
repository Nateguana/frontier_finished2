const BOARDS = [
    {
        cells: [
            ["E", "L", "W", "Y", "C"],
            ["Y", "L", "O", "A", "N"],
            ["U", "B", "L", "E", "E"],
            ["E", "L", "P", "M", "V"],
            ["P", "U", "R", "A", "U"]],
        words: ["CYAN", "YELLOW", "PURPLE", "MAUVE", "BLUE"]
    },
    {
        cells: [
            ["E", "K", "O", "A", "P"],
            ["A", "W", "L", "I", "R"],
            ["N", "S", "F", "A", "T"],
            ["L", "E", "E", "R", "A"],
            ["A", "G", "G", "U", "J"]],
        words: ["TAPIR", "EAGLE", "JAGUAR", "SNAKE", "WOLF"]
    },
    {
        cells: [
            ["H", "C", "N", "A", "N"],
            ["Y", "R", "A", "A", "A"],
            ["R", "E", "A", "Y", "B"],
            ["F", "P", "P", "E", "R"],
            ["I", "G", "A", "P", "A"]],
        words: ["CHERRY", "PAPAYA", "BANANA", "PEAR", "FIG"]
    },
]

const THUNDER = new Audio("../assets/thunder.mp3")
const RAIN = new Audio("../assets/rain.mp3")
const JUMPSCARE = new Audio("../assets/jumpscare.mp3")


function try_play_rain() {
    try {
        RAIN.play()
    } catch {
        setTimeout(try_play_rain, 100)
    }
}

RAIN.addEventListener("canplaythrough", try_play_rain);

function make_cell_list() {
    let cells = Array.from(document.getElementById("cell-holder").children)
    let cell_board = [];
    for (let index = 0; index < 5; index++) {
        cell_board.push(cells.slice(index * 5, index * 5 + 5))
    }
    return cell_board;
}

const CELLS = make_cell_list();
console.log(CELLS)

function setup_game(board) {
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            CELLS[y][x].innerHTML = board[y][x];
        }
    }
}

setup_game(BOARDS[0].cells);
document.getElementById("words").innerHTML = "Words to spell: " + BOARDS[0].words.join(", ")

let selected_x = -1;
let selected_y = -1;

function select(x, y) {
    let cell = CELLS[y][x];
    if (cell.innerHTML.length > 0) {
        if (selected_x >= 0 && selected_y >= 0) {
            CELLS[selected_y][selected_x].classList.remove("selected");
        }
        selected_x = x;
        selected_y = y;
        cell.classList.add("selected");
    }
}

function unselect(x, y) {
    CELLS[y][x].classList.remove("selected");
    selected_x = -1;
    selected_y = -1;
}

function can_move(x, y) {
    let is_next_to = Math.abs(selected_x - x) + Math.abs(selected_y - y) == 1;

    return selected_x >= 0 && selected_y >= 0 && is_next_to && CELLS[y][x].innerHTML.length > 0;
}

function move(x, y) {
    CELLS[y][x].innerHTML = CELLS[selected_y][selected_x].innerHTML + CELLS[y][x].innerHTML;
    CELLS[selected_y][selected_x].innerHTML = "";
    select(x, y);
}

function on_click(x, y) {
    if (selected_x == x && selected_y == y) {
        unselect(x, y)
    } else if (can_move(x, y)) {
        move(x, y)
    } else {
        select(x, y)
    }
    try_jumpscare(x, y)
}


let angle = 0;
function on_frame() {
    angle += 1;
    document.body.style = "--angle: " + angle + "deg;--random:" + Math.random() + ";"
    requestAnimationFrame(on_frame);
}

on_frame()

let next_jumpscare = Math.floor(Math.random() * 4) + 2
function try_jumpscare(x, y) {
    if (next_jumpscare == 0) {
        jumpscare(x, y);
        next_jumpscare = Math.floor(Math.random() * 4) + 2
    } else {
        next_jumpscare -= 1
    }
}

let jumpscare_ele = document.getElementById("jumpscare");
function jumpscare(x, y) {
    jumpscare_ele.innerHTML = CELLS[y][x].innerHTML;
    jumpscare_ele.classList.remove("hidden");
    JUMPSCARE.play();
    setTimeout(() => {
        jumpscare_ele.classList.add("hidden");
    }, 100)
}


let thunder_ele = document.getElementById("thunder");
function thunder() {
    thunder_ele.classList.add("thunder")
    try {
        THUNDER.play();
    } catch {

    }
    setTimeout(() => {
        thunder_ele.classList.remove("thunder")
    }, 100)

    setTimeout(thunder, Math.random() * 8000 + 2000)
}

setTimeout(thunder, Math.random() * 8000 + 2000)