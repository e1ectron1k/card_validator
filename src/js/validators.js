/**
 * Модуль валидации банковских карт
 * Реализует алгоритм Луна для проверки контрольной суммы
 */

/**
 * Проверяет валидность номера банковской карты с использованием алгоритма Луна
 * @param {string} cardNumber - Номер карты (может содержать пробелы и другие разделители)
 * @returns {boolean} true если номер валиден, false в противном случае
 */
export function isValidCardNumber(cardNumber) {
  // Удаляем все нецифровые символы
  const cleaned = cardNumber.replace(/\D/g, '');
  
  // Проверяем базовые условия
  if (!cleaned) return false;
  if (cleaned.length < 13 || cleaned.length > 19) return false;
  if (!/^\d+$/.test(cleaned)) return false;
  
  // Реализация алгоритма Луна
  let sum = 0;
  let shouldDouble = false;
  
  // Проходим по цифрам справа налево
  for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);
      
      if (shouldDouble) {
          digit *= 2;
          if (digit > 9) {
              digit -= 9;
          }
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
  }
  
  // Номер валиден, если сумма кратна 10
  return sum % 10 === 0;
}

/**
* Проверяет, является ли номер карты валидным для определенной платежной системы
* @param {string} cardNumber - Номер карты
* @param {string} system - Идентификатор платежной системы
* @returns {boolean} true если номер соответствует системе и валиден
*/
export function isValidForSystem(cardNumber, system) {
  if (!isValidCardNumber(cardNumber)) {
      return false;
  }
  
  const cleaned = cardNumber.replace(/\D/g, '');
  const systemInfo = detectPaymentSystem(cleaned);
  
  return systemInfo && systemInfo.name === system;
}

/**
* Форматирует номер карты, добавляя пробелы каждые 4 цифры
* @param {string} cardNumber - Номер карты
* @returns {string} Отформатированный номер
*/
export function formatCardNumber(cardNumber) {
  const cleaned = cardNumber.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : '';
}

/**
* Очищает номер карты от всех нецифровых символов
* @param {string} cardNumber - Номер карты
* @returns {string} Только цифры
*/
export function cleanCardNumber(cardNumber) {
  return cardNumber.replace(/\D/g, '');
}

// Импортируем функцию определения платежной системы
import { detectPaymentSystem } from './paymentSystems.js';