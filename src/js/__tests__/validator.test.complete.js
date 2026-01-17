import { isValidCardNumber, formatCardNumber, cleanCardNumber } from '../src/js/validators';

describe('Validators Module', () => {
    describe('isValidCardNumber', () => {
        test('должен возвращать true для валидных номеров Visa', () => {
            expect(isValidCardNumber('4111111111111111')).toBe(true);
            expect(isValidCardNumber('4012888888881881')).toBe(true);
            expect(isValidCardNumber('4222222222222')).toBe(true); // 13 цифр
        });

        test('должен возвращать true для валидных номеров MasterCard', () => {
            expect(isValidCardNumber('5555555555554444')).toBe(true);
            expect(isValidCardNumber('5105105105105100')).toBe(true);
        });

        test('должен возвращать true для валидных номеров Мир', () => {
            expect(isValidCardNumber('2201382000000013')).toBe(true);
            expect(isValidCardNumber('2200000000000001')).toBe(true);
        });

        test('должен возвращать false для невалидных номеров', () => {
            expect(isValidCardNumber('4111111111111112')).toBe(false);
            expect(isValidCardNumber('1234567890123456')).toBe(false);
        });

        test('должен обрабатывать номера с пробелами и разделителями', () => {
            expect(isValidCardNumber('4111 1111 1111 1111')).toBe(true);
            expect(isValidCardNumber('5555-5555-5555-4444')).toBe(true);
            expect(isValidCardNumber('2201 3820 0000 0013')).toBe(true);
        });

        test('должен возвращать false для слишком коротких номеров', () => {
            expect(isValidCardNumber('12345')).toBe(false);
            expect(isValidCardNumber('')).toBe(false);
        });

        test('должен возвращать false для слишком длинных номеров', () => {
            const longNumber = '12345678901234567890'; // 20 цифр
            expect(isValidCardNumber(longNumber)).toBe(false);
        });
    });

    describe('formatCardNumber', () => {
        test('должен форматировать номер карты с пробелами', () => {
            expect(formatCardNumber('4111111111111111')).toBe('4111 1111 1111 1111');
            expect(formatCardNumber('5555555555554444')).toBe('5555 5555 5555 4444');
            expect(formatCardNumber('378282246310005')).toBe('3782 8224 6310 005');
        });

        test('должен обрабатывать уже отформатированные номера', () => {
            expect(formatCardNumber('4111 1111 1111 1111')).toBe('4111 1111 1111 1111');
            expect(formatCardNumber('5555-5555-5555-4444')).toBe('5555 5555 5555 4444');
        });

        test('должен возвращать пустую строку для пустого ввода', () => {
            expect(formatCardNumber('')).toBe('');
            expect(formatCardNumber(null)).toBe('');
            expect(formatCardNumber(undefined)).toBe('');
        });
    });

    describe('cleanCardNumber', () => {
        test('должен удалять все нецифровые символы', () => {
            expect(cleanCardNumber('4111-1111-1111-1111')).toBe('4111111111111111');
            expect(cleanCardNumber('5555 5555 5555 4444')).toBe('5555555555554444');
            expect(cleanCardNumber('2201-3820-0000-0013')).toBe('2201382000000013');
        });

        test('должен возвращать только цифры', () => {
            expect(cleanCardNumber('ABC123DEF456')).toBe('123456');
            expect(cleanCardNumber('!@#$%^&*()123')).toBe('123');
        });
    });
});