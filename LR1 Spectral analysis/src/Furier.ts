import Integral from "./Integral";
import { ICountFourierSum, IDecomposeFourierSeries, IGet0Koefficient, IGetNKoefficient, IGetNKoefficientArray, IntegrableFunction } from "./types/interfaces";

class Furier {
    
    private static getA0: IGet0Koefficient = (integrableFunctions, upperLimit, lowerLimit, period) => {
        let a0: number = 2 / period * Integral.countSimpsonIntegral(integrableFunctions, upperLimit, lowerLimit, 0);
        return a0;
    }

    private static getAn: IGetNKoefficient = (integrableFunction, upperLimit, lowerLimit, koefficient, period, frequency) => {
        let funcsMCos: IntegrableFunction = (t, koefficient) => integrableFunction(t, koefficient) * Math.cos(koefficient * frequency * t);
        return 2 / period * Integral.countSimpsonIntegral(funcsMCos, upperLimit, lowerLimit, koefficient);
    }
    
    private static getAnArray: IGetNKoefficientArray = (integrableFunction, upperLimit, lowerLimit, partMembers, period, frequency) => {
        let anArray = new Array(partMembers).fill(0).map((a, i) => {
            return this.getAn(integrableFunction, upperLimit, lowerLimit, i + 1, period, frequency);
        });

        return anArray;
    }
    
    private static getBn: IGetNKoefficient = (integrableFunction, upperLimit, lowerLimit, koefficient, period, frequency) => {
        let funcsMSin: IntegrableFunction = (t, koefficient) => integrableFunction(t, koefficient) * Math.sin(koefficient * frequency * t);
        return 2 / period * Integral.countSimpsonIntegral(funcsMSin, upperLimit, lowerLimit, koefficient);
    }

    private static getBnArray: IGetNKoefficientArray = (integrableFunction, upperLimit, lowerLimit, partMembers, period, frequency) => {
        let bnArray = new Array(partMembers).fill(0).map((b, i) => {
            return this.getBn(integrableFunction, upperLimit, lowerLimit, i + 1, period, frequency);
        });

        return bnArray;
    }
    
    private static countFourierSum: ICountFourierSum = (a0, anArray, bnArray, x, partMembers, frequency) => {
        let yRes: number = a0/ 2;
        yRes += anArray.reduce((sum, a, i) => sum + a * Math.cos((i + 1) * frequency * x) + bnArray[i] * Math.sin((i + 1) * frequency *x),0);
        
        return yRes;
    }
    
    private static getFrequency = (period: number): number => {
        return 2 * Math.PI / period; 
    }
    private static getAmplitude(an: number, bn: number): number {
        return Math.sqrt(an**2 + bn**2);
    }
    private static getAmplitudes(anArray: number[], bnArray: number[]): number[] {
        return anArray.map((a, i) => this.getAmplitude(a, bnArray[i]));
    }
    private static getHarmonicPhase(an: number, bn: number): number {
        return Math.atan2(bn, an);
    }
    private static getHarmonicPhases(anArray: number[], bnArray: number[]): number[] {
        return anArray.map((a, i) => this.getHarmonicPhase(a, bnArray[i]));
    }
    private static getAveragePower(period: number, func: (x: number, koefficient: number) => number): number {
        return 1 / period * Integral.countSimpsonIntegral((x: number) => (func(x, 0) ** 2), period, 0, 0);
    }
    private static getHarmonicsPower(a0: number, amplitudes: number[]): number {
        let power = (a0 / 2) ** 2 + 0.5 * amplitudes.reduce((sum, curAmplitude) => sum + curAmplitude**2, 0);
        return power;
    }
    private static getPowerrLoss(Pc: number, Pk: number): number {
        return (Pc - Pk) / Pc;
    }

    static decomposeInFourierSeries: IDecomposeFourierSeries = (beginPoint, endPoint, step, period, powerLoss, decomposingFunctions, upperLimit, lowerLimit) => {
        let cordinatesX: number[] = [beginPoint];
        let cordinatesY: number[] = [];
        let lastX: number = beginPoint;
        let frequency = this.getFrequency(period);
        let frequencies: number[] = [];
        let a0: number = this.getA0(decomposingFunctions, upperLimit, lowerLimit, period);
        let anArray: number[] = [];
        let bnArray: number[] = [];
        let amplitudes: number[] = [];
        let harmonicPhases: number[] = [];
        let Pc = this.getAveragePower(period, decomposingFunctions);
        let Pk = this.getHarmonicsPower(a0, amplitudes);
        let curPartMembers = 0;
        
        for(let i = 0; powerLoss < this.getPowerrLoss(Pc, Pk); i++) {
            curPartMembers += 1;
            anArray.push(this.getAn(decomposingFunctions, upperLimit, lowerLimit, curPartMembers, period, frequency));
            bnArray.push(this.getBn(decomposingFunctions, upperLimit, lowerLimit, curPartMembers, period, frequency));
            amplitudes.push(this.getAmplitude(anArray[curPartMembers - 1], bnArray[curPartMembers - 1]));
            Pk = this.getHarmonicsPower(a0, amplitudes);
        }

        frequencies = amplitudes.map((a, i) => (i + 1) * this.getFrequency(period));
        harmonicPhases = this.getHarmonicPhases(anArray, bnArray);
        console.log(harmonicPhases);

        do {
            lastX += step
            cordinatesX.push(lastX);
        } while(lastX < endPoint);
        
        cordinatesX.forEach((x) => {
            cordinatesY.push(this.countFourierSum(a0, anArray, bnArray, x, curPartMembers, frequency));
        });

        return {cordX: cordinatesX, cordY: cordinatesY, amplitudes, harmonicPhases, frequencies, averagePower: Pc}
    }
}

export default Furier;
