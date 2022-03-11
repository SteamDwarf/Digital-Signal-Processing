export interface ICountComplexSimpsonProps {
    (
        integrableFunctions: IntegrableFunction[],
        upperLimits: number[], 
        lowerLimits: number[], 
        koefficientNumber: number, 
        functionPow?: number
    ): number
}

export interface ISimpsonCountProps {
    (
        integrableFunction: IntegrableFunction,
        upperLimit: number, 
        lowerLimit: number, 
        koefficientNumber: number, 
        functionPow?: number
    ): number
}

export interface IGetFunctionValueProps {
    (
        integrableFunctions: IntegrableFunction,
        cordinatesX: number[],
        koefficientNumber: number,
        functionPow: number
    ): number[]
}

export interface IGet0Koefficient {
    (
        integrableFunctions: IntegrableFunction, 
        upperLimit: number, 
        lowerLimit: number,
        period: number
    ): number
}

export interface IGetNKoefficient {
    (
        integrableFunctions: IntegrableFunction, 
        upperLimit: number, 
        lowerLimit: number, 
        koefficient: number,
        period: number,
        frequency: number
    ): number
}
export interface IGetNKoefficientArray {
    (
        integrableFunctions: IntegrableFunction, 
        upperLimit: number, 
        lowerLimit: number, 
        partMembers: number,
        period: number,
        frequency: number
    ): number[]
}

export interface ICountFourierSum {
    (
        a0: number,
        anArray: number[], 
        bnArray: number[], 
        x: number, 
        partMembers: number, 
        requency: number
    ): number
}

export interface IDecomposeFourierSeries {
    (
        beginPoint: number,
        endPoint: number,
        step: number,
        period: number,
        powerLoss: number,
        decomposingFunctions: IntegrableFunction,
        upperLimit: number,
        lowerLimit: number
    ): SignalData
}

export type simpleFunc = {
    (t: number): number
}

export type funcWithK = {
    (t: number, koefficientNumber: number): number
}

export type IntegrableFunction = simpleFunc | funcWithK;

export type SignalData = {
    cordX: number[],
    cordY: number[],
    amplitudes: number[],
    harmonicPhases: number[],
    frequencies: number[],
    averagePower: number;
}


