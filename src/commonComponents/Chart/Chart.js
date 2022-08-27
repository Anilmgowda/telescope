import React from "react";
import HighchartsReact from "highcharts-react-official";

const Chart = ({highcharts,options}) => {
    return (
        <div>
            <HighchartsReact
                highcharts={highcharts}
                // constructorType={"chart"}
                options={options}
                // ref={"wrappedref"}
            />
        </div>
    )
}

export default Chart;
