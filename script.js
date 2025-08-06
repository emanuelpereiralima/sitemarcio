document.addEventListener('DOMContentLoaded', function() {

    // Tenta inicializar o Firestore DB. A variável 'firebase' vem do script no HTML.
    const db = (typeof firebase !== 'undefined') ? firebase.firestore() : null;

    // ===================================================
    // === CÓDIGOS GERAIS DO SITE (Aplicado a todas as páginas)
    // ===================================================

    // Smooth scrolling para links de âncora (ex: #contato)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            // Só executa o scroll se for um ID válido na página atual
            if (targetId.length > 1 && document.querySelector(targetId)) {
                e.preventDefault();
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Faz o logo na página principal levar para a tela de login
    const logoLink = document.querySelector('header .logo');
    if (logoLink) {
        logoLink.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
        logoLink.style.cursor = 'pointer';
    }

    // Formulário de Contato
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nome = this.nome.value;
            const assunto = this.assunto.value;
            if (nome && assunto) {
                alert(`Obrigado, ${nome}! Recebemos sua mensagem sobre "${assunto}".`);
                this.reset();
            } else {
                alert('Por favor, preencha todos os campos obrigatórios.');
            }
        });
    }

    // ===================================================
    // === LÓGICA DA PÁGINA INICIAL (index.html)
    // ===================================================

    // Popula a timeline de filmes com dados estáticos
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
            yearItem.innerHTML = `<div class="year-label">${item.year}</div><div class="year-marker"></div><ul class="works-list">${item.works.map(work => `<li>${work}</li>`).join('')}</ul>`;
            timelineTrack.appendChild(yearItem);
        });
    }

    // Carrega os textos do Firestore e exibe na seção #textos
    const textosContainer = document.querySelector('#textos .textos-container');
    if (textosContainer && db) {
        db.collection("textos").orderBy("createdAt", "desc").get().then((querySnapshot) => {
            if (querySnapshot.empty) {
                textosContainer.innerHTML = "<p>Nenhum texto publicado ainda.</p>";
                return;
            }
            textosContainer.innerHTML = ''; // Limpa os posts de exemplo
            querySnapshot.forEach((doc) => {
                const post = doc.data();
                const postDate = post.createdAt ? post.createdAt.toDate().toLocaleDateString('pt-BR') : 'Data indisponível';
                const postElement = document.createElement('article');
                postElement.className = 'post-card';
                postElement.innerHTML = `
                    <div class="post-content">
                        <h3>${post.titulo}</h3>
                        <p class="post-meta">Publicado em ${postDate}</p>
                        <p class="post-excerpt">${post.conteudo.substring(0, 150)}...</p>
                        <a href="#" class="post-readmore">Leia Mais</a>
                    </div>
                `;
                textosContainer.appendChild(postElement);
            });
        }).catch(error => console.error("Erro ao carregar textos: ", error));
    }


    // ===================================================
    // === LÓGICA DO PAINEL DE ADMIN (admin.html)
    // ===================================================

    // Adicionar novo texto ao Firestore
    const publishTextoBtn = document.getElementById('publish-texto-btn');
    if (publishTextoBtn && db) {
        publishTextoBtn.addEventListener('click', () => {
            const tituloInput = document.getElementById('texto-titulo-input');
            const conteudoTextarea = document.getElementById('texto-conteudo-textarea');
            
            if (tituloInput.value && conteudoTextarea.value) {
                publishTextoBtn.textContent = "Publicando...";
                publishTextoBtn.disabled = true;

                db.collection("textos").add({
                    titulo: tituloInput.value,
                    conteudo: conteudoTextarea.value,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                })
                .then(() => {
                    alert('Texto publicado com sucesso!');
                    tituloInput.value = '';
                    conteudoTextarea.value = '';
                    loadPublishedTexts(); // Recarrega a lista de textos
                })
                .catch((error) => {
                    console.error("Erro ao adicionar texto: ", error);
                    alert('Erro ao publicar texto.');
                })
                .finally(() => {
                    publishTextoBtn.textContent = "Publicar Texto";
                    publishTextoBtn.disabled = false;
                });
            } else {
                alert("Por favor, preencha o título e o conteúdo.");
            }
        });
    }

    // Função para carregar os textos existentes no painel de admin
    const publishedTextsList = document.querySelector('.published-texts-list');
    function loadPublishedTexts() {
        if (!publishedTextsList || !db) return;

        db.collection("textos").orderBy("createdAt", "desc").get().then(snapshot => {
            publishedTextsList.innerHTML = ''; // Limpa a lista antes de recarregar
            snapshot.forEach(doc => {
                const post = doc.data();
                const textItem = document.createElement('div');
                textItem.className = 'text-item';
                textItem.dataset.id = doc.id; // Salva o ID do documento para a exclusão
                textItem.innerHTML = `
                    <span>${post.titulo}</span>
                    <div class="text-item-actions">
                        <button class="btn-edit"><i class="fas fa-edit"></i> Editar</button>
                        <button class="btn-delete"><i class="fas fa-trash"></i> Apagar</button>
                    </div>
                `;
                publishedTextsList.appendChild(textItem);
            });
        });
    }

    // Lógica para apagar textos
    if (publishedTextsList && db) {
        loadPublishedTexts(); // Carrega os textos quando a página do admin abre

        publishedTextsList.addEventListener('click', (e) => {
            const deleteButton = e.target.closest('.btn-delete');
            if (deleteButton) {
                const textItem = deleteButton.closest('.text-item');
                const docId = textItem.dataset.id;
                
                if (confirm('Tem certeza que deseja apagar este texto? A ação é permanente.')) {
                    db.collection('textos').doc(docId).delete()
                    .then(() => {
                        alert('Texto apagado com sucesso!');
                        textItem.remove(); // Remove o item da tela
                    })
                    .catch(error => {
                        console.error('Erro ao apagar texto: ', error);
                        alert('Ocorreu um erro ao apagar o texto.');
                    });
                }
            }
        });
    }

    // Validação do formulário de mudança de senha
    const changePasswordForm = document.getElementById('change-password-form');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (newPassword !== confirmPassword) {
                alert('A "Nova Senha" e a "Confirmação de Senha" não correspondem.');
            } else if (newPassword.length < 8) {
                alert('A nova senha deve ter pelo menos 8 caracteres.');
            } else {
                alert('Senha alterada com sucesso! (Esta é uma simulação de frontend)');
                this.reset();
            }
        });
    }

});