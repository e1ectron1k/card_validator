/**
 * Модуль определения платежных систем банковских карт
 * Определяет платежную систему по первым цифрам номера карты
 */

/**
 * Определяет платежную систему по номеру карты
 * @param {string} cardNumber - Номер карты (только цифры)
 * @returns {Object|null} Объект с информацией о платежной системе или null если не определена
 */
export function detectPaymentSystem(cardNumber) {
    if (!cardNumber || !/^\d+$/.test(cardNumber)) {
        return null;
    }
    
    const cleaned = cardNumber.replace(/\D/g, '');
    const firstDigit = cleaned.charAt(0);
    const firstTwoDigits = cleaned.substring(0, 2);
    const firstThreeDigits = cleaned.substring(0, 3);
    const firstFourDigits = cleaned.substring(0, 4);
    const firstSixDigits = cleaned.substring(0, 6);
    
    // Visa: начинается с 4, длина 13, 16 или 19
    if (firstDigit === '4') {
        const validLengths = [13, 16, 19];
        const length = cleaned.length;
        if (validLengths.includes(length) || length >= 13) {
            return {
                name: 'visa',
                displayName: 'Visa',
                icon: 'visa',
                color: '#1a1f71',
                pattern: /^4/,
                validLengths: validLengths,
                iinRanges: ['4']
            };
        }
    }
    
    // MasterCard: 51-55 или 2221-2720
    if ((firstTwoDigits >= '51' && firstTwoDigits <= '55') ||
        (firstFourDigits >= '2221' && firstFourDigits <= '2720')) {
        return {
            name: 'mastercard',
            displayName: 'MasterCard',
            icon: 'mastercard',
            color: '#eb001b',
            pattern: /^(5[1-5]|2[2-7][0-9]{2})/,
            validLengths: [16],
            iinRanges: ['51-55', '2221-2720']
        };
    }
    
    // Мир: 2200-2204
    if (firstFourDigits >= '2200' && firstFourDigits <= '2204') {
        return {
            name: 'mir',
            displayName: 'Мир',
            icon: 'mir',
            color: '#1e5a8b',
            pattern: /^220[0-4]/,
            validLengths: [16, 18, 19],
            iinRanges: ['2200-2204']
        };
    }
    
    // American Express: 34 или 37
    if (firstTwoDigits === '34' || firstTwoDigits === '37') {
        return {
            name: 'amex',
            displayName: 'American Express',
            icon: 'amex',
            color: '#2e77bc',
            pattern: /^3[47]/,
            validLengths: [15],
            iinRanges: ['34', '37']
        };
    }
    
    // Discover: 6011, 644-649, 65
    if (firstFourDigits === '6011' ||
        (firstThreeDigits >= '644' && firstThreeDigits <= '649') ||
        firstTwoDigits === '65') {
        return {
            name: 'discover',
            displayName: 'Discover',
            icon: 'discover',
            color: '#ff6000',
            pattern: /^(6011|64[4-9]|65)/,
            validLengths: [16, 19],
            iinRanges: ['6011', '644-649', '65']
        };
    }
    
    // JCB: 3528-3589
    if (firstFourDigits >= '3528' && firstFourDigits <= '3589') {
        return {
            name: 'jcb',
            displayName: 'JCB',
            icon: 'jcb',
            color: '#3068a3',
            pattern: /^35(2[8-9]|[3-8][0-9])/,
            validLengths: [16, 17, 18, 19],
            iinRanges: ['3528-3589']
        };
    }
    
    // Diners Club: 300-305, 309, 36, 38-39
    if ((firstThreeDigits >= '300' && firstThreeDigits <= '305') ||
        firstThreeDigits === '309' ||
        firstTwoDigits === '36' ||
        firstTwoDigits === '38' ||
        firstTwoDigits === '39') {
        return {
            name: 'diners',
            displayName: 'Diners Club',
            icon: 'diners',
            color: '#0079be',
            pattern: /^(30[0-5]|309|36|38|39)/,
            validLengths: [14, 15, 16, 17, 18, 19],
            iinRanges: ['300-305', '309', '36', '38', '39']
        };
    }
    
    // China UnionPay: 62
    if (firstTwoDigits === '62') {
        return {
            name: 'unionpay',
            displayName: 'China UnionPay',
            icon: 'unionpay',
            color: '#e21836',
            pattern: /^62/,
            validLengths: [16, 17, 18, 19],
            iinRanges: ['62']
        };
    }
    
    // UzCard (Узбекистан): 8600
    if (firstFourDigits === '8600') {
        return {
            name: 'uzcard',
            displayName: 'UzCard',
            icon: 'generic',
            color: '#00a651',
            pattern: /^8600/,
            validLengths: [16],
            iinRanges: ['8600']
        };
    }
    
    return null;
}

/**
 * Получает информацию о всех поддерживаемых платежных системах
 * @returns {Array} Массив объектов с информацией о платежных системах
 */
export function getAllPaymentSystems() {
    return [
        {
            name: 'visa',
            displayName: 'Visa',
            icon: 'visa',
            color: '#1a1f71',
            example: '4111 1111 1111 1111'
        },
        {
            name: 'mastercard',
            displayName: 'MasterCard',
            icon: 'mastercard',
            color: '#eb001b',
            example: '5555 5555 5555 4444'
        },
        {
            name: 'mir',
            displayName: 'Мир',
            icon: 'mir',
            color: '#1e5a8b',
            example: '2201 3820 0000 0013'
        },
        {
            name: 'amex',
            displayName: 'American Express',
            icon: 'amex',
            color: '#2e77bc',
            example: '3782 8224 6310 005'
        },
        {
            name: 'discover',
            displayName: 'Discover',
            icon: 'discover',
            color: '#ff6000',
            example: '6011 1111 1111 1117'
        },
        {
            name: 'jcb',
            displayName: 'JCB',
            icon: 'jcb',
            color: '#3068a3',
            example: '3530 1113 3330 0000'
        }
    ];
}

/**
 * Проверяет, соответствует ли длина номера карты требованиям платежной системы
 * @param {string} cardNumber - Номер карты
 * @param {Object} systemInfo - Информация о платежной системе
 * @returns {boolean} true если длина соответствует требованиям
 */
export function validateLengthForSystem(cardNumber, systemInfo) {
    if (!systemInfo || !systemInfo.validLengths) return true;
    
    const cleaned = cardNumber.replace(/\D/g, '');
    return systemInfo.validLengths.includes(cleaned.length);
}