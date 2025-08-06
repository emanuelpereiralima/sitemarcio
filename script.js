document.addEventListener('DOMContentLoaded', function() {

    // ===================================================
    // === CÓDIGOS GERAIS DO SITE (Links, Logo, Formulário)
    // ===================================================

    // Smooth scrolling para os links de navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===================================================
    // === LÓGICA DA PÁGINA DE LOGIN (login.html) ===
    // ===================================================
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');

            if (usernameInput.value === "admin" && passwordInput.value === "senha123") {
                alert('Login bem-sucedido! Redirecionando...');

                // NOVO: Salva o "ticket" de acesso no navegador
                // sessionStorage só dura enquanto a aba do navegador estiver aberta
                sessionStorage.setItem('loggedIn', 'true');

                window.location.href = 'admin.html';
            } else {
                alert('Usuário ou senha inválidos.');
            }
        });
    }


    // ===================================================
    // === LÓGICA DO PAINEL DE ADMIN (admin.html)
    // ===================================================

    // NOVO: Lógica para o botão de Sair (Logout)
    const logoutButton = document.getElementById('logout-btn');
    if(logoutButton) {
        logoutButton.addEventListener('click', function(event) {
            event.preventDefault(); // Impede a navegação padrão do link

            // Remove o "ticket" de acesso
            sessionStorage.removeItem('loggedIn');

            alert('Você saiu do painel.');
            // Redireciona para a página inicial
            window.location.href = 'index.html';
        });
    }

    // Link do logo para a página de login
    const logoLink = document.querySelector('.logo');
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            // Verifica se o clique não foi em um link dentro do logo
            if (e.target.tagName !== 'A') {
                window.location.href = 'login.html';
            }
        });
        logoLink.style.cursor = 'pointer';
    }

    // Manipulação do formulário de contato
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nome = this.nome.value;
            const assunto = this.assunto.value;

            if (nome && assunto) {
                alert(`Obrigado, ${nome}! Recebemos sua mensagem sobre "${assunto}". Entraremos em contato em breve.`);
                this.reset();
            } else {
                alert('Por favor, preencha todos os campos obrigatórios.');
            }
        });
    }


    // ===========================================
    // === CÓDIGO DA FILMOGRAFIA (TIMELINE)
    // ===========================================
    const timelineTrack = document.getElementById('timeline-track');
    if (timelineTrack) {
        const filmografiaData = [
            { year: 2016, works: ["Reza a lenda", "Justiça", "Supermax"] },
            { year: 2019, works: ["Divino Amor", "Bacurau", "Acqua Movie", "Recife Assombrado"] },
            { year: 2022, works: ["Paterno", "Serial Kelly", "Irmandade"] },
            { year: 2023, works: ["As Aventuras de José e Durval"] },
            { year: 2024, works: ["Biônicos"] }
        ];

        filmografiaData.forEach(item => {
            const yearItem = document.createElement('div');
            yearItem.className = 'timeline-year-item';
            yearItem.innerHTML = `
                <div class="year-label">${item.year}</div>
                <div class="year-marker"></div>
                <ul class="works-list">
                    ${item.works.map(work => `<li>${work}</li>`).join('')}
                </ul>
            `;
            timelineTrack.appendChild(yearItem);
        });
    }


    // ===========================================
    // === CÓDIGO DA AGENDA (CALENDÁRIO)
    // ===========================================
    const calendarBody = document.getElementById('calendar-body');
    if (calendarBody) {
        const events = [{
            date: '2025-08-15',
            title: 'Especial de Stand-Up',
            imageSrc: 'https://via.placeholder.com/400x250/00334E/FFFFFF?text=Especial',
            time: '21:00',
            location: 'Clube da Comédia',
            ticketLink: '#'
        }];

        const monthYearDisplay = document.getElementById('month-year-display');
        const prevMonthBtn = document.getElementById('prev-month-btn');
        const nextMonthBtn = document.getElementById('next-month-btn');
        const eventDisplayPanel = document.getElementById('event-display-panel');
        let currentDate = new Date();

        function renderCalendar() {
            calendarBody.innerHTML = '';
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();

            if(monthYearDisplay) {
                monthYearDisplay.textContent = `${currentDate.toLocaleString('pt-BR', { month: 'long' })} de ${year}`;
            }

            const firstDayOfMonth = new Date(year, month, 1).getDay();
            const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
            const lastDateOfLastMonth = new Date(year, month, 0).getDate();

            for (let i = firstDayOfMonth; i > 0; i--) {
                const dayCell = document.createElement('div');
                dayCell.classList.add('calendar-day', 'empty-day');
                dayCell.textContent = lastDateOfLastMonth - i + 1;
                calendarBody.appendChild(dayCell);
            }

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

            const totalDays = calendarBody.children.length;
            const remainingDays = (7 - (totalDays % 7)) % 7;
            for (let i = 1; i <= remainingDays; i++) {
                const dayCell = document.createElement('div');
                dayCell.classList.add('calendar-day', 'empty-day');
                dayCell.textContent = i;
                calendarBody.appendChild(dayCell);
            }
        }

        function showEventDetails(dateStr) {
            const event = events.find(e => e.date === dateStr);
            if (!event || !eventDisplayPanel) return;
            eventDisplayPanel.innerHTML = `
                <div class="event-card-dynamic">
                    <img src="${event.imageSrc}" alt="${event.title}">
                    <h4>${event.title}</h4>
                    <p><strong>Horário:</strong> ${event.time}</p>
                    <p><strong>Local:</strong> ${event.location}</p>
                    <a href="${event.ticketLink}" class="btn-ingressos" target="_blank">Comprar Ingressos</a>
                </div>`;
        }

        function clearEventDetails() {
            if (!eventDisplayPanel) return;
            eventDisplayPanel.innerHTML = '<p class="no-event-selected">Clique em uma data com evento para ver os detalhes.</p>';
        }

        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() - 1);
                renderCalendar();
                clearEventDetails();
            });
        }

        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() + 1);
                renderCalendar();
                clearEventDetails();
            });
        }

        calendarBody.addEventListener('click', (e) => {
            const previouslyActive = calendarBody.querySelector('.active-day');
            if (previouslyActive) previouslyActive.classList.remove('active-day');
            const clickedDay = e.target;
            if (clickedDay.classList.contains('event-day')) {
                clickedDay.classList.add('active-day');
                showEventDetails(clickedDay.dataset.date);
            } else if (clickedDay.classList.contains('calendar-day') && !clickedDay.classList.contains('empty-day')) {
                clearEventDetails();
            }
        });

        renderCalendar();
    }


    // ===================================================
    // === CÓDIGO DO PAINEL DE ADMIN
    // ===================================================

    // Animação de contagem dos números nos cards sociais
    const counters = document.querySelectorAll('.social-metric');
    if (counters.length > 0) {
        const animationDuration = 2000;
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const updateCount = () => {
                const current = +counter.innerText;
                const increment = target / (animationDuration / 50);
                if (current < target) {
                    counter.innerText = `${Math.ceil(current + increment)}`;
                    setTimeout(updateCount, 50);
                } else {
                    if (target >= 1000) {
                        counter.innerText = (target / 1000).toFixed(1) + 'k';
                    } else {
                        counter.innerText = target;
                    }
                }
            };
            updateCount();
        });
    }

    // Confirmação antes de apagar um texto no painel de admin
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const wantsToDelete = confirm('Tem certeza de que deseja apagar este item? Esta ação não pode ser desfeita.');
            if (wantsToDelete) {
                this.closest('.text-item').remove();
            }
        });
    });

    // Validação do formulário de mudança de senha
    const changePasswordForm = document.getElementById('change-password-form');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (newPassword !== confirmPassword) {
                alert('A "Nova Senha" e a "Confirmação de Senha" não correspondem. Tente novamente.');
            } else if (newPassword.length < 8) {
                alert('A nova senha deve ter pelo menos 8 caracteres.');
            } else {
                alert('Senha alterada com sucesso! (Esta é uma simulação)');
                this.reset();
            }
        });
    }

});