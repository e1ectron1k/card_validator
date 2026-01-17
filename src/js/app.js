import '../css/style.css';
import CreditCardWidget from './widget.js';


document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Приложение валидатора банковских карт запущено');
    
    const widgetContainer = document.getElementById('credit-card-widget');
    
    if (widgetContainer) {
        try {
            const widget = new CreditCardWidget(widgetContainer);
            widget.bindToDOM();
            
            console.log('✅ Виджет успешно инициализирован');
            
            addGlobalStyles();
            
            setTimeout(() => {
                widget.showSuccess('Виджет готов к работе! Введите номер карты для проверки');
            }, 500);
        } catch (error) {
            console.error('❌ Ошибка при инициализации виджета:', error);
            widgetContainer.innerHTML = `
                <div class="error-message">
                    <h3><i class="fas fa-exclamation-triangle"></i> Ошибка инициализации</h3>
                    <p>Не удалось загрузить виджет валидации карт. Пожалуйста, обновите страницу.</p>
                    <button onclick="window.location.reload()" class="btn btn-primary">
                        <i class="fas fa-redo"></i> Обновить страницу
                    </button>
                </div>
            `;
        }
    } else {
        console.error('❌ Контейнер #credit-card-widget не найден в DOM');
    }
});

function addGlobalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .error-message {
            text-align: center;
            padding: 40px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .error-message h3 {
            color: #e74c3c;
            margin-bottom: 20px;
        }
        
        .error-message p {
            color: #7f8c8d;
            margin-bottom: 25px;
        }
        
        .system-logo {
            width: 60px;
            height: 40px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 1.2rem;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
    `;
    document.head.appendChild(style);
}

export { CreditCardWidget };