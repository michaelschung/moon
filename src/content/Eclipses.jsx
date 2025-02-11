import React from "react";

import { EclipseScene } from "../three/EclipseScenes";

function Eclipses() {
    return (
        <>
            <hr />
            
            <h2>What about eclipses?</h2>

            <p>
                An <span>eclipse</span> is when one celestial body passes into the
                shadow of another. On Earth, we experience two main types of eclipses.
            </p>
            <p>
                A <span>lunar eclipse</span> is when the Moon passes into the shadow
                of the Earth; from the perspective of the Earth, the Moon goes dark.
            </p>

            <div className="slider-container">
                <EclipseScene type={"lunar"} />
                <div id="lunar-eclipse-instr" className="instructions bottom">(Sizes and distances not to scale)</div>
            </div>
            <br />

            <p>
                A <span>solar eclipse</span> is when the Earth passes under the
                shadow of the Moon; from the perspective of the Earth, the sun
                becomes blocked from view.
            </p>

            <div className="slider-container">
                <EclipseScene type={"solar"} />
                <div id="solar-eclipse-instr" className="instructions bottom">(Sizes and distances not to scale)</div>
            </div>
            <br />

            <p>
                Take a look at this setup of the Sun, Earth, and Moon.
            </p>

            <div id="allEcliptic" className="sketch-container"></div>
            <br />

            <p>
                If you play with the slider, you'll see that all of the movement is
                happening in the same plane -- specifically, the plane defined by the
                orbit of the Earth around the Sun. We call this the&nbsp;
                <span>ecliptic plane</span>, and it's shown here in blue. If the orbit
                of the Moon lay exactly in the ecliptic plane as shown, then every new
                and full moon would bring a solar and lunar eclipse, respectively.
            </p>
            <p>
                In reality, nothing is so perfectly aligned. The Moon's orbital plane
                lies tilted at a 5° angle from the ecliptic plane, so the three
                bodies don't usually line up perfectly enough for an eclipse to
                happen. But it is important to note that while not every full moon
                brings a lunar eclipse, the full moon is still the only phase in which
                a lunar eclipse <i>can</i> occur. The same relationship exists between
                solar eclipses and the new moon.
            </p>

            <div id="moonTilt" className="sketch-container"></div>
            <br />

            <p>
            <i>
                Note: This sketch exaggerates the Moon's orbital tilt to 20°, just to
                illustrate the point. Though the true tilt is much smaller, the greater
                distances involved mean that eclipses of all kinds are far less common
                than this sketch would make it seem.
            </i>
            </p>
            <p>
                In any case, wow are we lucky that these sometimes line up, because the
                results are breathtaking.
            </p>

            <div className="photo-row">
                <img src="/img/eclipse-lunar-total.jpg" width="49.5%" />
                <img src="/img/eclipse-solar-annular.jpg" width="49.5%" />
            </div>
            <img src="/img/eclipse-solar-full.jpg" width="100%" style={{marginTop: "-0.6em"}} />
            <div className="caption">Images courtesy of NASA.</div>

            <p>Extra notes on eclipses:</p>
            <ul>
                <li>
                    During a lunar eclipse (especially a total lunar eclipse), the bending
                    of sunlight through the Earth's atmosphere turns the moon a
                    reddish-orange color, often called a <span>blood moon</span>.&nbsp;
                    <a href="https://www.nhm.ac.uk/discover/lunar-eclipse-guide-what-they-are-when-to-see-them-and-where.html" target="_blank">
                        Read more about lunar eclipses here.</a>
                </li>
                <li>
                    Our solar eclipses are a special miracle. The Moon is about 400 times
                    smaller than the Sun, but the Sun is just about 400 times farther away.
                    The result is that from our perspective on Earth, the two bodies appear
                    almost exactly the same size. This has a massive effect on the
                    spectacular visual of the Sun's corona that we experience during a
                    total solar eclipse: if the sizes or distances were shifted just a
                    little bit, we'd either never get full coverage of the Sun, or the much
                    larger Moon would simply blot out the corona.
                </li>
                <li>
                    We actually do have solar eclipses without full coverage of the Sun;
                    these are called <span>annular solar eclipses</span>, and they're
                    beautiful in their own right (see upper-right image above). This
                    happens due to the fact that the Moon's orbit is not perfectly circular
                    -- a detail that we're skipping in this page for the sake of simplicity.&nbsp;
                    <a href="https://www.nesdis.noaa.gov/annular-solar-eclipse" target="_blank">
                        Read more about annular solar eclipses here</a>, or check out the
                    aforementioned <a href="https://ciechanow.ski/moon/" target="_blank">
                        Bartosz Ciechanowski's</a> blog for a detailed breakdown of
                    elliptical orbits.
                </li>
            </ul>
        </>
    );
}

export default Eclipses;