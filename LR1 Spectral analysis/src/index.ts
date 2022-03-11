import Furier from "./Furier";
import Integral from "./Integral";
import { ChartPoints, IntegrableFunction } from "./interfaces/interfaces";

let pulseDuration: number = 80/* 88 */;
let period: number = 160/*88*//* Math.PI *//* 3 */;
let maxAmplitude: number = 50/* 40 */;
let beginPoint: number = -160;
let endPoint: number = 160;
let step: number = 0.01;
let partMembers: number = 6;
let lowerLimit = 0/* -period */;
let upperLimit = period /* + pulseDuration / 2 */;


function func(x: number): number {
    //ТАРАН
    if(x >= 0 && x < pulseDuration / 4) return maxAmplitude;
    else if(x >= pulseDuration / 4 && x < pulseDuration / 2) return -4 * maxAmplitude / pulseDuration * x + 2 * maxAmplitude;
    else if(x >= pulseDuration / 2 && x < period - pulseDuration / 2) return 0;
    else if(x >= period - pulseDuration / 2 && x < period - pulseDuration / 4) return 4 * maxAmplitude / pulseDuration * x - 4 * maxAmplitude * period / pulseDuration + 2 * maxAmplitude;
    else if(x >= period - pulseDuration / 4 && x < period) return maxAmplitude;
    return 0;

    //ЯНА
    /* x = Math.abs(x) % (period + pulseDuration / 2);
        
    if(x >= 0 && x < pulseDuration / 4) return maxAmplitude;
    else if(x >= pulseDuration / 4 && x < pulseDuration / 2) return 2 * maxAmplitude - 4 * maxAmplitude * x / pulseDuration;
    else if(x >= pulseDuration / 2 && x < period) return 0;
    else if(x >= period && x < period + pulseDuration / 4) return (4 * maxAmplitude / pulseDuration) * (x - period);
    else if(x >= period + pulseDuration / 4 && x <= period + pulseDuration / 2) return maxAmplitude;
    return 0; */
   /*  x = Math.abs(x) % period;

    if(x >= 0 && x < period / 2) 
        return 2 * x * maxAmplitude / period;
    else if(x >= period / 2 && x <= period) 
        return 2 * maxAmplitude * (x / period - 1);
    return 0; */
    //return x + 1;

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
        let chart = new google.visualization.ColumnChart(document.querySelector('#curve_chart') as Element);
        
        data.addColumn('number', 'x');
        data.addColumn('number', 'y');
        data.addRows(chartPoints.cordX.length);

        /* for (let i = 0; i < chartPoints.cordX.length; i++) {
            data.setCell(i, 0, chartPoints.cordX[i]);
            data.setCell(i, 1, chartPoints.cordY[i]);
        } */
        data.addRows(chartPoints.frequencies.length);

        for (let i = 0; i < chartPoints.frequencies.length; i++) {
            data.setCell(i, 0, chartPoints.frequencies[i]);
            data.setCell(i, 1, chartPoints.amplitudes[i]);
        }

        data.sort(0);
        chart.draw(data, options);
    }
}

let chartPoints: ChartPoints = Furier.decomposeInFourierSeries(beginPoint, endPoint, step, period /* + pulseDuration / 2 */, partMembers, func, upperLimit, lowerLimit);
/* let cordX = Integral.splitPlane(beginPoint, step, Math.floor((endPoint - beginPoint) / step));
let cordY = cordX.map(func);
let chartPoints = {cordX: cordX, cordY: cordY}; */
drawGraph(chartPoints);


/* console.log(Furier.getA0(integrableFunctions, upperLimits, lowerLimits)); */
/* console.log(Furier.getAn(integrableFunctions, upperLimits, lowerLimits, partMembers)); */
/* console.log(Furier.getBn(integrableFunctions, upperLimits, lowerLimits, partMembers)); */