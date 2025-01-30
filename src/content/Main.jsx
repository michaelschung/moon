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

function Main() {
    const mainRef = useRef(null);  // Create a ref for the main element

    return (
        <main ref={mainRef} id="main">
            <h1>The Phases of the Moon</h1>
            <Introduction />
            <Phases mainRef={mainRef} />
            <DoneNotDone />
            <Eclipses />
            <FieldOfView />
            <TheEnd />
            <Notes />
        </main>
    );
}

export default Main;