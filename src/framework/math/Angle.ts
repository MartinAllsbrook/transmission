export class Angle {
    /**
     * The angle value in radians
     */
    private value: number;

    //#region Constructors

    constructor(radians: number = 0) {
        this.value = radians;
    }

    public static fromDegrees(degrees: number): Angle {
        return new Angle(degrees * (Math.PI / 180));
    }

    public static fromRadians(radians: number): Angle {
        return new Angle(radians);
    }

    public static get Zero(): Angle {
        return new Angle(0);
    }

    //#endregion

    public set(value: Angle): void {
        this.value = value.value;
    }

    public clone(): Angle {
        return new Angle(this.value);
    }

    public get Deg(): number {
        return this.value * (180 / Math.PI);
    }

    public set Deg(degrees: number) {
        this.value = degrees * (Math.PI / 180);
    }

    public get Rad(): number {
        return this.value;
    }

    public set Rad(radians: number) {
        this.value = radians;
    }
}