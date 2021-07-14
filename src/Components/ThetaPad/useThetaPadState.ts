/** useThetaPadState.ts
 * @file Primary state management hook for ThetaPad
 * @author Ryan McKay <ryanscottmckay@gmail.com>
 */
import {useEffect, useReducer, useState} from "react";
import {
    Dimensions, PrimaryDispatch,
    ThetaPadStateType
} from "./ThetaPad";
import {ShapeMap, ShapeKind, Line, Point} from "./types/shapes";
import {
    Action,
    ContinueShapeAction,
    CreateShapeAction,
    EndShapeAction,
    ShapesUpdateAction
} from "./types/actions";
import {SIDEBAR_WIDTH} from "../constants";


/////---------------------------------------------------------------------------
///     REDUCERS:
/////---------------------------------------------------------------------------

const shapesReducer = (
    shapes: ShapeMap,
    action: ShapesUpdateAction
): ShapeMap => {
    if (action.createKind()) {
        shapes[action.payload.id] = action.payload;
    }
    if (action.continueKind()) {
        shapes[action.targetShape].update(action.payload);
    }
    if (action.endKind()) {
        console.log("ENDING LINE")
    }
    return {...shapes}
}



/////---------------------------------------------------------------------------
///     HOOK DEFINITION:
/////---------------------------------------------------------------------------

/**
 * This is the primary state-management system for ThetaPad
 * @return {ThetaPadStateType} - An object containing all necessary state items
 *      and updater functions
 */
const useThetaPadState = () => {
    const [dimensions, setDimensions] = useState<Dimensions>({
        sidebar: SIDEBAR_WIDTH,
        width: window.innerWidth,
        height: window.innerHeight,
    })
    const [currentShape, setCurrentShape] = useState<string | null>(null);
    const [drawMode, setDrawMode] = useState<ShapeKind>(ShapeKind.Line)
    const [shapes, updateShapes] = useReducer(shapesReducer, {});

    /**
     * ON MOUNT: add a window-resize event listener that updates dimensions
     * ON UNMOUNT: remove that event listener
     */
    useEffect(() => {
        const updateDimensions = (e) => {
            console.log(e)
            setDimensions({
                sidebar: dimensions.sidebar,
                width: e.target.innerWidth,
                height: e.target.innerHeight,
            })
        }

        window.addEventListener('resize', updateDimensions)

        return () => {
            window.removeEventListener('resize', updateDimensions);
        }
    }, [dimensions.sidebar]);


    /**
     * The highest-level state-update dispatch funtion
     * @param {Action} action - an action-object derived from Action
     */
    const dispatch: PrimaryDispatch = (action: Action): void => {
        if (action.targetsShapes()) {
            updateShapes(action);
        }
        else if (action.targetsDrawMode()) {
            setDrawMode(action.value);
        }
    }

    /**
     * Handles mouseup and mousedown events on the canvas when drawMode is Line.
     * Called by 'handleCanvasClick'
     * @param e - the mouseup/mousedown event that was fired
     */
    const handleLineClickEvent = (e) => {
        // Starting a new line:
        if (!currentShape && e.type === "mousedown") {
            const newShape = new Line(e.pageX, e.pageY);
            setCurrentShape(newShape.id);
            dispatch(new CreateShapeAction(newShape))
        }
        // If in the middle of a drawing action
        else if (currentShape && e.type === "mouseup") {
            dispatch(
                new EndShapeAction(
                    currentShape
                )
            )
            setCurrentShape(null);
        }
    }

    /**
     * Called on all mousedown and mouseup events that occur on the canvas.
     * Routes the event to the relevant handler one layer of specificity down.
     * @param {MouseEvent} e - the mousedown or mouseup event that was triggered
     */
    const handleCanvasClick = (e: MouseEvent) => {
        console.log(e)
        console.log(shapes)
        switch (drawMode) {
            case ShapeKind.Line:
                handleLineClickEvent(e);
                break;
            default:
                console.error("drawMode ", drawMode,
                    " not handled in handleCanvasClick inDraw branch")
                break;
        }
    }

    /**
     * Called when the mouse is moved over the canvas. Only does anything if in
     * the middle of a shape-drawing.
     * @param {MouseEvent} e - The mousemove event that was fired
     */
    const handleMouseMove = (e: MouseEvent) => {
        if (currentShape) {
            switch (drawMode) {
                case ShapeKind.Line:
                    dispatch(
                        new ContinueShapeAction(
                            currentShape,
                            {end: new Point(e.pageX, e.pageY)} as Partial<Line>
                        )
                    )
                    break;
                default:
                    console.error("drawMode ", drawMode,
                        " not handled in handleMouseMove inDraw branch")
                    break;
            }
        }
    }

    return {
        dispatch,
        handleCanvasClick,
        handleMouseMove,
        drawMode,
        shapes,
        dimensions,
    } as ThetaPadStateType
}

export default useThetaPadState;