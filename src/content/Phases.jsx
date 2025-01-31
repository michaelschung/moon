import React, { useEffect, useRef, useState } from "react";
import Sketch from "./Sketch";
import p5 from "p5";

import { moonPhases, moonRevolve, moonQuarters, phaseView } from "../utils/phases";

function Phases({mainRef}) {
    const [quarter, setQuarter] = useState(0);
    const [allowAnimate, setAllowAnimate] = useState(false);

    return (
        <>
            <hr />

            <h2>Why does the Moon have phases?</h2>

            <p>
                Let's begin by examining the phases of the Moon. For the purpose of
                demonstration, we'll use this little model. It's not as pretty as the
                real thing, but it'll do.
            </p>

            <Sketch sketchInstance={moonPhases} containerRef={mainRef} />

            <p>
                The key to everything lies in the position of the Moon relative to the
                Earth, and the position of the Earth-Moon system relative to the Sun.
                So let's break that down.
            </p>
            <p>
                The Moon revolves around the Earth just about once every four weeks.
                That looks something like this (sizes to scale, distances <i>not</i>
                &nbsp;to scale).
            </p>

            <Sketch sketchInstance={moonRevolve} containerRef={mainRef} />

            <p>
                Both bodies are illuminated on the same side -- this is due to the
                Sun, which is shining from over 90 million miles away.
            </p>
            <p>
                It probably goes without saying, but note that exactly half of the
                Moon is illuminated at all times, no matter where it is in its orbit
                around the Earth. This tells us that the phases we observe are all a
                matter of perspective. But more on that in a bit -- let's first take a
                moment to define a bit of terminology that we'll need moving forward.
            </p>
            <p>
                The lunar cycle is split into four quarters, beginning and ending
                with the <term>new moon</term>, when the Moon is directly between
                the Earth and the Sun. Click on the sketch below to move the Moon
                between each quarter.
            </p>

            <Sketch sketchInstance={moonQuarters} containerRef={mainRef} />

            <p>
                Not coincidentally, these are four of the phases of the moon:
                <term>new moon</term>, <term>first quarter</term>,&nbsp;
                <term>full moon</term>, and <term>third quarter</term> (a.k.a.&nbsp;
                <term>last quarter</term>). Perhaps you can already see how these names
                and positions translate to the corresponding Earthbound visuals that
                we're familiar with, but here are four sketches to fully make the
                connection. Try moving the sliders to transition from orbit view to
                Earth view.
            </p>

            <div className="photo-row">
                <Sketch sketchInstance={phaseView} containerRef={mainRef} quarter={0} allowAnimate={false} />
                <Sketch sketchInstance={phaseView} containerRef={mainRef} quarter={1} allowAnimate={false} />
            </div>
            <br />
            <div className="photo-row">
                <Sketch sketchInstance={phaseView} containerRef={mainRef} quarter={2} allowAnimate={false} />
                <Sketch sketchInstance={phaseView} containerRef={mainRef} quarter={3} allowAnimate={false} />
            </div>
            <br />

            
        </>
    );
}

export default Phases;