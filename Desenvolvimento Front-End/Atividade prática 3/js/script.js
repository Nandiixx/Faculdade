const paginas = new Set(['index.html', 'cadastro.html', 'projetos.html']);

const ePaginaInterna = (url) => (
    url.origin === window.location.origin && paginas.has(url.pathname.split('/').pop())
);

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

const formatarValor = (campo) => {
    const apenasNumeros = campo.value.replace(/\D/g, '');

    if (campo.id === 'cpf') {
        campo.value = apenasNumeros
            .slice(0, 11)
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    if (campo.id === 'cep') {
        campo.value = apenasNumeros.slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
    }

    if (campo.id === 'telefone') {
        campo.value = apenasNumeros
            .slice(0, 11)
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2');
    }
};

document.addEventListener('input', (evento) => {
    const campo = evento.target.closest('.input-moderno');
    if (campo) formatarValor(campo);
});

document.addEventListener('submit', (evento) => {
    const formulario = evento.target.closest('form');
    if (!formulario) return;

    evento.preventDefault();
    if (!formulario.checkValidity()) {
        formulario.reportValidity();
        return;
    }

    const mensagem = formulario.closest('.formulario-container')?.querySelector('.alerta-sistema');
    if (mensagem) {
        mensagem.textContent = 'Cadastro enviado com sucesso! A nossa equipa entrará em contacto consigo.';
        mensagem.setAttribute('role', 'status');
    }
    formulario.reset();
});

const atualizarAncora = (hash) => {
    if (!hash) {
        window.scrollTo(0, 0);
        return;
    }

    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
};

const renderizarPagina = async (url, atualizarHistorico = false) => {
    try {
        const resposta = await fetch(url.href);
        if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);

        const documento = new DOMParser().parseFromString(await resposta.text(), 'text/html');
        document.body.innerHTML = documento.body.innerHTML;
        document.title = documento.title;
        fecharElementosInterativos();

        if (atualizarHistorico) {
            window.history.pushState({}, '', `${url.pathname}${url.hash}`);
        }

        atualizarAncora(url.hash);
    } catch (erro) {
        console.error('Erro ao carregar a página:', erro);
        window.location.assign(url.href);
    }
};

document.addEventListener('click', (evento) => {
    const link = evento.target.closest('a');
    if (link && link.target !== '_blank' && !link.hasAttribute('download')) {
        const url = new URL(link.href, window.location.href);
        if (ePaginaInterna(url)) {
            evento.preventDefault();
            if (url.href !== window.location.href) renderizarPagina(url, true);
            return;
        }
    }

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

window.addEventListener('popstate', () => {
    renderizarPagina(new URL(window.location.href));
});