const paginas = new Set(['index.html', 'cadastro.html', 'projetos.html']);

const ePaginaInterna = (url) => (
    url.origin === window.location.origin && paginas.has(url.pathname.split('/').pop())
);

const atualizarAncora = (hash) => {
    if (!hash) {
        window.scrollTo(0, 0);
        return;
    }

    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
};

export const renderizarPagina = async (url, atualizarHistorico = false) => {
    try {
        const resposta = await fetch(url.href);
        if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);

        const documento = new DOMParser().parseFromString(await resposta.text(), 'text/html');
        document.body.innerHTML = documento.body.innerHTML;
        document.title = documento.title;

        if (atualizarHistorico) {
            window.history.pushState({}, '', `${url.pathname}${url.hash}`);
        }

        atualizarAncora(url.hash);
    } catch (erro) {
        console.error('Erro ao carregar a página:', erro);
        window.location.assign(url.href);
    }
};

export const inicializarRouter = () => {
    document.addEventListener('click', (evento) => {
        const link = evento.target.closest('a');
        if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

        const url = new URL(link.href, window.location.href);
        if (!ePaginaInterna(url)) return;

        evento.preventDefault();
        if (url.href !== window.location.href) renderizarPagina(url, true);
    });

    window.addEventListener('popstate', () => {
        renderizarPagina(new URL(window.location.href));
    });
};
