/** ShapeProfile.tsx
 * @file A switch component for the ShapeProfiles of different shape types
 * @author Ryan McKay <ryanscottmckay@gmail.com>
 */
import React from "react";
import LineProfile from "./SpecificShapeProfiles/LineProfile";
import {Line, Shape, ShapeUtils} from "../../../../../types/shapes";
import PolyLineProfile from "./SpecificShapeProfiles/PolyLineProfile/PolyLineProfile";
import CircleProfile from "./SpecificShapeProfiles/CircleProfile";

interface ShapeProfileProps {
    shape: Shape;
    index: number;
}

/**
 * ShapeProfile switch component. Returns the profile subtype that matches that
 * of 'shape'
 * @param {Shape} shape - Shape object the profile will be linked to
 * @param {number} index - index of this shape in the rendered array
 * @return {JSX.Element | null} - LineProfile, PolyLineProfile, or CircleProfile
 *      based on the type of 'shape', null if the shape is an invalid type
 */
const ShapeProfile: React.FC<ShapeProfileProps> = ({shape, index}) => {
    if (ShapeUtils.isLine(shape)) {
        const line = shape as Line;
        return <LineProfile line={line} index={index}/>
    }
    if (ShapeUtils.isPoly(shape)) {
        return <PolyLineProfile line={shape} index={index}/>
    }
    if (ShapeUtils.isCircle(shape)) {
        return <CircleProfile circle={shape} index={index}/>;
    }
    return null;
}


export default ShapeProfile;
