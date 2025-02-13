import React from "react";

function Footer() {
    return (
        <footer>
            <hr />

            <p>
                Written and created by&nbsp;
                <a href="https://github.com/michaelschung/moon" target="_blank">
                    Michael Chung
                </a>.
            </p>

            <p style={{fontSize: "0.75em"}}>
                Special thanks to&nbsp;
                <a href="https://svs.gsfc.nasa.gov/" target="_blank">
                    NASA's Scientific Visualization Studio</a> and&nbsp;
                <a href="https://www.solarsystemscope.com/textures/" target="_blank">
                    Solar System Scope</a> for the beautiful free textures.
            </p>

        </footer>
    );
}

export default Footer;