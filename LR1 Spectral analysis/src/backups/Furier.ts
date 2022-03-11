import Integral from "./Integral";
import { ICountFourierSum, IDecomposeFourierSeries, IGet0Koefficient, IGetNKoefficient, IntegrableFunction } from "./interfaces/interfaces";

class Furier {

    private static getFuncsMCos = (integrableFunctions: IntegrableFunction[], period: number): IntegrableFunction[] => {
        const funcsMCos = integrableFunctions.map((func) => {
            return (t: number, koefficient: number) => func(t, koefficient) * Math.cos(koefficient * this.getFrequency(period) * t)
        });
    
        return funcsMCos;
    }
    private static getFuncsMSin = (integrableFunctions: IntegrableFunction[], period: number): IntegrableFunction[] => {
        const funcsMSin = integrableFunctions.map((func) => {
            return (t: number, koefficient: number) => func(t, koefficient) * Math.sin(koefficient * this.getFrequency(period) * t)
        });
    
        return funcsMSin;
    }
    
    private static getA0: IGet0Koefficient = (integrableFunctions, upperLimit, lowerLimit, period) => {
        let a0: number = 2 / period * Integral.countSimpsonIntegral(integrableFunctions, upperLimit, lowerLimit, 0);
        return a0;
    }
    
    private static getAn: IGetNKoefficient = (integrableFunctions, upperLimit, lowerLimit, partMembers, period) => {
        let funcsMCos: IntegrableFunction = (t, koefficient) => integrableFunctions(t, koefficient) * Math.cos(koefficient * this.getFrequency(period) * t);
        let anArray = new Array(partMembers).fill(0).map((a, i) => {
            let an = 2 / period * Integral.countSimpsonIntegral(funcsMCos, upperLimit, lowerLimit, i + 1);
            return an;
        });

        return anArray;
    }
    
    private static getBn: IGetNKoefficient = (integrableFunctions, upperLimit, lowerLimit, partMembers, period) => {
        let funcsMSin: IntegrableFunction = (t, koefficient) => integrableFunctions(t, koefficient) * Math.sin(koefficient * this.getFrequency(period) * t);
        let bnArray = new Array(partMembers).fill(0).map((b, i) => {
            let bn = 2 / period * Integral.countSimpsonIntegral(funcsMSin, upperLimit, lowerLimit, i + 1);
            return bn;
        });

        return bnArray;
    }
    
    private static countFourierSum: ICountFourierSum = (a0, anArray, bnArray, x, partMembers, period) => {
        let yRes: number = a0/ 2;
        let ik
        
        for(let i = 0; i < partMembers; i++) {
            let part;
            ik = i + 1;
            part = anArray[i] * Math.cos(ik * this.getFrequency(period) * x) + bnArray[i] * Math.sin(ik * this.getFrequency(period) *x);
            yRes += part;
        }

        /* yRes += new Array(partMembers).fill(0).reduce((sum, curValue, i) => {
            let ik = i + 1;
            return sum + anArray[i] * Math.cos(ik * this.getFrequency(period) * x) + bnArray[i] * Math.sin(ik * this.getFrequency(period) * x);
        }); */
    
        
/*         console.log(anArray);
        console.log(bnArray); */

        return yRes;
    }
    
    private static getFrequency = (period: number): number => {
        return 2 * Math.PI / period; 
    }

    static decomposeInFourierSeries: IDecomposeFourierSeries = (beginPoint, endPoint, step, period, partMembers, decomposingFunctions, upperLimit, lowerLimit) => {
        let cordinatesX: number[] = [beginPoint];
        let cordinatesY: number[] = [];
        let lastX: number = beginPoint;
        let a0: number = this.getA0(decomposingFunctions, upperLimit, lowerLimit, period);
        let anArray: number[] = this.getAn(decomposingFunctions, upperLimit, lowerLimit, partMembers, period);
        let bnArray: number[] = this.getBn(decomposingFunctions, upperLimit, lowerLimit, partMembers, period);

        do {
            lastX += step
            cordinatesX.push(lastX);
        } while(lastX < endPoint);

        cordinatesX.forEach((x) => {
            cordinatesY.push(this.countFourierSum(a0, anArray, bnArray, x, partMembers, period));
        });

        return {cordX: cordinatesX, cordY: cordinatesY}
    }
}

export default Furier;
