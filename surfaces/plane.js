class Plane {
    width = 0;
    length = 0;

    constructor(width, length) {
        this.width = width;
        this.length = length;
    }

    getPosition(u, v) {
        const x = (u - 0.5) * this.width;
        const z = (v - 0.5) * this.length;
        return [x,0,z];
    }

    getNormal(u,v) {
        return [0,1,0];
    }

    getTextureCoordinates(u, v) {
        return [u,v];
    }
}