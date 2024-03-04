public struct GridPoint {

    public readonly int x;
    public readonly int y;

    public GridPoint(int x, int y)
    {
        this.x = x;
        this.y = y;
    }

    public override string ToString()
    {
        return($"({x}, {y})");
    }

    public override bool Equals(object obj)
    {
        if (obj == null || GetType() != obj.GetType())
            return false;

        GridPoint g = (GridPoint)(obj);

        if (this.x == g.x && this.y == g.y)
            return true;
        else
            return false;
    }
    
    public override int GetHashCode()
    {
        return base.GetHashCode();
    }
}