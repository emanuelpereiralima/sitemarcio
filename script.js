document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling para os links da navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Manipulação do formulário de contato
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Impede o envio real do formulário

        const nome = this.nome.value;
        const assunto = this.assunto.value;

        if (nome && assunto) {
            alert(`Obrigado, ${nome}! Recebemos sua mensagem sobre "${assunto}". Entraremos em contato em breve.`);
            this.reset(); // Limpa o formulário
        } else {
            alert('Por favor, preencha todos os campos obrigatórios.');
        }
    });

});

// ===========================================
// === CÓDIGO DO CALENDÁRIO INTERATIVO ===
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    // ---- DADOS DOS EVENTOS ----
    // ADICIONE SEUS SHOWS E PALESTRAS AQUI
    // Formato da data: 'ANO-MÊS-DIA' (ex: '2025-07-25')
    const events = [
        {
            date: '2025-07-22',
            title: 'Show de Comédia: Rindo Alto',
            imageSrc: 'https://via.placeholder.com/400x250/F27405/FFFFFF?text=Show+de+Comédia',
            time: '20:00',
            location: 'Teatro Principal da Cidade',
            ticketLink: '#' // Coloque o link de compra real aqui
        },
        {
            date: '2025-07-30',
            title: 'Palestra: O Humor como Ferramenta',
            imageSrc: 'https://via.placeholder.com/400x250/0ABFBC/FFFFFF?text=Palestra',
            time: '18:00',
            location: 'Centro de Convenções',
            ticketLink: '#' // Coloque o link de compra real aqui
        },
        {
            date: '2025-08-15',
            title: 'Especial de Stand-Up',
            imageSrc: 'https://via.placeholder.com/400x250/00334E/FFFFFF?text=Especial',
            time: '21:00',
            location: 'Clube da Comédia',
            ticketLink: '#' // Coloque o link de compra real aqui
        }
    ];

    // ---- ELEMENTOS DO DOM ----
    const calendarBody = document.getElementById('calendar-body');
    const monthYearDisplay = document.getElementById('month-year-display');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    const eventDisplayPanel = document.getElementById('event-display-panel');

    let currentDate = new Date();

    // ---- FUNÇÃO PARA RENDERIZAR O CALENDÁRIO ----
    function renderCalendar() {
        calendarBody.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        monthYearDisplay.textContent = `${currentDate.toLocaleString('pt-BR', { month: 'long' })} de ${year}`;

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
        const lastDateOfLastMonth = new Date(year, month, 0).getDate();

        // Dias do mês anterior
        for (let i = firstDayOfMonth; i > 0; i--) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('calendar-day', 'empty-day');
            dayCell.textContent = lastDateOfLastMonth - i + 1;
            calendarBody.appendChild(dayCell);
        }

        // Dias do mês atual
        for (let i = 1; i <= lastDateOfMonth; i++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('calendar-day');
            dayCell.textContent = i;
            
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const event = events.find(e => e.date === dateStr);

            if (event) {
                dayCell.classList.add('event-day');
                dayCell.dataset.date = dateStr;
            }
            calendarBody.appendChild(dayCell);
        }
        
         // Preencher dias do próximo mês
        const totalDays = calendarBody.children.length;
        const remainingDays = (7 - (totalDays % 7)) % 7;
        for (let i = 1; i <= remainingDays; i++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('calendar-day', 'empty-day');
            dayCell.textContent = i;
            calendarBody.appendChild(dayCell);
        }
    }

    // ---- FUNÇÃO PARA MOSTRAR O EVENTO ----
    function showEventDetails(dateStr) {
        const event = events.find(e => e.date === dateStr);
        if (!event) return;

        eventDisplayPanel.innerHTML = `
            <div class="event-card-dynamic visible">
                <img src="${event.imageSrc}" alt="${event.title}">
                <h4>${event.title}</h4>
                <p><strong>Horário:</strong> ${event.time}</p>
                <p><strong>Local:</strong> ${event.location}</p>
                <a href="${event.ticketLink}" class="btn-ingressos" target="_blank">Comprar Ingressos</a>
            </div>
        `;
    }
    
    // ---- FUNÇÃO PARA LIMPAR A EXIBIÇÃO ----
     function clearEventDetails() {
        eventDisplayPanel.innerHTML = '<p class="no-event-selected">Clique em uma data com evento para ver os detalhes.</p>';
    }


    // ---- EVENT LISTENERS ----
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
        clearEventDetails();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
        clearEventDetails();
    });

    calendarBody.addEventListener('click', (e) => {
        // Remove a classe 'active' de qualquer dia que a tenha
        const previouslyActive = calendarBody.querySelector('.active-day');
        if (previouslyActive) {
            previouslyActive.classList.remove('active-day');
        }

        const clickedDay = e.target;
        if (clickedDay.classList.contains('event-day')) {
            clickedDay.classList.add('active-day');
            showEventDetails(clickedDay.dataset.date);
        } else if (clickedDay.classList.contains('calendar-day') && !clickedDay.classList.contains('empty-day')) {
             clearEventDetails();
        }
    });

    // ---- RENDERIZAÇÃO INICIAL ----
    renderCalendar();
});

