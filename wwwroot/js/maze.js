const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const SVG_WIDTH = 1204;
const SVG_HEIGHT = 900;
const CH_WALL = 'X';
const CH_SPACE = "-";
const MAX_SOLUTION_ITERATIONS = 50000;
const COLOR_RED = "#c01010";
const COLOR_GREEN = "#10c010";
const COLOR_BLUE = "#1010c0";
const COLOR_YELLOW = "#b0b010";
const COLOR_WHITE = "#ffffff";
const COLOR_PLAYER = "#ff1493";
const COLOR_PLAYER_TIP = "#00ffff";
const ROUNDING_LARGE = 4;
const ROUNDING_SMALL = 2;

const MAZE_WELCOME = "Welcome to the maze game! " 
     + "Click on the arena or \"Generate New\" to create a new maze.";

let raceTimer = 0;
let solution = null;
let sol = null;
let sol2 = null;
let solutionVisible = false;
let player = null;
let raceTimeoutID = null;
let rounding = ROUNDING_LARGE;

var Maze = {

    grid: [],
    startX: 0,
    startY: 0,
    exitX: 0,
    exitY: 0,

    complexity: 0,

    rows: 0,
    columns: 0,

    wall_left: 0,
    wall_top: 0,
    wall_right: 0,
    wall_bottom: 0,

    rowPixels: 0,
    columnPixels: 0,

    svgTagId: ""

};

function activateButtons() {

    document.getElementById("button_solve").removeAttribute("disabled");
    document.getElementById("button_solution").removeAttribute("disabled");
    document.getElementById("button_race").removeAttribute("disabled");
    document.getElementById("button_save").removeAttribute("disabled");

    document.getElementById("button_solve").addEventListener("click", playerSolve);
    document.getElementById("button_solution").addEventListener("click", computerSolve);

}

function beginRace() {

    document.getElementById("button_solve").setAttribute("disabled", true);
    if (sol != null ) sol.hide();
    if (sol2 != null) sol2.hide();
    let roll = getRandom(3);
    sol = new Solver(Maze, (roll + 1) % 3, "solverOne");
    sol2 = new Solver(Maze, (roll + 2) % 3, "solverTwo");

    race();

}

function computerSolve() {

    if (!solutionVisible)
    {
        solution = new Solver(Maze, 1, "compSol");
        solution.solveMaze();
        solution.draw();

        solutionVisible = true;
        document.getElementById("button_solution").innerHTML = "Hide Solution"; 
    }

    else
    {
        solution.hide();
        solutionVisible = false;
        document.getElementById("button_solution").innerHTML = "Show Solution"; 
    }

}

function deactivateButtons() {

    document.getElementById("button_solve").setAttribute("disabled", "true");
    document.getElementById("button_solution").setAttribute("disabled", "true");
    document.getElementById("button_race").setAttribute("disabled", "true");
    document.getElementById("button_save").setAttribute("disabled", "true");

    document.getElementById("button_solve").removeEventListener("click", playerSolve);
    document.getElementById("button_solution").removeEventListener("click", computerSolve);

}

function drawHorizontal(x, y, length, thickness, color)
{
    let el = document.createElementNS(SVG_NAMESPACE, "rect");
    let svg = document.getElementById(Maze.svgTagId);

    el.setAttribute("x", x);
    el.setAttribute("y", y);
    el.setAttribute("width", length);
    el.setAttribute("height", thickness);
    el.setAttribute("fill", color);
    el.setAttribute("rx", rounding);

    svg.appendChild(el);

}

function drawPlayer() {

    let el = document.createElementNS(SVG_NAMESPACE, "polyline");
    let el_tip1 = document.createElementNS(SVG_NAMESPACE, "circle");
    let el_tip2 = document.createElementNS(SVG_NAMESPACE, "circle");
    let svg = document.getElementById(Maze.svgTagId);
    
    let elPrevious = document.getElementById("playerPL");
    let elPrevious_t1 = document.getElementById("player_t1");
    let elPrevious_t2 = document.getElementById("player_t2");

    if (elPrevious != null) svg.removeChild(elPrevious);
    if (elPrevious_t1 != null) svg.removeChild(elPrevious_t1);
    if (elPrevious_t2 != null) svg.removeChild(elPrevious_t2);

    if (player == null) return;


    let pointsStr = "";

    for (let pt of player.points)
    {
        let px = Maze.columnPixels * (pt.x + 1 / 2);
        let py = Maze.rowPixels * (pt.y + 1 / 2);
        pointsStr += (px + "," + py + " ");
    }

    el.setAttribute("points", pointsStr);
    el.setAttribute("fill", "none");
    el.setAttribute("stroke", COLOR_PLAYER);
    el.setAttribute("stroke-width", Maze.columnPixels);
    el.setAttribute("id", "playerPL");
    svg.appendChild(el);

    let t1_x = Maze.columnPixels * (player.points[0].x + 1 / 2);
    let t1_y = Maze.rowPixels * (player.points[0].y + 1 / 2);
    el_tip1.setAttribute("cx", t1_x);
    el_tip1.setAttribute("cy", t1_y);
    el_tip1.setAttribute("r", Maze.columnPixels / 2);
    el_tip1.setAttribute("fill", COLOR_PLAYER_TIP);
    el_tip1.setAttribute("id", "player_t1");
    svg.appendChild(el_tip1);

    let t2_x = Maze.columnPixels * (player.points[player.points.length - 1].x + 1 / 2);
    let t2_y = Maze.rowPixels * (player.points[player.points.length - 1].y + 1 / 2);
    el_tip2.setAttribute("cx", t2_x);
    el_tip2.setAttribute("cy", t2_y);
    el_tip2.setAttribute("r", Maze.columnPixels / 2);
    el_tip2.setAttribute("fill", COLOR_PLAYER_TIP);
    el_tip2.setAttribute("id", "player_t2");
    svg.appendChild(el_tip2);

}

