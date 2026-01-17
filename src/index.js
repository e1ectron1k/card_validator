/**
 * Главная точка входа приложения
 */

import './css/style.css';
import './js/app';

console.log('💳 Валидатор банковских карт');
console.log('📚 Использует алгоритм Луна для проверки валидности карт');

// Добавляем информацию о версии
const version = '1.0.0';
console.log(`🚀 Версия: ${version}`);

// Глобальные хелперы для отладки (можно удалить в production)
if (process.env.NODE_ENV === 'development') {
    window.validateCard = function(cardNumber) {
        const cleaned = cardNumber.replace(/\D/g, '');
        let sum = 0;
        let shouldDouble = false;
        
        for (let i = cleaned.length - 1; i >= 0; i--) {
            let digit = parseInt(cleaned.charAt(i), 10);
            
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        
        return sum % 10 === 0;
    };
}