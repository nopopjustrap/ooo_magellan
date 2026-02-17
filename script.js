// Данные для динамической загрузки
const dealsData = [
    { date: '2025-02-10', company: 'Nexus AI', sector: 'Генеративный ИИ', investment: '$45M', valuation: '$320M' },
    { date: '2025-01-28', company: 'QuantCore Systems', sector: 'Алгоритмический трейдинг', investment: '$27M', valuation: '$180M' },
    { date: '2025-01-12', company: 'Aurora Space', sector: 'Космические технологии', investment: '$82M', valuation: '$610M' },
    { date: '2024-12-04', company: 'Fusion Health', sector: 'Биотехнологии', investment: '$31M', valuation: '$250M' },
    { date: '2024-11-15', company: 'Quantum Computing Inc', sector: 'Квантовые вычисления', investment: '$63M', valuation: '$420M' }
];

const pressData = [
    { title: 'Financial Times — "Новый подход к венчурным инвестициям"', year: '2025' },
    { title: 'TechCrunch — "Magellan Capital закрывает фонд на $600M"', year: '2024' },
    { title: 'Bloomberg — "Рекордный год для deep tech"', year: '2024' },
    { title: 'Wall Street Journal — "Как алгоритмы меняют инвестиции"', year: '2023' }
];

// Класс для управления анимациями и интерактивностью
class MagellanCapital {
    constructor() {
        this.init();
    }

    init() {
        this.loadDynamicContent();
        this.initScrollAnimations();
        this.initSmoothScroll();
        this.initActiveNavigation();
        this.initCounters();
        this.initMobileMenu();
    }

    // Загрузка динамического контента
    loadDynamicContent() {
        // Загрузка таблицы сделок
        const tableBody = document.getElementById('deals-table-body');
        if (tableBody) {
            tableBody.innerHTML = dealsData.map(deal => `
                <tr>
                    <td>${deal.date}</td>
                    <td><span class="company-name">${deal.company}</span></td>
                    <td>${deal.sector}</td>
                    <td>${deal.investment}</td>
                    <td>${deal.valuation}</td>
                </tr>
            `).join('');
        }

        // Загрузка прессы
        const pressList = document.getElementById('press-list');
        if (pressList) {
            pressList.innerHTML = pressData.map(item => `
                <div class="press-item">
                    <span>${item.title}</span>
                    <span class="press-year mono">${item.year}</span>
                </div>
            `).join('');
        }
    }

    // Инициализация анимаций при прокрутке
    initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Запускаем счетчики только когда элемент стал видимым
                    if (entry.target.classList.contains('hero-stats') || 
                        entry.target.classList.contains('metrics-panel')) {
                        this.startCounters(entry.target);
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Инициализация счетчиков
    initCounters() {
        // Сохраняем целевые значения для всех счетчиков
        document.querySelectorAll('[data-target]').forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const isMetric = counter.classList.contains('metric-value');
            const suffix = isMetric ? this.getSuffix(counter) : '%';
            
            counter.setAttribute('data-suffix', suffix);
            counter.textContent = '0';
        });
    }

    getSuffix(element) {
        const text = element.textContent;
        if (text.includes('B')) return 'B';
        if (text.includes('M')) return 'M';
        return '';
    }

    // Запуск счетчиков
    startCounters(container) {
        const counters = container.querySelectorAll('[data-target]');
        
        counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const suffix = counter.getAttribute('data-suffix') || '';
            let current = 0;
            
            // Проверяем, не запущен ли уже счетчик
            if (counter.classList.contains('counting')) return;
            counter.classList.add('counting');
            
            const increment = target / 50; // Делим на 50 шагов
            const duration = 1500; // 1.5 секунды
            const stepTime = duration / 50;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = this.formatNumber(Math.floor(current)) + suffix;
                    setTimeout(updateCounter, stepTime);
                } else {
                    counter.textContent = this.formatNumber(target) + suffix;
                }
            };
            
            updateCounter();
        });
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // Плавная прокрутка к якорям
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Обновляем URL без перезагрузки
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    // Активная навигация при прокрутке
    initActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.3
        });

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Мобильное меню
    initMobileMenu() {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        if (menuBtn && navLinks) {
            menuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('show');
                menuBtn.classList.toggle('active');
                
                // Анимация бургер-меню
                const spans = menuBtn.querySelectorAll('span');
                if (menuBtn.classList.contains('active')) {
                    spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                    spans[1].style.opacity = '0';
                    spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
                } else {
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            });
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new MagellanCapital();
});

// Добавляем класс для мобильного меню в CSS динамически
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .nav-links.show {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 80px;
            left: 0;
            right: 0;
            background-color: var(--bg-primary);
            padding: 30px;
            border-bottom: 1px solid var(--border-light);
            box-shadow: 0 10px 20px rgba(0,0,0,0.05);
            z-index: 999;
        }
        
        .nav-links.show a {
            padding: 15px 0;
            font-size: 1.2rem;
        }
    }
`;
document.head.appendChild(style);