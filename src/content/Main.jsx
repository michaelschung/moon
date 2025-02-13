import React, { useEffect, useRef } from "react";

import {
    Introduction,
    Phases,
    DoneNotDone,
    Eclipses,
    FieldOfView,
    TheEnd,
    Notes
} from ".";

import { useObserver, observerConfig } from "../observer";

function Main() {
    const [phasesRef, isPhasesVisible] = useObserver(observerConfig);
    const [eclipsesRef, isEclipsesVisible] = useObserver(observerConfig);
    const [fovRef, isFovVisible] = useObserver(observerConfig);
    
    return (
        <main id="main">
            <Introduction />
            <div ref={phasesRef}>
                {isPhasesVisible && <Phases />}
            </div>
            <DoneNotDone />
            <div ref={eclipsesRef}>
                {isEclipsesVisible && <Eclipses />}
            </div>
            {/* <Eclipses /> */}
            <div ref={fovRef}>
                {isFovVisible && <FieldOfView />}
            </div>
            {/* <FieldOfView /> */}
            <TheEnd />
            <Notes />
        </main>
    );
}

export default Main;