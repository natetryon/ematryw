using System;
using System.Collections.Generic;

public class MazePath
{
    public Direction direction {get; set; }
    public bool active { get; set; }
    public List<GridPoint> points;
    public Random rand;

    public MazePath(int startX, int startY, Direction dir)
    {
        direction = dir;
        active = true;
        points = new List<GridPoint>();
        rand = new Random();

        points.Add(new GridPoint(startX, startY));
    }

    public MazePath Branch()
    {
        if (points.Count < 3)
            return null;

        var index = rand.Next(points.Count - 2) + 1;

        var nx = points[index].x;
        var ny = points[index].y;

        while (nx % 2 == 1 || ny % 2 == 1)
        {
            index = rand.Next(points.Count - 2) + 1;
            nx = points[index].x;
            ny = points[index].y;
        }

        var dirNew = Direction.UP;
        var gUp = new GridPoint(nx, ny - 1);
        var gDown = new GridPoint(nx, ny + 1);
        var gLeft = new GridPoint(nx - 1, ny);
        var gRight = new GridPoint(nx + 1, ny);

        // Path is vertical
        if ( (gUp.Equals(points[index - 1]) && gDown.Equals(points[index + 1])) ||
                (gUp.Equals(points[index + 1]) && gDown.Equals(points[index - 1])) )
        {
            var roll = rand.Next(2);

            nx = (roll == 0 ? nx + 1 : nx - 1);
            dirNew = (roll == 0 ? Direction.RIGHT : Direction.LEFT);

            return new MazePath(nx, ny, dirNew);
        }

        // Path is horizontal
        if ( (gLeft.Equals(points[index - 1]) && gRight.Equals(points[index + 1])) ||
                (gLeft.Equals(points[index + 1]) && gRight.Equals(points[index - 1])) )
        {
            var roll = rand.Next(2);

            ny = (roll == 0 ? ny + 1 : ny - 1);
            dirNew = (roll == 0 ? Direction.DOWN : Direction.UP);

            return new MazePath(nx, ny, dirNew);
        }

        // Corner, upper right
        if ( (gUp.Equals(points[index - 1]) && gRight.Equals(points[index + 1])) ||
                (gUp.Equals(points[index + 1]) && gRight.Equals(points[index - 1])) )
        {
            var roll = rand.Next(2);

            nx = (roll == 0 ? nx - 1 : nx);
            ny = (roll == 0 ? ny : ny + 1);
            dirNew = (roll == 0 ? Direction.LEFT : Direction.DOWN);

            return new MazePath(nx, ny, dirNew);
        }

        // Corner, upper left
        if ( (gUp.Equals(points[index - 1]) && gLeft.Equals(points[index + 1])) ||
                (gUp.Equals(points[index + 1]) && gLeft.Equals(points[index - 1])) )
        {
            var roll = rand.Next(2);

            nx = (roll == 0 ? nx + 1 : nx);
            ny = (roll == 0 ? ny : ny + 1);
            dirNew = (roll == 0 ? Direction.RIGHT : Direction.DOWN);

            return new MazePath(nx, ny, dirNew);
        }

        // Corner, lower right
        if ( (gDown.Equals(points[index - 1]) && gRight.Equals(points[index + 1])) ||
                (gDown.Equals(points[index + 1]) && gRight.Equals(points[index - 1])) )
        {
            var roll = rand.Next(2);

            nx = (roll == 0 ? nx - 1 : nx);
            ny = (roll == 0 ? ny : ny - 1);
            dirNew = (roll == 0 ? Direction.LEFT : Direction.UP);

            return new MazePath(nx, ny, dirNew);
        }

        // Corner, lower left
        if ( (gDown.Equals(points[index - 1]) && gLeft.Equals(points[index + 1])) ||
                (gDown.Equals(points[index + 1]) && gLeft.Equals(points[index - 1])) )
        {
            var roll = rand.Next(2);

            nx = (roll == 0 ? nx + 1 : nx);
            ny = (roll == 0 ? ny : ny - 1);
            dirNew = (roll == 0 ? Direction.RIGHT : Direction.UP);

            return new MazePath(nx, ny, dirNew);
        }

        return null;
    }

    

    public bool ChangeDirection()
    {
        if (GetX() % 2 == 1 || GetY() % 2 == 1)
            return false;

        var roll = rand.Next(2);

        switch(direction)
        {
            case Direction.UP:
            case Direction.DOWN:
            {
                direction = (roll == 0 ? Direction.LEFT : Direction.RIGHT);
            } break;

            case Direction.LEFT:
            case Direction.RIGHT:
            {
                direction = (roll == 0 ? Direction.UP : Direction.DOWN);
            } break;

            default: {} break;
        }

        return true;
    }

    public GridPoint GetBranchCheckpoint()
    {
        GridPoint result;
        var checkX = points[0].x;
        var checkY = points[0].y;

        switch (direction)
        {
            case Direction.UP:
            {
                result = new GridPoint(checkX, checkY - 1);
            } break;

            case Direction.DOWN:
            {
                result = new GridPoint(checkX, checkY + 1);
            } break;

            case Direction.LEFT:
            {
                result = new GridPoint(checkX - 1, checkY);
            } break;

            case Direction.RIGHT:
            {
                result = new GridPoint(checkX + 1, checkY);
            } break;

            default: { result = new GridPoint(0, 0); } break;
        }

        return result;
    }

    public GridPoint GetCheckpoint(Direction dir)
    {
        GridPoint result;
        var checkX = GetX();
        var checkY = GetY();

        switch (dir)
        {
            case Direction.UP:
            {
                result = new GridPoint(checkX, checkY - 2);
            } break;

            case Direction.DOWN:
            {
                result = new GridPoint(checkX, checkY + 2);
            } break;

            case Direction.LEFT:
            {
                result = new GridPoint(checkX - 2, checkY);
            } break;

            case Direction.RIGHT:
            {
                result = new GridPoint(checkX + 2, checkY);
            } break;

            default: { result = new GridPoint(0, 0); } break;
        }

        return result;
    }

    public int GetX()
    {
        return points[points.Count - 1].x;
    }

    public int GetY()
    {
        return points[points.Count - 1].y;
    }

    public void Grow()
    {
        var newX = GetX();
        var newY = GetY();

        switch (direction)
        {
            case Direction.UP:
            {
                --newY;
            } break;

            case Direction.DOWN:
            {
                ++newY;
            } break;

            case Direction.LEFT:
            {
                --newX;
            } break;

            case Direction.RIGHT:
            {
                ++newX;
            } break;

            default: return;
        }

        points.Add(new GridPoint(newX, newY));
    }
}