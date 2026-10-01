const fecharElementosInterativos = () => {
    document.querySelectorAll('.modal-overlay, .toast-container').forEach((elemento) => {
        elemento.classList.remove('is-visible');
    });
};

const mostrarToast = () => {
    const toast = document.querySelector('.toast-container');
    toast?.classList.add('is-visible');
    window.setTimeout(() => toast?.classList.remove('is-visible'), 2500);
};

const mostrarAviso = () => {
    const aviso = document.querySelector('.alerta-aviso');
    aviso?.classList.add('is-visible');
    window.setTimeout(() => aviso?.classList.remove('is-visible'), 3000);
};

export const mostrarSucessoCadastro = () => {
    const mensagem = document.querySelector('.formulario-container .alerta-sistema');
    if (!mensagem) return;

    mensagem.textContent = 'Cadastro enviado com sucesso! A nossa equipa entrará em contacto consigo.';
    mensagem.setAttribute('role', 'status');
};

export const inicializarUI = () => {
    document.addEventListener('click', (evento) => {
        const menuToggle = evento.target.closest('.menu-toggle');
        if (menuToggle) {
            const nav = document.querySelector('.nav-principal');
            const aberto = nav?.classList.toggle('is-open') ?? false;
            menuToggle.setAttribute('aria-expanded', String(aberto));
            return;
        }

        const dropdownToggle = evento.target.closest('.dropdown-toggle');
        if (dropdownToggle) {
            const dropdown = dropdownToggle.closest('.menu-dropdown');
            const aberto = dropdown?.classList.toggle('is-open') ?? false;
            dropdownToggle.setAttribute('aria-expanded', String(aberto));
            return;
        }

        const apoiar = evento.target.closest('.apoiar-trigger');
        if (apoiar) {
            evento.preventDefault();
            if (apoiar.dataset.feedback === 'toast') {
                mostrarToast();
                mostrarAviso();
            } else {
                document.querySelector('.modal-overlay')?.classList.add('is-visible');
            }
            return;
        }

        if (evento.target.closest('#confirmar-apoio')) {
            document.querySelector('.modal-overlay')?.classList.remove('is-visible');
            mostrarToast();
            mostrarAviso();
            return;
        }

        if (evento.target.closest('.modal-fechar')) {
            fecharElementosInterativos();
            return;
        }

        if (!evento.target.closest('.menu-dropdown')) {
            document.querySelectorAll('.menu-dropdown').forEach((dropdown) => {
                dropdown.classList.remove('is-open');
                dropdown.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
            });
        }
    });
};
