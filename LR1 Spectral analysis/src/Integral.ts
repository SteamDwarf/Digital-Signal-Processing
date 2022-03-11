import { ICountComplexSimpsonProps, IGetFunctionValueProps, ISimpsonCountProps } from "./types/interfaces";

class Integral {
    private static getIntegrationStep = (upperLimit: number, lowerLimit: number): number[] => {
        let step: number;
        let segmentsCount: number;
        let maxStep: number = 0.00001 ** (1/4);
    
        segmentsCount = Math.ceil((upperLimit - lowerLimit) / maxStep);
        segmentsCount % 2 !== 0 ? ++segmentsCount : segmentsCount;
        step = ((upperLimit - lowerLimit) / segmentsCount);
    
        return [step, segmentsCount];
    }
    
    static splitPlane = (beginPoint: number, step: number, segmentsCount: number): number[] => {
        let cordinatesX: number[] = [beginPoint];
    
        for(let i = 0; i < segmentsCount; i++) {
            cordinatesX.push(cordinatesX[i] + step);
        }
    
        return cordinatesX;
    }
    
    private static getFunctionValue:IGetFunctionValueProps = (integrableFunction, cordinatesX, koefficientNumber, functionPow): number[] => {    
        let cordinatesY: number[] = []; 

        cordinatesX.forEach(x => {
            cordinatesY.push(Math.pow(integrableFunction(x, koefficientNumber), functionPow));
        });
    
        return cordinatesY;
    }
    
    private static getIntegral = (cordinatesY: number[], step: number) => {
        let amountY: number = cordinatesY.length;
        let sumY: number = 0;
        let sumOddY: number = 0;
        let sumEvenY: number = 0;
        let integral: number;
    
        for(let i = 1; i < amountY; i += 2) {
            sumY += cordinatesY[i];
        }
    
        sumOddY = 4 * sumY;
        sumY = 0;
        
        for(let i = 2; i < amountY - 1; i += 2) {
            sumY += cordinatesY[i];
        }
    
        sumEvenY = 2 * sumY;
        integral = step / 3 * (cordinatesY[0] + cordinatesY[amountY - 1] + sumEvenY + sumOddY);
    
        return integral;
    }

    static countComplexSimpson: ICountComplexSimpsonProps = (integrableFunctions, upperLimits, lowerLimits, koefficientNumber, functionPow = 1): number => {
        const integral = integrableFunctions.reduce((sum, currentFunction, i) => {
            return sum + this.countSimpsonIntegral(currentFunction, upperLimits[i], lowerLimits[i], koefficientNumber, functionPow);
        }, 0);

        return integral;
    } 

    static countSimpsonIntegral: ISimpsonCountProps = (integrableFunction, upperLimit, lowerLimit, koefficientNumber, functionPow = 1): number => {
        let [step, segmentsCount] = this.getIntegrationStep(upperLimit, lowerLimit);
        let cordinatesX = this.splitPlane(lowerLimit, step, segmentsCount);
        let cordinatesY = this.getFunctionValue(integrableFunction, cordinatesX, koefficientNumber, functionPow);
        let integral = this.getIntegral(cordinatesY, step);
        
        return integral;
    }
}

export default Integral