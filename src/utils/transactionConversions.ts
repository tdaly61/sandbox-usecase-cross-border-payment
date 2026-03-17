export const convertUSDtoZAR = (amount: number): number => {
    const fxRateUSDtoZAR = 18.5; // Example rate: 1 USD = 18.5 ZAR
    return amount * fxRateUSDtoZAR;
};

export const convertZWGtoUSD = (amount: number): number => {
    const fxRateZWGtoUSD = 0.0028; // Example rate: 1 ZWL = 0.0028 USD
    return amount * fxRateZWGtoUSD;
};

export const convertZWGtoZAR = (amount: number, getFXRateZWGFtoZAR:number): number => {
    return amount * getFXRateZWGFtoZAR;
};

export const applyTransactionFee = (amount: number, feePercentage: number): number => {
    const fee = amount * feePercentage;
    return amount - fee;
};

export const getTransactionFeeAmount = (amount: number, feePercentage: number): number => {
    return amount * feePercentage;
};

export const getFXRateZWGFtoZAR = (): number => {
    return 0.70;
};

export const getFXRateZARtoUSD = (): number => {
    // This function can be expanded to fetch the latest FX rate from an API or database
    return 1 / 18.5; // Example rate: 1 ZAR = 1/18.5 USD
}

export const getFXRateZWGtoUSD = (): number => {
    // This function can be expanded to fetch the latest FX rate from an API or database
    return 0.0028; // Example rate: 1 ZWL = 0.0028 USD
};

export const getFXRateUSDtoZAR = (): number => {
    // This function can be expanded to fetch the latest FX rate from an API or database
    return 18.5; // Example rate: 1 USD = 18.5 ZAR
};

export const getFeeAmount = (): number => {
    // This function can be expanded to fetch the latest transaction fee from an API or database
    return 20; 
}