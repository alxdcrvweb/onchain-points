export const getColor = (league: string) => {
    switch (league) {
        case 'Bronze':
            return '108deg, #853505 -17.54%, #DE9038 158.88%';
        case 'Silver':
            return '108deg, #FFFFFF -17.54%, #C0C0C0 158.88%';
        case 'Gold':
            return '108deg, #FF6B00 -17.54%, #FAE62D 158.88%';
        case 'Diamond':
            return '108deg, #0CE2FF -17.54%, #0117E2 158.88%';
        case 'Based':
            return '108deg, #0029FF -17.54%, #FFFFFF 158.88%';
        default:
            return '#FFFFFF';
    }
};
export const getLvl = (league: number) => {
    switch (league) {
        case 1:
            return 'Bronze';
        case 2:
            return 'Silver';
        case 3:
            return 'Gold';
        case 4:
            return 'Diamond';
        case 5:
            return 'Based';
        default:
            return 'Unknown';
    }
};
export function numberWithCommas(x:number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}