import React from "react";

function Introduction() {
    return (
        <>
            <hr />
            <h3>Introduction</h3>

            <p>This is the moon.</p>

            <img src="/img/moon-nasa.jpg" width="inherit" />
            <div className="caption">Image courtesy of NASA.</div>

            <p>
                We've all seen it, and most people are generally aware that its
                appearance changes according to a periodic cycle. But a peek at
                common Google searches suggests that our nearest celestial neighbor
                is frequently misunderstood.
            </p>

            <div className="photo-row">
                <img src="/img/why-does-the-moon.png" width="49.5%" />
                <img src="/img/why-is-the-moon.png" width="49.5%" />
            </div>

            <p>
                What I find exciting is that the answers to 70% of these questions
                lie in a basic understanding of the geometry of the Sun-Earth-Moon
                relationship, so that is what I will attempt to illuminate here. Is
                this the most important thing in the world? No. But I think it's
                fascinating anyway, and when seeing the Moon during the day has been
                cited as evidence of a <a href="https://www.instagram.com/reel/Cm97MoyjmPE/?ig_rid=cba7a786-08a8-42ad-bffe-b5fc9814be82" target="_blank">flat Earth</a>,
                perhaps it's a topic worth exploring.
            </p>

            <p>
            <i>
                Note that this page will not cover questions about the origins of the
                Moon, or how it came to be in its current state. For a much deeper
                cosmological and astrodynamic angle, I refer you to the brilliant
                work of&nbsp;
                <a href="https://ciechanow.ski/moon/" target="_blank">
                    Bartosz Ciechanowski
                </a>.
            </i>
            </p>
        </>
    );
}

export default Introduction;