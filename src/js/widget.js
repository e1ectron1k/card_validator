import { isValidCardNumber, formatCardNumber, cleanCardNumber } from './validators.js';
import { detectPaymentSystem, getAllPaymentSystems } from './paymentSystems.js';

export default class CreditCardWidget {

    constructor(parentEl) {
        this.parentEl = parentEl;
        this.currentCardNumber = '';
        this.currentSystem = null;
        this.isValid = false;
        
        // Загружаем иконки
        this.icons = {
            visa: 'V',
            mastercard: 'M',
            mir: 'МИР',
            amex: 'AE',
            discover: 'D',
            jcb: 'JCB',
            generic: '💳'
        };
    }

    static get markup() {
        return `
            <div class="credit-card-widget fade-in">
                <div class="card-preview">
                    <div class="card-header">
                        <div class="chip-icon">
                            <i class="fas fa-microchip"></i>
                        </div>
                        <div class="payment-system-logo" id="payment-system-logo">
                            <!-- Иконка платежной системы -->
                        </div>
                    </div>
                    
                    <div class="card-number-display" id="card-number-display">
                        #### #### #### ####
                    </div>
                    
                    <div class="card-footer">
                        <div class="card-holder">CARD HOLDER</div>
                        <div class="card-expiry">MM/YY</div>
                    </div>
                </div>
                
                <form class="card-form" data-widget="card-form" novalidate>
                    <div class="form-group">
                        <label for="card-input">
                            <i class="fas fa-credit-card"></i> Номер банковской карты
                        </label>
                        <div class="input-wrapper">
                            <input 
                                type="text" 
                                id="card-input" 
                                data-id="card-input"
                                placeholder="Введите номер карты (например: 4111 1111 1111 1111)"
                                autocomplete="cc-number"
                                inputmode="numeric"
                                maxlength="23"
                                class="card-input"
                            >
                        </div>
                        
                        <div class="input-actions">
                            <button type="button" class="btn btn-secondary" data-id="clear-btn">
                                <i class="fas fa-times"></i> Очистить
                            </button>
                            <button type="button" class="btn btn-secondary" data-id="paste-btn">
                                <i class="fas fa-paste"></i> Вставить
                            </button>
                            <button type="button" class="btn btn-secondary" data-id="format-btn">
                                <i class="fas fa-align-center"></i> Форматировать
                            </button>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <button type="submit" class="btn btn-primary" data-id="validate-btn">
                            <i class="fas fa-check-circle"></i> Проверить валидность
                        </button>
                    </div>
                </form>
                
                <div class="results">
                    <h3><i class="fas fa-chart-bar"></i> Результаты проверки</h3>
                    <div class="result-grid">
                        <div class="result-card">
                            <div class="result-title">
                                <i class="fas fa-check-circle"></i> Валидность карты
                            </div>
                            <div class="result-value" id="validity-result">Не проверено</div>
                        </div>
                        
                        <div class="result-card">
                            <div class="result-title">
                                <i class="fas fa-network-wired"></i> Платежная система
                            </div>
                            <div class="result-value" id="system-result">Не определена</div>
                        </div>
                        
                        <div class="result-card">
                            <div class="result-title">
                                <i class="fas fa-ruler"></i> Длина номера
                            </div>
                            <div class="result-value" id="length-result">—</div>
                        </div>
                        
                        <div class="result-card">
                            <div class="result-title">
                                <i class="fas fa-info-circle"></i> Форматированный номер
                            </div>
                            <div class="result-value" id="formatted-result">—</div>
                        </div>
                    </div>
                </div>
                
                <div class="examples">
                    <h4><i class="fas fa-vial"></i> Быстрые примеры:</h4>
                    <div class="example-buttons" id="example-buttons">
                        <!-- Кнопки с примерами будут добавлены динамически -->
                    </div>
                </div>
            </div>
        `;
    }

