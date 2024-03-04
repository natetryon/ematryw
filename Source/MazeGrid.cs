using System;
using System.Collections.Generic;

public class MazeGrid
{
    public static readonly int COMPLEXITY_DEFAULT = 7;
    public static readonly int COMPLEXITY_MIN = 5;
    public static readonly int COMPLEXITY_MAX = 61;
    public static readonly int MAX_ITERATIONS = 50000;
    public readonly int BRANCH_PERCENT = 10;
    public readonly char CH_WALL = 'X';
    public readonly char CH_SPACE = '-';

    public int complexity;
    public List<MazePath> paths;
    public List<MazePath> branches;
    public int rows;
    public int columns;
    public int wall_left = 0;
    public int wall_right = 0;
    public int wall_top;
    public int wall_bottom;
    public int while_control = 0;
    public GridPoint startPoint;
    public GridPoint exitPoint;
    public int startX;
    public int startY;
    public int exitX;
    public int exitY;
    public Random rand;

    public bool exitOnRight;

    public char[,] grid { get; }
    public ColorRGB wallColor { get; set; }
    public ColorRGB spaceColor { get; set; }

    public MazeGrid(int complexity, ColorRGB wallColor, ColorRGB spaceColor)
    {
        this.complexity = complexity;
        this.wallColor = wallColor;
        this.spaceColor = spaceColor;
        this.rand = new Random();

        this.complexity = Math.Max(COMPLEXITY_MIN, this.complexity);
        this.complexity = Math.Min(COMPLEXITY_MAX, this.complexity);

        // The number of rows and columns should both always be odd. If complexity is an even number, add one row.
        rows = this.complexity * 3;
        if (this.complexity % 2 == 0)
            ++rows;
        columns = (this.complexity * 4) + 1;
        wall_right = columns - 1;
        wall_bottom = rows - 1;

        grid = new char[rows, columns];
        paths = new List<MazePath>();
        branches = new List<MazePath>();

        this.exitOnRight = rand.Next(2) == 1 ? true : false;

        InitMaze();
        GenerateMaze();
    }

    public MazeGrid(int complexity) : this(complexity, new ColorRGB(100, 100, 100), new ColorRGB(200, 200, 200))
    {
        RandomizeColors();
    }

    public MazeGrid() : this(COMPLEXITY_DEFAULT, new ColorRGB(100, 100, 100), new ColorRGB(200, 200, 200))
    {
        RandomizeColors();
    }

    private void AddPath(int x, int y, Direction d)
    {
        if (grid[y,x] == CH_SPACE)
        {
            paths.Add(new MazePath(x, y, d));
            grid[y,x] = CH_WALL;
        }
    }

    private void AddTopWallPaths()
    {
        int pathY = wall_top + 1;
        int pathX = rand.Next(2) * 2 + 2;

        if (Math.Abs(startX - pathX) > 3)
        {
            AddPath(pathX, pathY, Direction.DOWN);
        }

        for (var i = pathX; i <= wall_right - 2; i += 4)
        {
            int roll = rand.Next(2);

            if (roll == 1 && Math.Abs(startX - i) > 3)
            {
                AddPath(i, pathY, Direction.DOWN);
            }
        }
    }

    private void AddBottomWallPaths()
    {
        int pathY = wall_bottom - 1;
        int pathX = rand.Next(2) * 2 + 2;

        if (Math.Abs(exitX - pathX) > 3)
        {
            AddPath(pathX, pathY, Direction.UP);
        }

        for (var i = pathX; i <= wall_right - 2; i += 4)
        {
            int roll = rand.Next(2);

            if (roll == 1 && Math.Abs(exitX - i) > 3)
            {
                AddPath(i, pathY, Direction.UP);
            }
        }
    }

    private void AddLeftWallPaths()
    {
        int pathX = wall_left + 1;
        int pathY = rand.Next(2) * 2 + 4;

        AddPath(pathX, pathY, Direction.RIGHT);

        for (var i = pathY; i <= wall_bottom - 3; i += 4)
        {
            int roll = rand.Next(2);

            if (roll == 1)
            {
                AddPath(pathX, i, Direction.RIGHT);
            }
        }

    }

    private void AddRightWallPaths()
    {
        int pathX = this.wall_right - 1;
        int pathY = rand.Next(2) * 2 + 4;

        if (Math.Abs(exitY - pathY) > 3)
        {
            AddPath(pathX, pathY, Direction.LEFT);
        }

        for (var i = pathY; i <= this.wall_bottom - 3; i += 4)
        {
            int roll = rand.Next(2);

            if (roll == 1 && Math.Abs(exitY - i) > 3)
            {
                AddPath(pathX, i, Direction.LEFT);
            }
        }

    }

