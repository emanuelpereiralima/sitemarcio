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