    bindToDOM() {
        this.parentEl.innerHTML = this.constructor.markup;
        this.initElements();
        this.bindEvents();
        this.loadExamples();
        
        setTimeout(() => {
            this.cardInput.focus();
        }, 100);
    }

    initElements() {
        this.cardInput = this.parentEl.querySelector('[data-id="card-input"]');
        this.clearBtn = this.parentEl.querySelector('[data-id="clear-btn"]');
        this.pasteBtn = this.parentEl.querySelector('[data-id="paste-btn"]');
        this.formatBtn = this.parentEl.querySelector('[data-id="format-btn"]');
        this.validateBtn = this.parentEl.querySelector('[data-id="validate-btn"]');
        this.form = this.parentEl.querySelector('[data-widget="card-form"]');
        
        this.cardNumberDisplay = this.parentEl.querySelector('#card-number-display');
        this.paymentSystemLogo = this.parentEl.querySelector('#payment-system-logo');
        this.validityResult = this.parentEl.querySelector('#validity-result');
        this.systemResult = this.parentEl.querySelector('#system-result');
        this.lengthResult = this.parentEl.querySelector('#length-result');
        this.formattedResult = this.parentEl.querySelector('#formatted-result');
        this.exampleButtons = this.parentEl.querySelector('#example-buttons');
    }

