import React from "react";
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
            <h1>The Phases of the Moon</h1>
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