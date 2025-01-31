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
    return (
        <main id="main">
            <Introduction />
            <Phases />
            <DoneNotDone />
            <Eclipses />
            <FieldOfView />
            <TheEnd />
            <Notes />
        </main>
    );
}

export default Main;