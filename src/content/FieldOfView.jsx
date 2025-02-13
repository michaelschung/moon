import React from "react";

import { TimeScene, EverythingScene } from "../three/FOVScenes";

function FieldOfView() {
    return (
        <>
            <hr />
            
            <h2>What about the daytime?</h2>

            <p>
                Our final topic is potentially the most confusing, and was actually the
                primary inspiration for creating this page. I've often been asked by
                friends and family questions along the lines of: "Where is the Moon
                tonight?" or "Why can I see the Moon during the day?"
            </p>
            <p>
                Well, surprise, surprise -- these also come down to a discussion of the
                lunar cycle. But it'll take slightly more careful thought to understand
                the direct relationship between the phase of the Moon and when it's visible
                in the sky.
            </p>
            <p>
                Let's begin by anchoring our thinking in the two easiest phases to
                understand: new moon and full moon.
            </p>
            <p>
                At new moon, the Moon is in the same part of the sky as the Sun, with its
                dark side facing towards the Earth. Thus, with the exception of a solar
                eclipse, there is nothing for us to see either by day when the Moon is out
                with the Sun, or by night when the Moon is below the horizon.
            </p>

            <div className="slider-container">
                <div id="time-new-label" className="instructions top small">12:00 AM</div>
                <TimeScene type={"new"} />
                <div id="time-new-instr" className="instructions bottom small">(Sizes and distances not to scale)</div>
            </div>
            <br />

            <p>
                Take a close look at this sketch. The little red sphere represents
                a person on Earth, and the yellow circle represents the horizon from that
                person's perspective. This person begins the sketch at midnight, when
                they are on the side of the Earth directly opposite the Sun. They obviously
                can't see anything in the sky that's below their horizon since that would
                be looking through the Earth, but they can see everything above the horizon
                -- which in this case corresponds to everything on the non-Earth side of
                the yellow circle.
            </p>
            <p>
                Move the slider to rotate the Earth, shifting the scene forward in time.
                Note that the sun comes into the field of view right around 6:00 AM, which
                is also when the person crosses onto the lit side of the Earth -- this
                is sunrise. As the day continues until sunset, the Moon is within the
                person's field of view the entire time, but it's invisible because they
                are faced with its dark side.
            </p>
            <p>
                The opposite happens during full moon.
            </p>

            <div className="slider-container">
                <div id="time-full-label" className="instructions top small">12:00 PM</div>
                <TimeScene type={"full"} />
                <div id="time-full-instr" className="instructions bottom small">(Sizes and distances not to scale)</div>
            </div>
            <br />

            <p>
                This time, the person starts out at noon, but does not see the Moon until
                around 6:00 PM (sunset) because it is directly opposite the Sun. Now, as
                time moves forward, the Moon is within the field of view throughout the
                entire night, and is visible because its light side is facing the Earth.
            </p>
            <p>
                From these two extremes we learn:
            </p>
            <ul>
                <li>
                    At new moon, the Moon is up for 12 hours, from sunrise to
                    sunset, but it is invisible.
                </li>
                <li>
                    At full moon, the Moon is up for 12 hours, from sunset to
                    sunrise, and it is visible.
                </li>
            </ul>
            <p>
                Extrapolating from here, we can assume that for any point in the
                lunar cycle between these two, as long as the lunar phase is far
                enough from new moon for the Moon to be visible from Earth, there
                will always a 12-hour subset of the 24-hour day during which the
                Moon is in the sky.
            </p>

            <div className="slider-container">
                <div id="everything-label" className="instructions top small">12:00 AM</div>
                <EverythingScene />
                <div id="everything-instr" className="instructions bottom small">Hold mouse to move Moon</div>
            </div>
            <br />

            <p>
                Take your time with this sketch -- mess around until all of the pieces
                click! To check your understanding, answer the following questions (click
                on each to reveal answers).
            </p>

            <details>
                <summary role="button" className="outline secondary">
                    What time will moonrise/moonset be at exactly third quarter?
                </summary>
                <div className="solution">
                    <span className="term">Moonrise: midnight (12:00 AM)</span>
                    <span className="term">Moonset: noon (12:00 PM)</span>
                </div>  
            </details>

            <details>
                <summary role="button" className="outline secondary">
                    What time will moonrise/moonset be during the waxing gibbous phase,
                    on average?
                </summary>
                <div className="solution">
                    <span className="term">Moonrise: ~3:00 PM</span>
                    <span className="term">Moonset: ~3:00 AM</span>
                </div>
            </details>

            <details>
                <summary role="button" className="outline secondary">
                    You are driving to work at 9 AM, eastbound, and you see the Moon
                    right on the horizon. What phase is it in?
                </summary>
                <div className="solution">
                    <span className="term">Waxing crescent.</span>
                    <ul>
                        <li>
                            It's 9 AM, so the Sun is already high in the sky.
                        </li>
                        <li>
                            You are looking east, so the Moon is rising -- only a waxing
                            moon rises during the day.
                        </li>
                        <li>
                            A first quarter Moon would rise at noon, so this is before
                            first quarter.
                        </li>
                    </ul>
                </div>
            </details>

            <details>
                <summary role="button" className="outline secondary">
                    What is (most likely) the least-seen phase of the Moon (excluding
                    new moon)?
                </summary>
                <div className="solution">
                    <span className="term">
                        Waning gibbous. Rises ~9:00 PM and sets ~9:00 AM, aligning most
                        closely with regular sleeping hours.
                    </span>
                    <ul>
                        <li>
                            It's okay to disagree with this answer, as long as you can
                            back up your position.
                        </li>
                        <li>
                            But any waxing phase is almost certainly incorrect, due to
                            the fact that the waxing moon is up during the day.
                        </li>
                    </ul>
                </div>
            </details>
        </>
    );
}

export default FieldOfView;