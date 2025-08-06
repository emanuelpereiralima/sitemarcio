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

    const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Login bem-sucedido
                localStorage.setItem('token', data.token); // Salva o token no navegador
                window.location.href = 'admin.html'; // Redireciona para o painel
            } else {
                // Erro no login
                alert('Erro: ' + (data.message || 'Credenciais inválidas.'));
            }
        } catch (error) {
            console.error('Erro ao tentar fazer login:', error);
            alert('Não foi possível conectar ao servidor.');
        }
    });
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

    // ===================================================
    // === SIMULAÇÃO DE ATUALIZAÇÃO DA PÁGINA INICIAL ===
    // ===================================================

    // --- BIO ---
    const bioTextarea = document.getElementById('bio-textarea');
    const saveBioBtn = document.getElementById('save-bio-btn');
    const salveContentPara = document.querySelectorAll('#salve .salve-content p'); // Seleciona todos os <p> da bio

    if (saveBioBtn && bioTextarea && salveContentPara.length > 0) {
        saveBioBtn.addEventListener('click', () => {
            const newBio = bioTextarea.value;
            // Simula a atualização da bio na página inicial (atualiza o primeiro parágrafo)
            if (salveContentPara.length > 0) {
                salveContentPara.forEach(p => p.textContent = newBio); // Atualiza todos os parágrafos com o mesmo texto
                alert('Bio atualizada (simulação)! Para ver a mudança, volte para a página inicial (a atualização real requer backend).');
            }
        });
    }

    // --- ADICIONAR FILME ---
    const filmeAnoInput = document.getElementById('filme-ano-input');
    const filmeNomeInput = document.getElementById('filme-nome-input');
    const addFilmeBtn = document.getElementById('add-filme-btn');
    const timelineTrackAdmin = document.getElementById('timeline-track'); // Usamos a mesma timeline

    if (addFilmeBtn && filmeAnoInput && filmeNomeInput && timelineTrackAdmin) {
        addFilmeBtn.addEventListener('click', () => {
            const ano = filmeAnoInput.value;
            const nome = filmeNomeInput.value;

            if (ano && nome) {
                const newFilmeItem = document.createElement('div');
                newFilmeItem.className = 'timeline-year-item';
                newFilmeItem.innerHTML = `
                    <div class="year-label">${ano}</div>
                    <div class="year-marker"></div>
                    <ul class="works-list"><li>${nome}</li></ul>
                `;
                timelineTrackAdmin.appendChild(newFilmeItem);
                alert('Filme adicionado à timeline (simulação)! Para ver a mudança, volte para a página inicial (a atualização real requer backend).');
                filmeAnoInput.value = '';
                filmeNomeInput.value = '';
            } else {
                alert('Por favor, preencha o ano e o nome do filme.');
            }
        });
    }

    // --- ADICIONAR TEXTO ---
    const textoTituloInput = document.getElementById('texto-titulo-input');
    const textoConteudoTextarea = document.getElementById('texto-conteudo-textarea');
    const publishTextoBtn = document.getElementById('publish-texto-btn');
    const textosContainer = document.querySelector('#textos .textos-container');

    if (publishTextoBtn && textoTituloInput && textoConteudoTextarea && textosContainer) {
        publishTextoBtn.addEventListener('click', () => {
            const titulo = textoTituloInput.value;
            const conteudo = textoConteudoTextarea.value;

            if (titulo && conteudo) {
                const newTextPost = document.createElement('article');
                newTextPost.className = 'post-card';
                newTextPost.innerHTML = `
                    <div class="post-content">
                        <h3>${titulo}</h3>
                        <p class="post-meta">Publicado agora (simulação)</p>
                        <p class="post-excerpt">${conteudo.substring(0, 200)}...</p>
                        <a href="#" class="post-readmore">Leia Mais</a>
                    </div>
                `;
                textosContainer.prepend(newTextPost); // Adiciona o novo texto no início
                alert('Texto publicado (simulação)! Para ver a mudança, volte para a página inicial (a atualização real requer backend).');
                textoTituloInput.value = '';
                textoConteudoTextarea.value = '';
            } else {
                alert('Por favor, preencha o título e o conteúdo do texto.');
            }
        });
    }

});