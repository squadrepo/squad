export const getStandardPlural = (num) => num === 1 ? "" : "s";

export const getDateFromUnix = (unixTimeSeconds) => new Date(unixTimeSeconds * 1000);
export const getStringFromDate = (date) => date.toLocaleString('en-US', { weekday:"long", year:"numeric", month:"short", day:"numeric", hour: "2-digit", minute: "2-digit", hour12: true});
export const getStringDateFromUnix = (unixTimeSeconds) => getStringFromDate(getDateFromUnix(unixTimeSeconds));