function drawVertical(x, y, length, thickness, color)
{
    let el = document.createElementNS(SVG_NAMESPACE, "rect");
    let svg = document.getElementById(Maze.svgTagId);

    el.setAttribute("x", x);
    el.setAttribute("y", y);
    el.setAttribute("width", thickness);
    el.setAttribute("height", length);
    el.setAttribute("fill", color);
    el.setAttribute("rx", rounding);

    svg.appendChild(el);

}

function getRandom(n) {
    return Math.floor(Math.random() * n);
}

function keyDown(event) {

    event.preventDefault();

    player.direction = 0;
    let checkX = player.points[player.points.length - 1].x;
    let checkY = player.points[player.points.length - 1].y;

    if (checkX == Maze.exitX && checkY == Maze.exitY)
    {
        console.log("Maze solved!");
        setText("Great job, you solved the maze!");
        window.removeEventListener("keydown", keyDown, true);
        return;
    }

    switch (event.keyCode)
    {
        case 37:
        {
            player.direction = 3;
            --checkX;
            // console.log("Movement left!");
        } break;

        case 38:
        {
            player.direction = 1;
            --checkY;
            // console.log("Movement up!");
        } break;

        case 39:
        {
            player.direction = 4;
            ++checkX;
            // console.log("Movement right!");
        } break;

        case 40:
        {
            player.direction = 2;
            ++checkY;
            // console.log("Movement down!");
        } break;

        default: {} break;
    }

    if (checkX < 0 || checkY < 0) return;

    if (player.points.length > 2 &&
        (checkX == player.points[player.points.length - 2].x &&
        checkY == player.points[player.points.length - 2].y) )
    {
        player.points.pop();
    }

    else if (player.direction > 0 && Maze.grid[checkY][checkX] !== CH_WALL)
        player.grow();

    drawPlayer();

}

function keyUp(event) {
    player.direction = 0;
}

function mouse(event) {

    player.direction = 0;
    let checkX = player.points[player.points.length - 1].x;
    let checkY = player.points[player.points.length - 1].y;

    if (event.movementX > 1)
    {
        player.direction = 4;
        ++checkX;
        console.log("Movement right!");
    }

    if (event.movementX < -1)
    {
        player.direction = 3;
        --checkX;
        console.log("Movement left!");
    }

    if (event.movementY > 1)
    {
        player.direction = 2;
        ++checkY;
        console.log("Movement down!");
    }

    if (event.movementY < -1)
    {
        player.direction = 1;
        --checkY;
        console.log("Movement up!");
    }

    if (player.points.length > 2 &&
        checkX == player.points[player.points.length - 2].x &&
        checkY == player.points[player.points.length - 2].y)
    {
        player.points.pop();
    }

    else if (player.direction > 0 && Maze.grid[checkY][checkX] !== CH_WALL)
        player.grow();

    drawPlayer();

}

function paintBackground(color, svgName) {

    let el = document.createElementNS(SVG_NAMESPACE, "rect");
    let svg = document.getElementById(svgName);
    svg.innerHTML = "";

    el.setAttribute("x", 0);
    el.setAttribute("y", 0);
    el.setAttribute("width", SVG_WIDTH);
    el.setAttribute("height", SVG_HEIGHT);
    el.setAttribute("fill", color);

    svg.appendChild(el);

    el = document.createElementNS(SVG_NAMESPACE, "span");
    el.setAttribute("id", "gridLines");
    svg.appendChild(el);

}

