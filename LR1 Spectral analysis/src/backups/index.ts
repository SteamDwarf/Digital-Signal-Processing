import Furier from "./Furier";
import Integral from "./Integral";
import { ChartPoints, IntegrableFunction } from "./interfaces/interfaces";

let period: number = 160;
let maxAmplitude: number = 50;
let pulseDuration: number = 80;
let beginPoint: number = -7;
let endPoint: number = 7;
let step: number = 0.01;
let partMembers: number = 50;
let lowerLimit = 0;
let upperLimit = period;


function func(x: number): number {

    x = Math.abs(x) % (period + pulseDuration / 2);
        
    if(x >= 0 && x < pulseDuration / 4) return maxAmplitude;
    else if(x >= pulseDuration / 4 && x < pulseDuration / 2) return 2 * maxAmplitude - 4 * maxAmplitude * x / pulseDuration;
    else if(x >= pulseDuration / 2 && x < period) return 0;
    else if(x >= period && x < period + pulseDuration / 4) return (4 * maxAmplitude / pulseDuration) * (x - period);
    else if(x >= period + pulseDuration / 4 && x <= period + pulseDuration / 2) return maxAmplitude;
    /* x = Math.abs(x) % period;

    if(x >= 0 && x < period / 2) 
        return 2 * x * maxAmplitude / period;
    else if(x >= period / 2 && x <= period) 
        return 2 * maxAmplitude * (x / period - 1); */
    return 0;

}




function drawGraph(chartPoints: ChartPoints) {

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        const data = new google.visualization.DataTable();

        let options: any = {
            curveType: 'function',
            title: `Функция`,
            legend: 'none',
            focusTarget: 'category',
            }; 
        let chart = new google.visualization.LineChart(document.querySelector('#curve_chart') as Element);
        
        data.addColumn('number', 'x');
        data.addColumn('number', 'y');
        data.addRows(chartPoints.cordX.length);

        for (let i = 0; i < chartPoints.cordX.length; i++) {
            data.setCell(i, 0, chartPoints.cordX[i]);
            data.setCell(i, 1, chartPoints.cordY[i]);
        }

        data.sort(0);
        chart.draw(data, options);
    }
}

let chartPoints: ChartPoints = Furier.decomposeInFourierSeries(beginPoint, endPoint, step, period, partMembers, func, upperLimit, lowerLimit);
/* let cordX = Integral.splitPlane(beginPoint, step, Math.floor((endPoint - beginPoint) / step));
let cordY = cordX.map(func);
let chartPoints = {cordX: cordX, cordY: cordY}; */
drawGraph(chartPoints);


/* console.log(Furier.getA0(integrableFunctions, upperLimits, lowerLimits)); */
/* console.log(Furier.getAn(integrableFunctions, upperLimits, lowerLimits, partMembers)); */
/* console.log(Furier.getBn(integrableFunctions, upperLimits, lowerLimits, partMembers)); */