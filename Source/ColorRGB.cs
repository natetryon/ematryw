using System;

public struct ColorRGB {

    public readonly byte r { get; }
    public readonly byte g { get; }
    public readonly byte b { get; }
    
    public ColorRGB(byte red, byte green, byte blue)
    {
        r = red;
        g = green;
        b = blue;
    }

    public ColorRGB(string hexString)
    {
        byte[] arr = Convert.FromHexString(hexString);
        r = arr[0];
        g = arr[1];
        b = arr[2];
    }

    public override string ToString()
    {
        byte[] arr = {r, g, b};
        return $"#{Convert.ToHexString(arr)}";
    }
}