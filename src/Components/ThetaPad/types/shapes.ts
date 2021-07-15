/** shapes.ts
 * @file Type & Class declarations for shape objects
 * @author Ryan McKay <ryanscottmckay@gmail.com>
 */
import {MIN_SIDEBAR_WIDTH, NAVBAR_HEIGHT} from "../../constants";
import _ from "lodash";


/////---------------------------------------------------------------------------
///     SHAPE TYPES:
/////---------------------------------------------------------------------------

// This is the type of the primary 'shapes' object in state
export type ShapeMap = {[id: string]: Shape}

// Subtypes of shape
export enum ShapeKind {
    Line = "Line",
    Poly = "Poly",
    Circle = "Circle",
}

// Map labels to their ShapeKind
export const ShapeKindOptions: {[label: string]: ShapeKind} = {
    Line: ShapeKind.Line,
    Poly: ShapeKind.Poly,
    Circle: ShapeKind.Circle,
}

/** Represents a 2D point. */
export class Point {
    static xOffset = MIN_SIDEBAR_WIDTH;
    static yOffset = NAVBAR_HEIGHT;
    x: number;
    y: number;

    /**
     * Create a new Point, auto-adjusted with the sizes of other page elements
     * @param {number} x - the X coordinate
     * @param {number} y - the Y coordinate
     */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    
    get canvasX(): number {
        return this.x - Point.xOffset;
    }

    get canvasY(): number {
        return this.y - Point.yOffset;
    }

    moveTo(newX: number, newY: number) {
        this.x = newX;
        this.y = newY;
    }

    /**
     * Translates the point by the values provided
     * @param {number} x - the amount to translate in the X direction
     * @param {number} y - the amount to translate in the Y direction
     */
    translate(x: number, y: number) {
        this.x += x;
        this.y += y;
    }

    /**
     * Calculates absolute distance to another point
     * @param {Point} otherPoint - The point you want find distance to
     * @return {number} - Absolute difference between this point and otherPoint
     */
    distanceTo(otherPoint: Point): number {
        const yDist = Math.abs(this.y - otherPoint.y);
        const xDist = Math.abs(this.x - otherPoint.x);
        return Math.sqrt((yDist ** 2) + (xDist ** 2))
    }

    /**
     * Get the angle in degrees from this point to another
     * @param {Point} otherPoint - the point you want the angle to from this one
     * @return {number} - the angle to otherPoint
     */
    angleTo(otherPoint: Point): number {
        return Math.atan2(
            otherPoint.y - this.y,
            otherPoint.x - this.x
        ) * 180 / Math.PI;
    }

    /**
     * Calculates relative distance to another point
     * @param {Point} otherPoint - the point you want to find relative distances to
     * @return {Point}
     */
    midpoint(otherPoint: Point): Point {
        const avgX = (this.x + otherPoint.x) / 2;
        const avgY = (this.y + otherPoint.y) / 2;
        return new Point(avgX, avgY);
    }
}

/** Abstract base class for shapes (Line, Poly, & Circle) */
export abstract class Shape {
    id: string;
    kind: ShapeKind;
    origin: Point;
    color: string;
    isUnit: boolean;
    showDetails: boolean;

    /**
     * Initializes base shape properties, generating an id and setting defaults
     * @param {number} x - the origin X coordinate
     * @param {number} y - the origin Y coordinate
     * @param {ShapeKind} kind - the type (subclass) of shape this instance is
     * @param {string} color - the color the shape should be drawn in
     * @protected
     */
    protected constructor(
        x: number,
        y: number,
        kind: ShapeKind,
        color: string = "black"
    ) {
        this.id = Date.now().toString();
        this.kind = kind;
        this.origin = new Point(x, y);
        this.color = color;
        this.isUnit = false;
        this.showDetails = false;
    }

    /**
     * Updates own values with those passed
     * @param {Partial<Shape>} updateValues - the partial shape with new values
     */
    update(updateValues: Partial<Shape>) {
        for (let [attr, val] of Object.entries(updateValues)) {
            if (attr in this) {
                this[attr] = val;
            } else {
                console.error(
                    "POSSIBLE MISMATCHED TYPES. ", attr, " does not exist on ",
                    "shape of type: ", this.kind
                )
            }
        }
    }