function paintMaze(spaceColorString, wallColorString) {

    let svg = document.getElementById(Maze.svgTagId);
    svg.innerHTML = "";
    paintBackground(spaceColorString, Maze.svgTagId);

    // Horizontal wall sections
    for (let i = 0; i < Maze.rows; ++i)
    {
        let sectionLength = 0;
        let sectionX = 0;
        let sectionY = i * Maze.rowPixels;

        for (let j = 0; j < Maze.columns; ++j)
        {
            if (Maze.grid[i][j] == CH_WALL)
            {
                if (sectionLength == 0)
                    sectionX = j * Maze.columnPixels;

                ++sectionLength;
            }

            if (Maze.grid[i][j] != CH_WALL || j == Maze.columns - 1)
            {
                if (sectionLength > 1)
                {
                    drawHorizontal(
                        sectionX,
                        sectionY,
                        sectionLength * Maze.columnPixels,
                        Maze.rowPixels,
                        wallColorString);
                }

                sectionLength = 0;
            }
        }
    }

    // Vertical wall sections
    for (let i = 0; i < Maze.columns; ++i)
    {
        let sectionLength = 0;
        let sectionX = i * Maze.columnPixels;
        let sectionY = 0;

        for (let j = 0; j < Maze.rows; ++j)
        {
            if (Maze.grid[j][i] == CH_WALL)
            {
                if (sectionLength == 0)
                    sectionY = j * Maze.rowPixels;

                ++sectionLength;
            }

            if (Maze.grid[j][i] != CH_WALL || j == Maze.rows - 1)
            {
                if (sectionLength > 1)
                {
                    drawVertical(
                        sectionX,
                        sectionY,
                        sectionLength * Maze.rowPixels,
                        Maze.columnPixels,
                        wallColorString);
                } 

                sectionLength = 0;
            }
        }
    }
}

function playerSolve() {

    setText("Use arrow keys to solve the maze.");
    player = new Player(Maze.startX, Maze.startY);
    player.grow();

    // window.addEventListener("mousemove", mouse, true);
    window.addEventListener("keydown", keyDown, true);
    document.getElementById(Maze.svgTagId).addEventListener("touchmove", touch, false);

    drawPlayer();

}

function pointEquals(p1, p2)
{
    return (p1.x == p2.x && p1.y == p2.y);
}

function race() {

    if (sol == null || sol2 == null)
    {
        return;
    }

    sol.draw();
    sol.iterate();

    sol2.draw();
    sol2.iterate();

    if (!sol.isSolved() && !sol2.isSolved())
    {
        raceTimeoutID = window.setTimeout(race, 5);
    }

    else
    {
        if (sol.isSolved()) sol.draw();
        if (sol2.isSolved()) sol2.draw();

        setText(MAZE_WELCOME);
        terminateRace();
    }

}

function raceInProgress()
{
    if (sol != null && sol2 != null && !sol.isSolved() && !sol2.isSolved())
        return true;

    else
        return false;
}

function setMaze(gridString, wallColorString, spaceColorString, complexity, svgId) {

    if (solutionVisible)
        computerSolve();

    Maze.grid = [];
    Maze.svgTagId = svgId;
    var j = 0;
    Maze.grid.push([]);

    for (var i = 0; i < gridString.length - 1; ++i)
    {
        if (gridString[i] == '|')
        {
            Maze.grid.push([]);
            ++j;
        }

        else if (gridString[i] == CH_SPACE || gridString[i] == CH_WALL)
        {
            Maze.grid[j].push(gridString[i]);
        }
    }

    Maze.complexity = complexity;
    Maze.rows = complexity % 2 == 1 ? complexity * 3 : (complexity * 3) + 1;
    Maze.columns = (complexity * 4) + 1;

    Maze.wall_right = Maze.columns - 1;
    Maze.wall_bottom = Maze.rows - 1;

    Maze.rowPixels = SVG_HEIGHT / Maze.rows;
    Maze.columnPixels = SVG_WIDTH / Maze.columns;

    for (var i = 0; i < Maze.grid[0].length; ++i)
    {
        if (Maze.grid[0][i] == CH_SPACE)
        {
            Maze.startX = i;
            Maze.startY = 0;
        }

        // Exit on bottom
        if (Maze.grid[Maze.rows - 1][i] == CH_SPACE)
        {
            Maze.exitX = i;
            Maze.exitY = Maze.rows - 1;
        }
    }

    // Exit on right
    for (var j = 0; j < Maze.grid.length; ++j)
    {
        if (Maze.grid[j][Maze.columns - 1] == CH_SPACE)
        {
            Maze.exitX = Maze.columns - 1;
            Maze.exitY = j;
        }
    }

    rounding = (complexity < 20) ? ROUNDING_LARGE : ROUNDING_SMALL;

    paintMaze(spaceColorString, wallColorString);

}

function setText(str) {
    document.getElementById("maze-text").innerText = str;
}

function terminateRace() {

    sol = null;
    sol2 = null;

    var el = document.getElementById("button_solve");

    if (el !== null)
        el.removeAttribute("disabled");


}

function touch(event) {
    event.preventDefault();
}