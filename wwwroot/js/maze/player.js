class Player {

    constructor(startX, startY, dir) {

        this.direction = dir;
        this.points = [{ x: startX, y: startY }];
    }

    getX()
    {
        return this.points[this.points.length - 1].x;
    }

    getY()
    {
        return this.points[this.points.length - 1].y;
    }

    grow()
    {
        let newX = this.getX();
        let newY = this.getY();

        switch (this.direction)
        {
            case 1:
            {
                --newY;
                this.points.push({x: newX, y: newY });
            } break;

            case 2:
            {
                ++newY;
                this.points.push({x: newX, y: newY });
            } break;

            case 3:
            {
                --newX;
                this.points.push({x: newX, y: newY });
            } break;

            case 4:
            {
                ++newX;
                this.points.push({x: newX, y: newY });
            } break;

            default: {} break;
        }

    }
}