// ===========================================
// === CÓDIGO DA LINHA DO TEMPO INTERATIVA ===
// ===========================================
document.addEventListener('DOMContentLoaded', () => {

    // --- DADOS DA FILMOGRAFIA ---
    // Adicione mais anos e obras aqui conforme necessário
    const filmografiaData = [
        { year: 2016, works: ["Fora do Limite", "Guerra Justa"] },
        { year: 2017, works: ["Projeto Secreto","aaa"] },
        { year: 2018, works: ["Comédia na Praça"] },
        { year: 2019, works: ["O Inimigo", "Cine Holliúdy"] },
        { year: 2020, works: ["Show Online Ao Vivo"] },
        { year: 2021, works: ["Curtas da Pandemia"] },
        { year: 2022, works: ["O Palestrante", "Soltos"] },
        { year: 2023, works: ["As Aventuras de José & Durval"] },
        { year: 2024, works: ["Biônicos", "Série Nova"] },
        { year: 2025, works: ["Filme Futuro 1"] },
        { year: 2026, works: ["Projeto em Andamento"] },
        { year: 2027, works: ["Ideia de Roteiro"] }
    ];

    // --- ELEMENTOS DO DOM ---
    const track = document.getElementById('timeline-track');
    const viewport = document.querySelector('.timeline-viewport');
    const prevBtn = document.getElementById('timeline-prev');
    const nextBtn = document.getElementById('timeline-next');
    const gotoBtn = document.getElementById('goto-current-year-btn');

    const YEARS_PER_VIEW = 2;
    let totalPages = Math.ceil(filmografiaData.length / YEARS_PER_VIEW);
    let currentPage = 0;
    
    // --- LÓGICA DE DRAG (ARRASTAR) ---
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    // --- FUNÇÕES ---

    // 1. Renderizar a timeline a partir dos dados
    function renderTimeline() {
        track.innerHTML = '';
        filmografiaData.forEach(item => {
            const yearItem = document.createElement('div');
            yearItem.className = 'timeline-year-item';

            const worksHTML = item.works.map(work => `<li>${work}</li>`).join('');

            yearItem.innerHTML = `
                <div class="year-label">${item.year}</div>
                <div class="year-circle"></div>
                <ul class="works-list">${worksHTML}</ul>
            `;
            track.appendChild(yearItem);
        });
        updateTimeline();
    }

    // 2. Atualizar a posição da timeline e o estado dos botões
    function updateTimeline() {
        const itemWidth = track.scrollWidth / filmografiaData.length;
        const moveDistance = itemWidth * (currentPage * YEARS_PER_VIEW);
        
        track.style.transition = 'transform 0.5s ease-out';
        track.style.transform = `translateX(-${moveDistance}px)`;
        currentTranslate = -moveDistance; // Atualiza a posição para a lógica de drag

        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage >= totalPages - 1;
    }

    // 3. Ir para uma página específica
    function goToPage(pageIndex) {
        currentPage = Math.max(0, Math.min(pageIndex, totalPages - 1));
        updateTimeline();
    }

    // --- EVENT LISTENERS ---

    // Navegação por botões
    prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
    nextBtn.addEventListener('click', () => goToPage(currentPage + 1));

    // Eventos de Drag (arrastar)
    viewport.addEventListener('mousedown', startDrag);
    viewport.addEventListener('touchstart', startDrag, { passive: true });

    viewport.addEventListener('mouseup', endDrag);
    viewport.addEventListener('mouseleave', endDrag);
    viewport.addEventListener('touchend', endDrag);

    viewport.addEventListener('mousemove', drag);
    viewport.addEventListener('touchmove', drag, { passive: true });


    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function startDrag(event) {
        isDragging = true;
        startPos = getPositionX(event);
        prevTranslate = currentTranslate; // Armazena a posição inicial antes de arrastar
        track.style.transition = 'none'; // Remove transição para o arrasto ser instantâneo
    }

    function drag(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            const move = currentPosition - startPos;
            currentTranslate = prevTranslate + move;
            track.style.transform = `translateX(${currentTranslate}px)`;
        }
    }

    function endDrag(event) {
        if (!isDragging) return;
        isDragging = false;
        
        const movedBy = currentTranslate - prevTranslate;

        // Lógica de "snap": se arrastou mais de 100px, muda de página
        if (movedBy < -100 && currentPage < totalPages - 1) {
            currentPage++;
        }
        if (movedBy > 100 && currentPage > 0) {
            currentPage--;
        }

        updateTimeline(); // "Snaps" para a posição correta com transição
    }


    // --- INICIALIZAÇÃO ---
    renderTimeline();
    window.addEventListener('resize', updateTimeline); // Ajusta a timeline se a tela mudar de tamanho
});

const counters = document.querySelectorAll('.social-metric');
    const animationDuration = 2000; // Duração da animação em milissegundos (2 segundos)

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target'); // Pega o número final do atributo data-target
        
        const updateCount = () => {
            const current = +counter.innerText;
            const increment = target / (animationDuration / 50); // Calcula quanto aumentar a cada passo

            if (current < target) {
                counter.innerText = `${Math.ceil(current + increment)}`;
                setTimeout(updateCount, 50); // Repete a cada 50ms
            } else {
                // Formata o número final (ex: 15200 para 15.2k)
                if (target >= 1000) {
                    counter.innerText = (target / 1000).toFixed(1) + 'k';
                } else {
                    counter.innerText = target;
                }
            }
        };

        updateCount(); // Inicia a animação para este contador
    });