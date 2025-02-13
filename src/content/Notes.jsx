import React from "react";

function Notes() {
    return (
        <>
            <hr />
            
            <h3>Notes</h3>

            <p>
                The simulations on this page made some assumptions for the sake of
                simplicity. None of these affect the fundamental concepts as presented,
                but here they are.
            </p>

            <ul>
                <li>
                    All orbits are assumed circular. In reality, orbits are elliptical.
                </li>
                <li>
                    Relatedly, the Earth-Moon system is not purely a matter of the Moon
                    orbiting the Earth, but rather of both bodies orbiting their
                    collective center of mass. This also applies when the Sun is brought
                    into the picture, but with infinitesimally small effect.
                </li>
                <li>
                    The Earth's equatorial plane is pictured as aligned with the ecliptic
                    plane, when it should really be at a 23.4° tilt. I mostly ignored this
                    because each body is rendered as a collection of longitudinal slices,
                    and I didn't want to deal with the lighting ramifications of a tilted
                    Earth. Similar things can be said about the Sun and the Moon.
                </li>
                <li>
                    All Earthbound views of the Moon are shown as seen from the Northern
                    Hemisphere. Views from the Southern Hemisphere would be reversed
                    (e.g., a waxing crescent would begin illuminating on the left side).
                </li>
                <li>
                    Relatedly, the exact timing of moonrise/set (as well as sunrise/set)
                    varies widely based on season and latitude. Technically, the sketches
                    shown on this page assume a view from the equator, on either of the
                    equinoxes -- yet still from the Northern Hemisphere.
                </li>
            </ul>
        </>
    );
}

export default Notes;