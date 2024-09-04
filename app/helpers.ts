export const kelvinToCelsius = (kelvins: number) => {
    return Math.round((kelvins - 273.15) * 100) / 100;
};