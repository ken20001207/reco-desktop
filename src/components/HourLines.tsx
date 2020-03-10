import React from "react";
import { Divider } from "rsuite";

class HourLines extends React.Component {

    render() {
        var Hours = new Array(24);
        var h = 0;
        return Hours.map(() => {
            h++;
            return <Divider style={{position: "absolute", top: h*60, width: "100%"}} />
        })
    }
}

export default HourLines;