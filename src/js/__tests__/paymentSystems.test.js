import { detectPaymentSystem, getAllPaymentSystems, validateLengthForSystem } from '../src/js/paymentSystems';

describe('Payment Systems Module', () => {
    describe('detectPaymentSystem', () => {
        test('должен определять Visa по первой цифре 4', () => {
            const result = detectPaymentSystem('4111111111111111');
            expect(result).not.toBeNull();
            expect(result.name).toBe('visa');
            expect(result.displayName).toBe('Visa');
        });

        test('должен определять MasterCard по диапазону 51-55', () => {
            expect(detectPaymentSystem('5111111111111111').name).toBe('mastercard');
            expect(detectPaymentSystem('5511111111111111').name).toBe('mastercard');
        });

        test('должен определять MasterCard по диапазону 2221-2720', () => {
            expect(detectPaymentSystem('2221111111111111').name).toBe('mastercard');
            expect(detectPaymentSystem('2720111111111111').name).toBe('mastercard');
        });

        test('должен определять Мир по диапазону 2200-2204', () => {
            const result = detectPaymentSystem('2201111111111111');
            expect(result.name).toBe('mir');
            expect(result.displayName).toBe('Мир');
        });

        test('должен определять American Express по 34 или 37', () => {
            expect(detectPaymentSystem('341111111111111').name).toBe('amex');
            expect(detectPaymentSystem('371111111111111').name).toBe('amex');
        });

        test('должен определять Discover по 6011, 644-649 или 65', () => {
            expect(detectPaymentSystem('6011111111111111').name).toBe('discover');
            expect(detectPaymentSystem('6441111111111111').name).toBe('discover');
            expect(detectPaymentSystem('6511111111111111').name).toBe('discover');
        });

        test('должен возвращать null для неизвестных платежных систем', () => {
            expect(detectPaymentSystem('1234567890123456')).toBeNull();
            expect(detectPaymentSystem('')).toBeNull();
            expect(detectPaymentSystem('9999999999999999')).toBeNull();
        });

        test('должен работать с неполными номерами', () => {
            expect(detectPaymentSystem('4')).not.toBeNull();
            expect(detectPaymentSystem('42')).not.toBeNull();
            expect(detectPaymentSystem('55')).not.toBeNull();
            expect(detectPaymentSystem('220')).not.toBeNull();
        });
    });

    describe('getAllPaymentSystems', () => {
        test('должен возвращать массив всех платежных систем', () => {
            const systems = getAllPaymentSystems();
            expect(Array.isArray(systems)).toBe(true);
            expect(systems.length).toBeGreaterThan(0);
            
            // Проверяем наличие основных систем
            const systemNames = systems.map(s => s.name);
            expect(systemNames).toContain('visa');
            expect(systemNames).toContain('mastercard');
            expect(systemNames).toContain('mir');
        });

        test('каждая система должна иметь необходимые поля', () => {
            const systems = getAllPaymentSystems();
            systems.forEach(system => {
                expect(system).toHaveProperty('name');
                expect(system).toHaveProperty('displayName');
                expect(system).toHaveProperty('icon');
                expect(system).toHaveProperty('color');
                expect(system).toHaveProperty('example');
            });
        });
    });

    describe('validateLengthForSystem', () => {
        test('должен проверять длину для Visa', () => {
            const visaSystem = detectPaymentSystem('4111111111111111');
            expect(validateLengthForSystem('4111111111111111', visaSystem)).toBe(true);
            expect(validateLengthForSystem('4222222222222', visaSystem)).toBe(true);
            expect(validateLengthForSystem('411111111', visaSystem)).toBe(false);
        });

        test('должен проверять длину для MasterCard', () => {
            const mastercardSystem = detectPaymentSystem('5555555555554444');
            expect(validateLengthForSystem('5555555555554444', mastercardSystem)).toBe(true);
            expect(validateLengthForSystem('55555555', mastercardSystem)).toBe(false);
        });

        test('должен возвращать true если система не определена', () => {
            expect(validateLengthForSystem('1234567890', null)).toBe(true);
            expect(validateLengthForSystem('1234567890', undefined)).toBe(true);
        });
    });
});