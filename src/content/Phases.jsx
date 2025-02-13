import React from "react";
import { Canvas } from "@react-three/fiber";
import { MoonPhases, MoonRevolve, MoonQuarters, PhaseScene } from "../three/PhaseScenes";

function Phases() {
    return (
        <>
        <hr />

        <h2>Why does the Moon have phases?</h2>

        <p>
            Let's begin by examining the phases of the Moon. For the purpose of
            demonstration, we'll use this render. It's not as pretty as the
            real thing, but at least it's something we can control.
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
            which is shining from over 90 million miles away (i.e., way off to the
            left).
        </p>
        <p>
            It probably goes without saying, but note that exactly half of the Moon
            is illuminated at all times, no matter where it is in its orbit around
            the Earth. This tells us that the phases we observe are all a matter of
            perspective. But more on that in a bit -- let's first take a moment to
            define a bit of terminology that we'll need moving forward.
        </p>
        <p>
            The lunar cycle is split into four quarters, beginning and ending with
            the <span className="term">new moon</span>, when the Moon is directly between the Earth
            and the Sun. Click on the sketch below to move the Moon between each
            quarter.
        </p>

        <div>
            <div id="next-quarter-instr" className="instructions top no-slider">Click for next quarter</div>
            <Canvas className="sketch-container one-one">
                <MoonQuarters />
            </Canvas>
        </div>

        <p>
            Not coincidentally, these are four of the phases of the moon:&nbsp;
            <span className="term">new moon</span>, <span className="term">first quarter</span>,&nbsp;
            <span className="term">full moon</span>, and <span className="term">third quarter</span> (a.k.a.&nbsp;
            <span className="term">last quarter</span>). Perhaps you can already see how these names
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
            as <span className="term">half moon</span>, due to the fact that it appears
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
            moon is called a <span className="term">crescent</span>, while the not-quite-full moon is
            called a <span className="term">gibbous</span>. To distinguish between the crescents and
            gibbouses, we classify them as either <span className="term">waxing</span> (growing
            towards full moon) or <span className="term">waning</span> (shrinking towards new moon).
            This gives us four new phase names:&nbsp;
            <span className="term">waxing crescent</span>, <span className="term">waxing gibbous</span>,&nbsp;
            <span className="term">waning gibbous</span>, and <span className="term">waning crescent</span>.
        </p>
        <p>Thus, we have all eight phases of the moon.</p>

        <div className="slider-container">
            <div id="all-phases-instr" className="instructions top">Click to start animation</div>
            <PhaseScene quarter={0} allowAnimate={true} />
        </div>
        </>
    );
}

export default Phases;
