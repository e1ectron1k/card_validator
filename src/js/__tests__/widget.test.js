/**
 * Тесты для виджета
 */

import CreditCardWidget from '../src/js/widget';

// Mock DOM для тестирования
beforeEach(() => {
    document.body.innerHTML = `
        <div id="test-container"></div>
    `;
});

describe('CreditCardWidget', () => {
    let widget;
    let container;

    beforeEach(() => {
        container = document.getElementById('test-container');
        widget = new CreditCardWidget(container);
        widget.bindToDOM();
    });

    test('должен создавать DOM структуру', () => {
        expect(container.querySelector('.credit-card-widget')).not.toBeNull();
        expect(container.querySelector('#card-input')).not.toBeNull();
        expect(container.querySelector('.card-preview')).not.toBeNull();
        expect(container.querySelector('.results')).not.toBeNull();
    });

    test('должен форматировать ввод номера карты', () => {
        const input = container.querySelector('#card-input');
        
        // Симулируем ввод
        input.value = '4111111111111111';
        input.dispatchEvent(new Event('input'));
        
        expect(input.value).toBe('4111 1111 1111 1111');
    });

    test('должен обновлять предварительный просмотр карты', () => {
        const input = container.querySelector('#card-input');
        const display = container.querySelector('#card-number-display');
        
        input.value = '4111';
        input.dispatchEvent(new Event('input'));
        
        expect(display.textContent).toContain('4111');
    });

    test('должен очищать форму по кнопке', () => {
        const input = container.querySelector('#card-input');
        const clearBtn = container.querySelector('[data-id="clear-btn"]');
        
        // Вводим данные
        input.value = '4111111111111111';
        input.dispatchEvent(new Event('input'));
        
        // Очищаем
        clearBtn.click();
        
        expect(input.value).toBe('');
    });

    test('должен определять платежную систему', () => {
        const input = container.querySelector('#card-input');
        
        // Вводим Visa
        input.value = '4111';
        input.dispatchEvent(new Event('input'));
        
        const systemResult = container.querySelector('#system-result');
        expect(systemResult.textContent).toBe('Visa');
    });
});