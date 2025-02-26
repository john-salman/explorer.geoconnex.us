import {
    calculateSpiderfiedPositions,
    calculateSpiderfiedPositionsCircle,
    calculateSpiderfiedPositionsConcentricCircle,
} from '@/app/features/MainMap/utils';

describe('MainMap: utils', () => {
    test('calculateSpiderfiedPositions: should return correct positions for 1 point', () => {
        const result = calculateSpiderfiedPositions(1);

        expect(result).toEqual([[-41.61468365471424, 90.92974268256818]]);
    });

    test('calculateSpiderfiedPositions: should return correct positions for 10 points', () => {
        const result = calculateSpiderfiedPositions(10);
        expect(result).toHaveLength(10);
    });

    test('calculateSpiderfiedPositions: should return correct positions for 20 points', () => {
        const result = calculateSpiderfiedPositions(20);
        expect(result).toHaveLength(20);
    });

    test('calculateSpiderfiedPositionsCircle: should return correct positions for 1 point', () => {
        const result = calculateSpiderfiedPositionsCircle(1);
        expect(result).toEqual([[75, 0]]);
    });

    test('calculateSpiderfiedPositionsCircle: should return correct positions for 10 points', () => {
        const result = calculateSpiderfiedPositionsCircle(10);
        expect(result).toHaveLength(10);
    });

    test('calculateSpiderfiedPositionsCircle: should return correct positions for 20 points', () => {
        const result = calculateSpiderfiedPositionsCircle(20);
        expect(result).toHaveLength(20);
    });

    test('calculateSpiderfiedPositionsConcentricCircle: should return correct positions for 1 point', () => {
        const result = calculateSpiderfiedPositionsConcentricCircle(1);
        expect(result).toEqual([[75, 0]]);
    });

    test('calculateSpiderfiedPositionsConcentricCircle: should return correct positions for 10 points', () => {
        const result = calculateSpiderfiedPositionsConcentricCircle(10);
        expect(result).toHaveLength(10);
    });

    test('calculateSpiderfiedPositionsConcentricCircle: should return correct positions for 20 points', () => {
        const result = calculateSpiderfiedPositionsConcentricCircle(20);
        expect(result).toHaveLength(20);
    });
});
