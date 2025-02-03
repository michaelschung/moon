import React, { useEffect, useRef } from "react";
import Sketch from "./Sketch";

import { moonPhases, moonRevolve, moonQuarters, phaseView } from "../utils/phases";

import { createMoonPhasesScene } from "../three/MoonPhases";

function Phases() {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Initialize scene
        const { dispose } = createMoonPhasesScene(containerRef.current);

        // Cleanup on unmount
        return () => dispose();
    }, []);

    return (
        <>
            <hr />

            <h2>Why does the Moon have phases?</h2>

            <p>
                Let's begin by examining the phases of the Moon. For the purpose of
                demonstration, we'll use this little model. It's not as pretty as the
                real thing, but it'll do.
            </p>

            <div className="sketch-container" ref={containerRef} style={{ width: "100%", height: "400px" }}></div>

            {/* <Sketch sketchInstance={moonPhases} containerRef={mainRef} /> */}

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

            {/* <Sketch sketchInstance={moonRevolve} containerRef={mainRef} /> */}

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

            {/* <Sketch sketchInstance={moonQuarters} containerRef={mainRef} /> */}

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
                {/* <Sketch sketchInstance={phaseView} containerRef={mainRef} quarter={0} allowAnimate={false} />
                <Sketch sketchInstance={phaseView} containerRef={mainRef} quarter={1} allowAnimate={false} /> */}
            </div>
            <br />
            <div className="photo-row">
                {/* <Sketch sketchInstance={phaseView} containerRef={mainRef} quarter={2} allowAnimate={false} />
                <Sketch sketchInstance={phaseView} containerRef={mainRef} quarter={3} allowAnimate={false} /> */}
            </div>
            <br />

            <p>
            <i>
                Note: the first quarter and third quarter Moon are often referred to
                as <term>half moon</term>, due to the fact that it appears
                half-illuminated as compared to the full moon. This is sometimes
                slightly confusing since the full moon occurs halfway through the
                lunar cycle; but it should remain clear as long as you separate the
                terms describing the lunar orbit (first quarter, etc.) from those
                describing the appearance of the Moon (half moon, etc.).
            </i>
            </p>
            <p>
                So that's what happens at each quarter. But what happens in between?
            </p>
            <p>
                Here are four more sketches, very similar to the previous ones. But
                this time, each is frozen at a point between quarters. Note what
                happens now when you lower yourself to Earth.
            </p>

            <div className="photo-row">
                {/* <Sketch sketchInstance={phaseView} containerRef={mainRef} quarter={0.5} allowAnimate={false} />
                <Sketch sketchInstance={phaseView} containerRef={mainRef} quarter={1.5} allowAnimate={false} /> */}
            </div>
            <br />
            <div className="photo-row">
                {/* <Sketch sketchInstance={phaseView} containerRef={mainRef} quarter={2.5} allowAnimate={false} />
                <Sketch sketchInstance={phaseView} containerRef={mainRef} quarter={3.5} allowAnimate={false} /> */}
            </div>
            <br />

            <p>
                These are the in-between phases, which are given two-part names
                according to their shape and their place in the cycle. The thin slice
                of moon is called a <term>crescent</term>, while the not-quite-full
                moon is called a <term>gibbous</term>. To distinguish between the
                crescents and gibbouses, we classify them as either <term>waxing</term>&nbsp;
                (growing towards full moon) or <term>waning</term> (shrinking towards
                new moon). This gives us four new phase names:&nbsp;
                <term>waxing crescent</term>, <term>waxing gibbous</term>,&nbsp;
                <term>waning gibbous</term>, and <term>waning crescent</term>.
            </p>
            <p>Thus, we have all eight phases of the moon.</p>

            {/* <Sketch sketchInstance={phaseView} containerRef={mainRef} quarter={0} allowAnimate={true} /> */}
            <br />
        </>
    );
}

export default Phases;