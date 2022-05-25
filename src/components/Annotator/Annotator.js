import { useReducer, useRef, useState } from "react";
import Toolbar from "../Toolbar/Toolbar";
import Workspace from "../Workspace/Workspace";
import { reducer } from "./reducer";
import styles from "./Annotator.module.css";
import userEvents from "./user-events";

const Annotator = () => {
  const [state, dispatch] = useReducer(reducer, {
    images: [],
  });

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mousePosPan, setMousePosPan] = useState({ x: 0, y: 0 });

  const activeRef = { current: null };
  const panRef = useRef();

  const events = userEvents(dispatch)


  const startPanning = (e) => {
    const xRelPos = e.pageX - activeRef.current?.offsetLeft;
    const yRelPos = e.pageY - activeRef.current?.offsetTop;
    if (e.button === 1) setMousePos({ x: xRelPos, y: yRelPos });
    if (e.button === 3) setMousePosPan({ x: xRelPos, y: yRelPos });
  };

  return (
    <>
      <div
        className={styles.annotatorContainer}
      >
        <Workspace mousePos={mousePos} panRef={panRef} events={events} />
        {mousePos.x}
      </div>
      <Toolbar />
    </>
  );
};

export default Annotator;