    private void GenerateMaze()
    {
        AddTopWallPaths();
        AddBottomWallPaths();
        AddLeftWallPaths();
        AddRightWallPaths();

        while (PathsActive())
        {
            if (while_control > MAX_ITERATIONS)
            {
                Console.WriteLine("Maximum iterations reached: wall paths");
                break;
            }

            ++while_control;

            GrowPaths();
        }

        while_control = 0;
        while (!IsComplete())
        {
            if (while_control > MAX_ITERATIONS)
            {
                Console.WriteLine("Maximum iterations reached: branches");
                break;
            }

            ++while_control;

            foreach (MazePath path in paths)
            {
                if (path.points.Count <= 2)
                    continue;
                
                MazePath p = path.Branch();
                if (PathIsClear(p.GetBranchCheckpoint(), p.direction))
                    branches.Add(p);
            }

            foreach(MazePath branch in branches)
            {
                paths.Add(branch);
            }

            branches.Clear();

            while (PathsActive())
            {
                if (while_control > MAX_ITERATIONS)
                    break;

                ++while_control;
                GrowPaths();
            }
        }
    }

    private void GrowPaths()
    {
        foreach(MazePath path in paths)
        {
            if (!path.active)
            {
                continue;
            }
            
            if (!PathIsClear(path.GetCheckpoint(path.direction), path.direction))
            {
                if (!path.ChangeDirection())
                {
                    path.active = false;
                    continue;
                }
            }

            else if (rand.Next(100) < 60)
            {
                path.Grow();
            }

            else
            {
                path.ChangeDirection();
            }

            path.active = false;

            Direction[] dirs = {Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT};

            foreach (Direction d in dirs)
            {
                if (PathIsClear(path.GetCheckpoint(d), d))
                    path.active = true;
            }

            foreach (GridPoint pt in path.points)
            {
                grid[pt.y, pt.x] = CH_WALL;
            }
        }
    }

    private void InitMaze()
    {
        for (var i = 0; i < this.rows; ++i)
        {
            for (var j = 0; j < this.columns; ++j)
            {
                if (i == this.wall_top || i == this.wall_bottom ||
                    j == this.wall_left || j == this.wall_right)
                    grid[i, j] = CH_WALL;
                else
                    grid[i, j] = CH_SPACE;
            }
        }

        if (exitOnRight)
        {
            startX = rand.Next((columns - 6) / 2) * 2 + 3;
            exitX = wall_right;

            startY = wall_top;
            exitY = rand.Next((rows - 4) / 2) * 2 + 3;

            if (startX > this.columns / 2)
                startX = startX - (int)Math.Floor(this.columns / 2.0);

            if (wall_bottom - exitY <= 2)
                --exitY;

            if (exitY - wall_top <= 2)
                ++exitY;

            grid[wall_top, startX] = CH_SPACE;
            grid[exitY, wall_right] = CH_SPACE;

            startPoint = new GridPoint(startX, wall_top);
            exitPoint = new GridPoint(wall_right, exitY);

            AddPath(startPoint.x - 1, startPoint.y + 1, Direction.DOWN);
            AddPath(startPoint.x + 1, startPoint.y + 1, Direction.DOWN);
            AddPath(exitPoint.x - 1, exitPoint.y + 1, Direction.LEFT);
            AddPath(exitPoint.x - 1, exitPoint.y - 1, Direction.LEFT);

        }

        else
        {
            startX = rand.Next((columns - 6) / 2) * 2 + 3;
            exitX = rand.Next((columns - 6) / 2) * 2 + 3;

            if (startX > this.columns / 2)
                startX = startX - (int)Math.Floor(this.columns / 2.0);

            if (exitX < this.columns / 2)
                exitX = exitX + (int)Math.Floor(this.columns / 2.0);

            grid[wall_top, startX] = CH_SPACE;
            grid[wall_bottom, exitX] = CH_SPACE;

            startPoint = new GridPoint(startX, wall_top);
            exitPoint = new GridPoint(exitX, wall_bottom);

            AddPath(startPoint.x - 1, startPoint.y + 1, Direction.DOWN);
            AddPath(startPoint.x + 1, startPoint.y + 1, Direction.DOWN);
            AddPath(exitPoint.x - 1, exitPoint.y - 1, Direction.UP);
            AddPath(exitPoint.x + 1, exitPoint.y - 1, Direction.UP);
        }


        startX = startPoint.x;
        startY = startPoint.y;
        exitX = exitPoint.x;
        exitY = exitPoint.y;
    }


