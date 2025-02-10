import React, { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";

import { Slider } from "../three/Utils";
import { MoonPhases, MoonRevolve, MoonQuarters, PhaseView, PhaseScene } from "../three/PhaseScenes";

function Phases() {
    return (
        <>
        <hr />

        <h2>Why does the Moon have phases?</h2>

        <p>
            Let's begin by examining the phases of the Moon. For the purpose of
            demonstration, we'll use this little model. It's not as pretty as the
            real thing, but it'll do.
        </p>

        <Canvas className="sketch-container three-two">
            <MoonPhases />
        </Canvas>

        <p>
            The key to everything lies in the position of the Moon relative to the
            Earth, and the position of the Earth-Moon system relative to the Sun. So
            let's break that down.
        </p>
        <p>
            The Moon revolves around the Earth just about once every four weeks.
            That looks something like this (sizes to scale, distances <i>not</i>
            &nbsp;to scale).
        </p>

        <Canvas className="sketch-container three-two">
            <MoonRevolve />
        </Canvas>

        <p>
            Both bodies are illuminated on the same side -- this is due to the Sun,
            which is shining from over 90 million miles away.
        </p>
        <p>
            It probably goes without saying, but note that exactly half of the Moon
            is illuminated at all times, no matter where it is in its orbit around
            the Earth. This tells us that the phases we observe are all a matter of
            perspective. But more on that in a bit -- let's first take a moment to
            define a bit of spaninology that we'll need moving forward.
        </p>
        <p>
            The lunar cycle is split into four quarters, beginning and ending with
            the <span>new moon</span>, when the Moon is directly between the Earth
            and the Sun. Click on the sketch below to move the Moon between each
            quarter.
        </p>

        <Canvas className="sketch-container one-one">
            <MoonQuarters />
        </Canvas>

        <p>
            Not coincidentally, these are four of the phases of the moon:&nbsp;
            <span>new moon</span>, <span>first quarter</span>,&nbsp;
            <span>full moon</span>, and <span>third quarter</span> (a.k.a.&nbsp;
            <span>last quarter</span>). Perhaps you can already see how these names
            and positions translate to the corresponding Earthbound visuals that
            we're familiar with, but here are four sketches to fully make the
            connection. Try moving the sliders to transition from orbit view to
            Earth view.
        </p>

        <div className="photo-row">
            <div className="slider-container">
                <PhaseScene quarter={0} allowAnimate={false} />
            </div>
            <div className="slider-container">
                <PhaseScene quarter={1} allowAnimate={false} />
            </div>
        </div>
        <br />
        <div className="photo-row">
            <div className="slider-container">
                <PhaseScene quarter={2} allowAnimate={false} />
            </div>
            <div className="slider-container">
                <PhaseScene quarter={3} allowAnimate={false} />
            </div>
        </div>
        <br />

        <p>
            <i>
            Note: the first quarter and third quarter Moon are often referred to
            as <span>half moon</span>, due to the fact that it appears
            half-illuminated as compared to the full moon. This is sometimes
            slightly confusing since the full moon occurs halfway through the
            lunar cycle; but it should remain clear as long as you separate the
            spans describing the lunar orbit (first quarter, etc.) from those
            describing the appearance of the Moon (half moon, etc.).
            </i>
        </p>
        <p>
            So that's what happens at each quarter. But what happens in between?
        </p>
        <p>
            Here are four more sketches, very similar to the previous ones. But this
            time, each is frozen at a point between quarters. Note what happens now
            when you lower yourself to Earth.
        </p>

        <div className="photo-row">
            <div className="slider-container">
                <PhaseScene quarter={0.5} allowAnimate={false} />
            </div>
            <div className="slider-container">
                <PhaseScene quarter={1.5} allowAnimate={false} />
            </div>
        </div>
        <br />
        <div className="photo-row">
            <div className="slider-container">
                <PhaseScene quarter={2.5} allowAnimate={false} />
            </div>
            <div className="slider-container">
                <PhaseScene quarter={3.5} allowAnimate={false} />
            </div>
        </div>
        <br />

        <p>
            These are the in-between phases, which are given two-part names
            according to their shape and their place in the cycle. The thin slice of
            moon is called a <span>crescent</span>, while the not-quite-full moon is
            called a <span>gibbous</span>. To distinguish between the crescents and
            gibbouses, we classify them as either <span>waxing</span>&nbsp; (growing
            towards full moon) or <span>waning</span> (shrinking towards new moon).
            This gives us four new phase names:&nbsp;
            <span>waxing crescent</span>, <span>waxing gibbous</span>,&nbsp;
            <span>waning gibbous</span>, and <span>waning crescent</span>.
        </p>
        <p>Thus, we have all eight phases of the moon.</p>

        {/* <Sketch sketchInstance={phaseView} containerRef={mainRef} quarter={0} allowAnimate={true} /> */}
        <br />
        </>
    );
}

export default Phases;
