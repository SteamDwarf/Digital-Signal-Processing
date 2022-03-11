import Integral from "./Integral";
import { ICountFourierSum, IDecomposeFourierSeries, IGet0Koefficient, IGetNKoefficient, IntegrableFunction } from "./interfaces/interfaces";

class Furier {
    
    private static getA0: IGet0Koefficient = (integrableFunctions, upperLimit, lowerLimit, period) => {
        let a0: number = 2 / period * Integral.countSimpsonIntegral(integrableFunctions, upperLimit, lowerLimit, 0);
        return a0;
    }
    
    private static getAn: IGetNKoefficient = (integrableFunctions, upperLimit, lowerLimit, partMembers, period, frequency) => {
        let funcsMCos: IntegrableFunction = (t, koefficient) => integrableFunctions(t, koefficient) * Math.cos(koefficient * frequency * t);
        let anArray = new Array(partMembers).fill(0).map((a, i) => {
            let an = 2 / period * Integral.countSimpsonIntegral(funcsMCos, upperLimit, lowerLimit, i + 1);
            return an;
        });

        return anArray;
    }
    
    private static getBn: IGetNKoefficient = (integrableFunctions, upperLimit, lowerLimit, partMembers, period, frequency) => {
        let funcsMSin: IntegrableFunction = (t, koefficient) => integrableFunctions(t, koefficient) * Math.sin(koefficient * frequency * t);
        let bnArray = new Array(partMembers).fill(0).map((b, i) => {
            let bn = 2 / period * Integral.countSimpsonIntegral(funcsMSin, upperLimit, lowerLimit, i + 1);
            return bn;
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
        return Math.atan(bn / an);
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

    static decomposeInFourierSeries: IDecomposeFourierSeries = (beginPoint, endPoint, step, period, partMembers, decomposingFunctions, upperLimit, lowerLimit) => {
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
        
        for(let i = 0; /* i < 12 */ 0.001 < this.getPowerrLoss(Pc, Pk); i++) {
            console.log(this.getPowerrLoss(Pc, Pk));
            curPartMembers += 1;
            anArray = this.getAn(decomposingFunctions, upperLimit, lowerLimit, curPartMembers, period, frequency);
            bnArray = this.getBn(decomposingFunctions, upperLimit, lowerLimit, curPartMembers, period, frequency);
            amplitudes = this.getAmplitudes(anArray, bnArray);
            harmonicPhases = this.getHarmonicPhases(anArray, bnArray);
            frequencies = amplitudes.map((a, i) => (i + 1) * this.getFrequency(period))
            Pk = this.getHarmonicsPower(a0, amplitudes);
            
/*             console.log(Pk);
            console.log(Pc); */
        }

        /* let anArray: number[] = this.getAn(decomposingFunctions, upperLimit, lowerLimit, partMembers, period, frequency);
        let bnArray: number[] = this.getBn(decomposingFunctions, upperLimit, lowerLimit, partMembers, period, frequency);
        let amplitudes: number[] = [a0 / 2, ...this.getAmplitudes(anArray, bnArray)];
        let harmonicPhases: number[] = [0, ...this.getHarmonicPhases(anArray, bnArray)];
        let frequencies: number[] = amplitudes.map((a, i) => i * this.getFrequency(period)); */
        //let Pc = this.getAveragePower(period, decomposingFunctions);
        //let Pk = this.getHarmonicsPower(a0, amplitudes);
/*         console.log(amplitudes);
        console.log(harmonicPhases);
        console.log(frequencies);
        console.log(Pc);
        console.log(Pk);
        console.log(powerLoss); */


        do {
            lastX += step
            cordinatesX.push(lastX);
        } while(lastX < endPoint);
        
        cordinatesX.forEach((x) => {
            cordinatesY.push(this.countFourierSum(a0, anArray, bnArray, x, curPartMembers, frequency));
        });

        return {cordX: cordinatesX, cordY: cordinatesY, amplitudes, harmonicPhases, frequencies}
    }
}

export default Furier;