    private bool IsComplete()
    {
        bool result = true;

        // Horizontal set of 2 x 3 points
        for (var i = 1; i < this.rows - 2; ++i)
        {
            for (var j = 1; j < this.columns - 2; ++j)
            {
                if (grid[i, j] == CH_SPACE &&
                    grid[i, j + 1] == CH_SPACE &&
                    grid[i, j - 1] == CH_SPACE &&
                    grid[i + 1, j] == CH_SPACE &&
                    grid[i + 1, j + 1] == CH_SPACE &&
                    grid[i + 1, j - 1] == CH_SPACE)
                {
                    result = false;
                }
            }
        }

        // Vertical set of 2 x 3 points
        for (var i = 1; i < this.rows - 2; ++i)
        {
            for (var j = 1; j < this.columns - 2; ++j)
            {
                if (grid[i, j] == CH_SPACE &&
                    grid[i, j + 1] == CH_SPACE &&
                    grid[i - 1, j] == CH_SPACE &&
                    grid[i - 1, j + 1] == CH_SPACE &&
                    grid[i + 1, j] == CH_SPACE &&
                    grid[i + 1, j + 1] == CH_SPACE)
                {
                    result = false;
                }
            }
        }

        return result;
    }

    private bool PathIsClear(GridPoint pt, Direction dir)
    {
        int checkX = Math.Max(wall_left, pt.x);
        int checkY = Math.Max(wall_top, pt.y);

        checkX = Math.Min(wall_right, checkX);
        checkY = Math.Min(wall_bottom, checkY);

        if (grid[checkY, checkX] == CH_WALL)
            return false;

        switch (dir)
        {
            case Direction.UP:
            {
                if (grid[checkY, checkX + 1] == CH_WALL     ||
                    grid[checkY, checkX - 1] == CH_WALL     ||
                    grid[checkY + 1, checkX + 1] == CH_WALL ||
                    grid[checkY + 1, checkX] == CH_WALL     ||
                    grid[checkY + 1, checkX - 1] == CH_WALL)
                {
                    return false;
                }

            } break;
            
            case Direction.DOWN:
            {
                if (grid[checkY, checkX + 1] == CH_WALL     ||
                    grid[checkY, checkX - 1] == CH_WALL     ||
                    grid[checkY - 1, checkX + 1] == CH_WALL ||
                    grid[checkY - 1, checkX] == CH_WALL     ||
                    grid[checkY - 1, checkX - 1] == CH_WALL)
                {
                    return false;
                }

            } break;

            case Direction.LEFT:
            {
                if (grid[checkY + 1, checkX] == CH_WALL     ||
                    grid[checkY - 1, checkX] == CH_WALL     ||
                    grid[checkY + 1, checkX + 1] == CH_WALL ||
                    grid[checkY, checkX + 1] == CH_WALL     ||
                    grid[checkY - 1, checkX + 1] == CH_WALL)
                {   
                    return false;
                }

            } break;

            case Direction.RIGHT:
            {
                if (grid[checkY + 1, checkX] == CH_WALL     ||
                    grid[checkY - 1, checkX] == CH_WALL     ||
                    grid[checkY + 1, checkX - 1] == CH_WALL ||
                    grid[checkY, checkX - 1] == CH_WALL     ||
                    grid[checkY - 1, checkX - 1] == CH_WALL)
                {   
                    return false;
                }

            } break;

            default: {} break;
        }
            
        return true;
    }

    private bool PathsActive()
    {
        foreach (MazePath path in paths)
        {
            if (path.active)
                return true;
        }

        return false;
    }

    public void PrintMazeToConsole()
    {
        for (var i = 0; i < rows; ++i)
        {
            for (var j = 0; j < columns; ++j)
            {
                Console.Write(grid[i, j]);
                Console.Write(" ");
            }
            Console.WriteLine();
        }

        // Console.WriteLine(this.ToString());
    }

    public void RandomizeColors()
    {
        byte spaceRed = (byte)(rand.Next(40) + 190);
        byte spaceGreen = (byte)(rand.Next(40) + 190);
        byte spaceBlue = (byte)(rand.Next(40) + 190);

        byte wallRed = (byte)(255 - spaceRed);
        byte wallGreen = (byte)(255 - spaceGreen);
        byte wallBlue = (byte)(255 - spaceBlue);

        wallColor = new ColorRGB(wallRed, wallGreen, wallBlue);
        spaceColor = new ColorRGB(spaceRed, spaceGreen, spaceBlue);
    }

    public override string ToString()
    {
        string result = "";

        for (int i = 0; i < rows; ++i)
        {
            for (int j = 0; j < columns; ++j)
            {
                result += grid[i, j] + " ";
            }

            result += "|";
        }

        return result;
    }
}