    /** @return {this is Line} */
    isLine(): this is Line {
        return this.kind === ShapeKind.Line;
    }
    /** @return {this is Poly} */
    isPoly(): this is Poly {
        return this.kind === ShapeKind.Poly;
    }
    /** @return {this is Circle} */
    isCircle(): this is Circle {
        return this.kind === ShapeKind.Circle
    }
}


/////---------------------------------------------------------------------------
///     SHAPE SUB-TYPES:
/////---------------------------------------------------------------------------

/**
 * Represents a straight line, with only start and end points
 * @extends Shape
 */
export class Line extends Shape {
    start: Point;
    end: Point;

    /**
     * Create a new Line, with only a starting point and color
     * @param {number} x - initial X coordinate
     * @param {number} y - initial Y coordinate
     * @param {string} color - the color it should be drawn in
     */
    constructor(x: number, y: number, color: string = "black", ) {
        super(x, y, ShapeKind.Line, color);
        this.start = new Point(x, y);
        this.end = new Point(x, y);
    }

    /** @return {number} - the length of the line */
    get length(): number {
        return this.start.distanceTo(this.end);
    }

    /** @return {number} - the angle of the line in degrees */
    get angle(): number {
        return this.start.angleTo(this.end);
    }

    /**
     * Get an array of the individual coordinate values
     * @return {number[]} - Array of coordinate values [x1, y1, x2, y2]
     */
    get points(): number[] {
        return [this.start.x, this.start.y, this.end.x, this.end.y]
    }

    get canvasPoints(): number[] {
        return [
            this.start.canvasX, this.start.canvasY,
            this.end.canvasX, this.end.canvasY
        ]
    }

    /**
     * Get an array of the coordinate values, translated to start at 0, 0
     * @return {number[]} - Translated coordinate values [0, 0, x2-x1, y2-y1]
     */
    get zeroedPoints() {
        return [0, 0, this.end.x - this.start.x, this.end.y - this.start.y];
    }

    /** @return {Point} - the midpoint of the line */
    get midpoint(): Point {
        return this.start.midpoint(this.end)
    }

    copy(): Line {
        return new Line(this.start.x, this.start.y, this.color);
    }

//    static withNewEnd(line: Line, endX: number, endY: number): Line {
//        const newLine = Line(line.start.x, line.start.y)
//    }

}

/**
 * Represents a line with more than 2 points
 * @extends shape
 */
export class Poly extends Shape {
    points: Point[];
//    distances: number[];
//    angles: number[];

    /**
     * Create a new Poly line, starting at (x, y)
     * @param {number} x - starting X coordinate
     * @param {number} y - starting Y coordinate
     * @param {string} color - the color to draw this line in
     */
    constructor(x: number, y: number, color: string = "blue") {
        super(x, y, ShapeKind.Poly, color);
        this.points = [this.origin];
//        this.distances = [0];
//        this.angles = [0];
    }

    get canvasPoints(): number[] {
        return Array.from(_.flatMap(this.points, (pt: Point) => (
            [pt.x - Point.xOffset, pt.y - Point.yOffset]
        )))
    }

    addPoint(x: number, y: number) {
        this.points.push(new Point(x, y));
    }

    setEndpoint(endX: number, endY: number) {
        this.points[this.points.length - 1].moveTo(endX, endY);
    }

    copy(): Poly {
        const firstPoint = this.points[0];
        const newPoly = new Poly(firstPoint.x, firstPoint.y, this.color);
        newPoly.points = this.points;
        return newPoly;
    }
}

/**
 * Represents a circle
 * @extends shape
 */
export class Circle extends Shape {
    r: number;

    /**
     * Create a new Circle Shape
     * @param {number} x - center X coordinate
     * @param {number} y - center Y coordinate
     * @param {string} color - the color to draw this circle in
     */
    constructor(x: number, y: number, color: string = "red") {
        super(x, y, ShapeKind.Circle, color);
        this.r = 0;
    }
}
