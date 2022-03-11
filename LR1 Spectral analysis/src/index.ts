import Furier from "./Furier";
import { GraphTypes } from "./types/enums";
import {SignalData } from "./types/interfaces";

const averagePowerHTMLValue = document.querySelector('#average-power_value') as HTMLElement;
const powerLossHTMLItems = document.querySelectorAll('[data-power-loss]') as NodeListOf<HTMLElement>;
const harmonicsCountHTMLItems = document.querySelectorAll('.harmonics-count_value') as NodeListOf<HTMLElement>;
const fourieBtn = document.querySelector('#fourie_btn') as HTMLButtonElement;
const amplitudeBtn = document.querySelector('#amplitude_btn') as HTMLButtonElement;
const phaseBtn = document.querySelector('#phase_btn') as HTMLButtonElement;
const informationBlock = document.querySelector('#graph-information_block') as HTMLElement;

let pulseDuration: number = 80;
let period: number = 160;
let maxAmplitude: number = 50;
let beginPoint: number = -160;
let endPoint: number = 160;
let step: number = 0.1;
let partMembers: number = 6;
let lowerLimit = 0;
let upperLimit = period;
let powerLoses: number[] = [];
let signalData: SignalData;


function func(x: number): number {
    if(x >= 0 && x < pulseDuration / 4) return maxAmplitude;
    else if(x >= pulseDuration / 4 && x < pulseDuration / 2) return -4 * maxAmplitude / pulseDuration * x + 2 * maxAmplitude;
    else if(x >= pulseDuration / 2 && x < period - pulseDuration / 2) return 0;
    else if(x >= period - pulseDuration / 2 && x < period - pulseDuration / 4) return 4 * maxAmplitude / pulseDuration * x - 4 * maxAmplitude * period / pulseDuration + 2 * maxAmplitude;
    else if(x >= period - pulseDuration / 4 && x < period) return maxAmplitude;
    return 0;
}

function getPowerLosses(powerLossesItems: NodeListOf<HTMLElement>) {
    powerLossesItems.forEach(item => {
        powerLoses.push(parseFloat(item.dataset.powerLoss as string));
    })
}

function setCharacteristics() {
    getPowerLosses(powerLossHTMLItems);
    powerLoses.forEach((powerLoss, i) => {
        signalData = Furier.decomposeInFourierSeries(beginPoint, endPoint, step, period, powerLoss, func, upperLimit, lowerLimit);
        harmonicsCountHTMLItems[i].textContent = signalData.amplitudes.length.toString();
    });
    averagePowerHTMLValue.textContent = signalData.averagePower.toFixed(3);
}

function showInformation(powerLoss: number) {
    signalData = Furier.decomposeInFourierSeries(beginPoint, endPoint, step, period, powerLoss, func, upperLimit, lowerLimit);
    drawGraph(signalData.cordX, signalData.cordY, GraphTypes.lines);
}

function createInformationItem(tag: string, text: string) {
    let infoItem = document.createElement(tag);

    infoItem.textContent = text;
    infoItem.classList.add('graph-information_item');

    return infoItem;
}

function appendInformation(parent: HTMLElement, infoArray: number[] | string[], label: string = '') {
    infoArray.forEach((value, i) => {
        parent.append(createInformationItem('div', `${label} ${i + 1} гармоники - ${value}`));
    });
}

function drawGraph(xData: number[], yData: number[], graphTypes: GraphTypes) {
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);
    
        function drawChart() {
            const data = new google.visualization.DataTable();
            let chart;
            let options: any = {
                curveType: 'function',
                title: `Функция`,
                legend: 'none',
                focusTarget: 'category',
                }; 
            
            if(graphTypes === GraphTypes.column)
                chart = new google.visualization.ColumnChart(document.querySelector('#curve_chart') as Element);
            else
                chart = new google.visualization.LineChart(document.querySelector('#curve_chart') as Element);
            
            data.addColumn('number', 'x');
            data.addColumn('number', 'y');
            data.addRows(xData.length);
    
            for (let i = 0; i < xData.length; i++) {
                data.setCell(i, 0, xData[i]);
                data.setCell(i, 1, yData[i]);
            }
    
            data.sort(0);
            chart.draw(data, options);
        }

        informationBlock.innerHTML = '';
    }


powerLossHTMLItems.forEach(item => {
    item.addEventListener('click', () => {
        showInformation(parseFloat(item.dataset.powerLoss as string));
    })
})

fourieBtn.addEventListener('click', () => {
    drawGraph(signalData.cordX, signalData.cordY, GraphTypes.lines);
});
amplitudeBtn.addEventListener('click', () => {
    drawGraph(signalData.frequencies, signalData.amplitudes, GraphTypes.column);
    appendInformation(informationBlock, signalData.amplitudes, 'Амплитуда');
});
phaseBtn.addEventListener('click', () => {
    drawGraph(signalData.frequencies, signalData.harmonicPhases, GraphTypes.column);
    appendInformation(informationBlock, signalData.harmonicPhases, 'Фаза')
});

setCharacteristics();
showInformation(0.001);