    bindEvents() {
        this.cardInput.addEventListener('input', (e) => {
            this.handleInput(e);
        });
        
        this.cardInput.addEventListener('blur', () => {
            if (this.cardInput.value.trim()) {
                this.validateAndUpdate();
            }
        });
        
        this.clearBtn.addEventListener('click', () => {
            this.clearForm();
        });
        
        this.pasteBtn.addEventListener('click', () => {
            this.pasteFromClipboard();
        });
        
        this.formatBtn.addEventListener('click', () => {
            this.formatCardNumber();
        });
        
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validateAndUpdate();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'v' && document.activeElement !== this.cardInput) {
                this.pasteFromClipboard();
            } else if (e.key === 'Escape') {
                this.clearForm();
            } else if (e.key === 'Enter' && e.ctrlKey) {
                this.validateAndUpdate();
            }
        });
    }

    handleInput(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.substring(0, 19); 
        
        const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        e.target.value = formatted;
        
        this.updateCardPreview(value);
        this.detectPaymentSystem(value);
        
        this.currentCardNumber = value;
    }

    updateCardPreview(cardNumber) {
        let display = '#### #### #### ####';
        
        if (cardNumber) {
            for (let i = 0; i < cardNumber.length; i++) {
                if (i < display.length) {
                    const displayArray = display.split('');
                    let displayIndex = i;
                    while (displayArray[displayIndex] === ' ') {
                        displayIndex++;
                    }
                    if (displayIndex < displayArray.length) {
                        displayArray[displayIndex] = cardNumber[i];
                        display = displayArray.join('');
                    }
                }
            }
        }
        
        this.cardNumberDisplay.textContent = display;
        
        this.cardNumberDisplay.classList.remove('pulse');
        void this.cardNumberDisplay.offsetWidth;
        this.cardNumberDisplay.classList.add('pulse');
    }

    detectPaymentSystem(cardNumber) {
        const system = detectPaymentSystem(cardNumber);
        this.currentSystem = system;
        
        if (system) {
            this.systemResult.textContent = system.displayName;
            this.systemResult.className = 'result-value detected';
            
            this.paymentSystemLogo.innerHTML = `
                <div class="system-logo" style="background: ${system.color}">
                    ${this.icons[system.icon] || this.icons.generic}
                </div>
            `;
            
            this.cardInput.classList.remove('invalid');
            this.cardInput.classList.add('valid');
        } else {
            this.systemResult.textContent = 'Не определена';
            this.systemResult.className = 'result-value unknown';
            this.paymentSystemLogo.innerHTML = '';

            this.cardInput.classList.remove('valid', 'invalid');
        }
    }

    validateAndUpdate() {
        const cardNumber = cleanCardNumber(this.cardInput.value);
        
        if (!cardNumber) {
            this.showError('Введите номер карты');
            return;
        }
        
        this.isValid = isValidCardNumber(cardNumber);
        const system = detectPaymentSystem(cardNumber);
        
        this.updateResults(cardNumber, this.isValid, system);
        
        if (this.isValid) {
            this.showSuccess('Карта валидна!');
        } else {
            this.showError('Номер карты невалиден');
        }
    }

    updateResults(cardNumber, isValid, system) {
        if (isValid) {
            this.validityResult.textContent = '✅ Валидна';
            this.validityResult.className = 'result-value valid';
        } else {
            this.validityResult.textContent = '❌ Невалидна';
            this.validityResult.className = 'result-value invalid';
        }
        
        if (system) {
            this.systemResult.textContent = system.displayName;
            this.systemResult.className = 'result-value detected';
        } else {
            this.systemResult.textContent = 'Не определена';
            this.systemResult.className = 'result-value unknown';
        }
        
        this.lengthResult.textContent = `${cardNumber.length} цифр`;
        
        this.formattedResult.textContent = formatCardNumber(cardNumber);
        
        this.cardInput.classList.remove('valid', 'invalid');
        if (cardNumber) {
            this.cardInput.classList.add(isValid ? 'valid' : 'invalid');
        }
    }

    clearForm() {
        this.cardInput.value = '';
        this.currentCardNumber = '';
        this.currentSystem = null;
        this.isValid = false;
        
        this.cardNumberDisplay.textContent = '#### #### #### ####';
        this.paymentSystemLogo.innerHTML = '';
        
        this.validityResult.textContent = 'Не проверено';
        this.validityResult.className = 'result-value';
        this.systemResult.textContent = 'Не определена';
        this.systemResult.className = 'result-value unknown';
        this.lengthResult.textContent = '—';
        this.formattedResult.textContent = '—';
        
        this.cardInput.classList.remove('valid', 'invalid');
        this.cardInput.focus();
    }

    async pasteFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            const digitsOnly = text.replace(/\D/g, '');
            
            if (digitsOnly && digitsOnly.length >= 13) {
                this.cardInput.value = formatCardNumber(digitsOnly);
                this.handleInput({ target: this.cardInput });
                this.validateAndUpdate();
                this.showSuccess('Номер вставлен из буфера обмена');
            } else {
                this.showError('В буфере обмена нет валидного номера карты');
            }
        } catch (err) {
            console.error('Ошибка при чтении из буфера обмена:', err);
            this.showError('Не удалось прочитать буфер обмена');
        }
    }

    formatCardNumber() {
        const currentValue = this.cardInput.value;
        const formatted = formatCardNumber(currentValue);
        
        if (formatted !== currentValue) {
            this.cardInput.value = formatted;
            this.handleInput({ target: this.cardInput });
            this.showSuccess('Номер отформатирован');
        }
    }

    loadExamples() {
        const examples = [
            { label: 'Visa', number: '4111111111111111' },
            { label: 'MasterCard', number: '5555555555554444' },
            { label: 'Мир', number: '2201382000000013' },
            { label: 'AmEx', number: '378282246310005' },
            { label: 'Discover', number: '6011111111111117' },
            { label: 'Невалидная', number: '4111111111111112' }
        ];
        
        examples.forEach(example => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'example-btn';
            button.textContent = `${example.label}: ${formatCardNumber(example.number)}`;
            button.dataset.number = example.number;
            
            button.addEventListener('click', () => {
                this.cardInput.value = formatCardNumber(example.number);
                this.handleInput({ target: this.cardInput });
                this.validateAndUpdate();
                this.showSuccess(`Загружен пример: ${example.label}`);
            });
            
            this.exampleButtons.appendChild(button);
        });
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        const oldNotification = document.querySelector('.card-notification');
        if (oldNotification) {
            oldNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `card-notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }
}