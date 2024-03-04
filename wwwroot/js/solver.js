class Solver {

    constructor(maze, orient, name)
    {
        this.maze = maze;
        this.grid = [];
        this.path = [ {x: maze.startX, y: maze.startY} ];
        this.direction = 2;
        this.orientation = orient;
        this.name = name;
        this.color = COLOR_WHITE;

        if (this.orientation < 0 || this.orientation > 2)
            this.orientation = 1;
        
        this.setColor();

        for (let i = 0; i < this.maze.rows; ++i)
        {
            this.grid.push([]);
            for (let j = 0; j < this.maze.columns; ++j)
            {
                this.grid[i].push(this.maze.grid[i][j]);
            }
        }
    }

    advanceRight()
    {
        let sx = this.getX();
        let sy = this.getY();

        if (sx >= this.maze.wall_right || sy >= this.maze.wall_bottom) return true;

        switch (this.direction)
        {
            case 1:
            {
                // Right
                if (this.grid[sy][sx + 1] == CH_SPACE)
                {
                    this.path.push( {x: sx + 1, y: sy} );
                    this.direction = 4;
                    return true;
                }

                // Up
                else if (this.grid[sy - 1][sx] == CH_SPACE)
                {
                    this.path.push( {x: sx, y: sy - 1} );
                    this.direction = 1;
                    return true;
                }

                // Left
                else if (this.grid[sy][sx - 1] == CH_SPACE)
                {
                    this.path.push( {x: sx - 1, y: sy} );
                    this.direction = 3;
                    return true;
                }

            } break;

            case 2:
            {
                // Left
                if (this.grid[sy][sx - 1] == CH_SPACE)
                {
                    this.path.push( {x: sx - 1, y: sy} );
                    this.direction = 3;
                    return true;
                }

                // Down
                else if (this.grid[sy + 1][sx] == CH_SPACE)
                {
                    this.path.push( {x: sx, y: sy + 1} );
                    this.direction = 2;
                    return true;
                }

                // Right
                else if (this.grid[sy][sx + 1] == CH_SPACE)
                {
                    this.path.push( {x: sx + 1, y: sy} );
                    this.direction = 4;
                    return true;
                }

            } break;

            case 3:
            {
                // Up
                if (this.grid[sy - 1][sx] == CH_SPACE)
                {
                    this.path.push( {x: sx, y: sy - 1} );
                    this.direction = 1;
                    return true;
                }

                // Left
                else if (this.grid[sy][sx - 1] == CH_SPACE)
                {
                    this.path.push( {x: sx - 1, y: sy} );
                    this.direction = 3;
                    return true;
                }

                // Down
                else if (this.grid[sy + 1][sx] == CH_SPACE)
                {
                    this.path.push( {x: sx, y: sy + 1} );
                    this.direction = 2;
                    return true;
                }

            } break;

            case 4:
            {
                // Down
                if (this.grid[sy + 1][sx] == CH_SPACE)
                {
                    this.path.push( {x: sx, y: sy + 1} );
                    this.direction = 2;
                    return true;
                }

                // Right
                else if (this.grid[sy][sx + 1] == CH_SPACE)
                {
                    this.path.push( {x: sx + 1, y: sy} );
                    this.direction = 4;
                    return true;
                }

                // Up
                else if (this.grid[sy - 1][sx] == CH_SPACE)
                {
                    this.path.push( {x: sx, y: sy - 1} );
                    this.direction = 1;
                    return true;
                }
            } break;

            default: { return false; }
        }

        return false;

    }

    advanceLeft()
    {
        let sx = this.getX();
        let sy = this.getY();

        if (sx >= this.maze.wall_right || sy >= this.maze.wall_bottom) return true;

        switch (this.direction)
        {
            case 1:
            {
                // Left
                if (this.grid[sy][sx - 1] == CH_SPACE)
                {
                    this.path.push( {x: sx - 1, y: sy} );
                    this.direction = 3;
                    return true;
                }

                // Up
                else if (this.grid[sy - 1][sx] == CH_SPACE)
                {
                    this.path.push( {x: sx, y: sy - 1} );
                    this.direction = 1;
                    return true;
                }

                // Right
                else if (this.grid[sy][sx + 1] == CH_SPACE)
                {
                    this.path.push( {x: sx + 1, y: sy} );
                    this.direction = 4;
                    return true;
                }



            } break;

            case 2:
            {
                // Right
                if (this.grid[sy][sx + 1] == CH_SPACE)
                {
                    this.path.push( {x: sx + 1, y: sy} );
                    this.direction = 4;
                    return true;
                }

                // Down
                else if (this.grid[sy + 1][sx] == CH_SPACE)
                {
                    this.path.push( {x: sx, y: sy + 1} );
                    this.direction = 2;
                    return true;
                }

                // Left
                else if (this.grid[sy][sx - 1] == CH_SPACE)
                {
                    this.path.push( {x: sx - 1, y: sy} );
                    this.direction = 3;
                    return true;
                }



            } break;

            case 3:
            {
                // Down
                if (this.grid[sy + 1][sx] == CH_SPACE)
                {
                    this.path.push( {x: sx, y: sy + 1} );
                    this.direction = 2;
                    return true;
                }

                // Left
                else if (this.grid[sy][sx - 1] == CH_SPACE)
                {
                    this.path.push( {x: sx - 1, y: sy} );
                    this.direction = 3;
                    return true;
                }

                // Up
                else if (this.grid[sy - 1][sx] == CH_SPACE)
                {
                    this.path.push( {x: sx, y: sy - 1} );
                    this.direction = 1;
                    return true;
                }



            } break;

            case 4:
            {
                // Up
                if (this.grid[sy - 1][sx] == CH_SPACE)
                {
                    this.path.push( {x: sx, y: sy - 1} );
                    this.direction = 1;
                    return true;
                }

                // Right
                else if (this.grid[sy][sx + 1] == CH_SPACE)
                {
                    this.path.push( {x: sx + 1, y: sy} );
                    this.direction = 4;
                    return true;
                }

                // Down
                else if (this.grid[sy + 1][sx] == CH_SPACE)
                {
                    this.path.push( {x: sx, y: sy + 1} );
                    this.direction = 2;
                    return true;
                }


            } break;

            default: { return false; }
        }

        return false;

    }

    draw()
    {
        let el = document.createElementNS(SVG_NAMESPACE, "polyline");
        let svg = document.getElementById(this.maze.svgTagId);
        
        let elPrevious = document.getElementById(this.name);

        if (elPrevious != null) svg.removeChild(elPrevious);


        let pointsStr = "";

        for (let pt of this.path)
        {
            let px = this.maze.columnPixels * (pt.x + 1 / 2);
            let py = this.maze.rowPixels * (pt.y + 1 / 2);
            pointsStr += (px + "," + py + " ");
        }

        el.setAttribute("points", pointsStr);
        el.setAttribute("fill", "none");
        el.setAttribute("stroke", this.color);
        el.setAttribute("stroke-width", this.maze.columnPixels);
        // el.setAttribute("stroke-opacity", 0.5);
        el.setAttribute("stroke-linecap", "round");
        el.setAttribute("id", this.name);
        svg.appendChild(el);

    }

    growTip()
    {
        let el = document.createElementNS(SVG_NAMESPACE, "line");
        let svg = document.getElementById(this.maze.svgTagId);
        
        let elPrevious = document.getElementById("solverTip");

        if (elPrevious != null) svg.removeChild(elPrevious);

        let x1 = this.maze.columnPixels * (this.getPrevX() + 1 / 2);   
        let y1 = this.maze.rowPixels * (this.getPrevY() + 1 / 2);   
        let x2 = this.maze.columnPixels * (this.getX() + 1 / 2);   
        let y2 = this.maze.rowPixels * (this.getY() + 1 / 2);   

        el.setAttribute("x1", x1);
        el.setAttribute("y1", y1);
        el.setAttribute("x2", x1);
        el.setAttribute("y2", y1);
        el.setAttribute("stroke", this.color);
        el.setAttribute("stroke-width", this.maze.columnPixels);
        // el.setAttribute("stroke-opacity", 0.5);
        el.setAttribute("stroke-linecap", "round");
        el.setAttribute("id", "solverTip");


        let animEl = document.createElementNS(SVG_NAMESPACE, "animate");
        animEl.setAttribute("attributeType", "XML");
        animEl.setAttribute("begin", "indefinite");

        if (x2 !== x1)
        {
            el.setAttribute("y2", y2);
            animEl.setAttribute("attributeName", "x2");

            animEl.setAttribute("from", x1);
            animEl.setAttribute("to", x2);

        }

        else if (y2 !== y1)
        {
            el.setAttribute("x2", x2);
            animEl.setAttribute("attributeName", "y2");

            animEl.setAttribute("from", y1);
            animEl.setAttribute("to", y2);
        }

        animEl.setAttribute("fill", "freeze");
        animEl.setAttribute("dur", "0.005s");

        el.appendChild(animEl);

        svg.appendChild(el);

        animEl.beginElement();
    }


    shrinkTip()
    {
        let el = document.createElementNS(SVG_NAMESPACE, "line");
        let svg = document.getElementById(this.maze.svgTagId);
        
        let elPrevious = document.getElementById("solverTip");

        if (elPrevious != null) svg.removeChild(elPrevious);

        let x1 = this.maze.columnPixels * (this.getPrevX() + 1 / 2);   
        let y1 = this.maze.rowPixels * (this.getPrevY() + 1 / 2);   
        let x2 = this.maze.columnPixels * (this.getX() + 1 / 2);   
        let y2 = this.maze.rowPixels * (this.getY() + 1 / 2);   

        el.setAttribute("x1", x1);
        el.setAttribute("y1", y1);
        el.setAttribute("x2", x1);
        el.setAttribute("y2", y1);
        el.setAttribute("stroke", this.color);
        el.setAttribute("stroke-width", this.maze.columnPixels);
        // el.setAttribute("stroke-opacity", 0.5);
        el.setAttribute("stroke-linecap", "round");
        el.setAttribute("id", "solverTip");


        let animEl = document.createElementNS(SVG_NAMESPACE, "animate");
        animEl.setAttribute("attributeType", "XML");
        animEl.setAttribute("begin", "indefinite");

        if (x2 !== x1)
        {
            el.setAttribute("y2", y2);
            animEl.setAttribute("attributeName", "x2");

            animEl.setAttribute("from", x2);
            animEl.setAttribute("to", x1);

        }

        else if (y2 !== y1)
        {
            el.setAttribute("x2", x2);
            animEl.setAttribute("attributeName", "y2");

            animEl.setAttribute("from", y2);
            animEl.setAttribute("to", y1);
        }

        animEl.setAttribute("fill", "freeze");
        animEl.setAttribute("dur", "0.005s");

        el.appendChild(animEl);

        svg.appendChild(el);

        animEl.beginElement();
    }

    hide()
    {
        let svg = document.getElementById(this.maze.svgTagId);        
        let elPrevious = document.getElementById(this.name);

        if (elPrevious != null) svg.removeChild(elPrevious);


    }

    isSolved()
    {
        return (this.getX() === this.maze.exitX && this.getY() === this.maze.exitY);
    }

    iterate()
    {

        switch (this.orientation)
        {
            // Picks right or left randomly
            case 0:
            {
                let roll = getRandom(2);
                if (roll == 0)
                {
                    if (this.advanceRight())
                    {
                        this.growTip();
                    } 
                    else
                    {
                        this.shrinkTip();
                        this.retreat();
                        this.draw();
                    }
                }

                else
                {
                    if (this.advanceLeft())
                    {
                        this.growTip();
                    } 
                    else
                    {
                        this.shrinkTip();
                        this.retreat();
                        this.draw();
                    }
                }
            } break;

            // Always goes right
            case 1:
            {
                if (this.advanceRight())
                {
                    this.growTip();
                } 
                else
                {
                    this.shrinkTip();
                    this.retreat();
                    this.draw();
                }
            } break;

            // Always goes left
            case 2:
            {
                if (this.advanceLeft())
                {
                    this.growTip();
                } 
                else
                {
                    this.shrinkTip();
                    this.retreat();
                    this.draw();
                }
            } break;

            default: {} break;
        }

    }

    retreat()
    {

        this.grid[this.getY()][this.getX()] = CH_WALL;

        this.path.pop();

        if (this.getX() > this.getPrevX())
            this.direction = 4;

        if (this.getX() < this.getPrevX())
            this.direction = 3;

        if (this.getY() > this.getPrevY())
            this.direction = 2;

        if (this.getY() < this.getPrevY())
            this.direction = 1;

    }

    solveMaze()
    {
        let while_control = 0;

        while (!this.isSolved())
        {
            if (while_control > MAX_SOLUTION_ITERATIONS)
            {
                console.log("Solver reached maximum iterations.");
                break;
            }
            ++while_control;

            switch (this.orientation)
            {
                case 0:
                {
                    let roll = getRandom(2);
                    if (roll == 0)
                    {
                        if (!this.advanceRight()) this.retreat();
                    }

                    else
                    {
                        if (!this.advanceLeft()) this.retreat();
                    }
                } break;

                case 1:
                {
                    if (!this.advanceRight()) this.retreat();
                } break;

                case 2:
                {
                    if (!this.advanceLeft()) this.retreat();
                } break;

                default: {} break;
            }

            if (this.isSolved())
            {
                console.log("Solved in " + while_control + " iterations.");
            }
        }

    }

    getX()
    {
        return this.path[this.path.length - 1].x;
    }

    getY()
    {
        return this.path[this.path.length - 1].y;
    }

    getPrevX()
    {
        return this.path[this.path.length - 2].x;
    }

    getPrevY()
    {
        return this.path[this.path.length - 2].y;
    }

    setColor()
    {
        this.color = COLOR_WHITE;

        if (this.orientation == 0)
            this.color = COLOR_GREEN;

        if (this.orientation == 1)
            this.color = COLOR_BLUE;

        if (this.orientation == 2)
            this.color = COLOR_RED;

        if (this.name == "compSol")
            this.color = COLOR_YELLOW;
    }
}