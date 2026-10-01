import { inicializarRouter } from './core/router.js';
import { formatarValor, validarFormulario } from './utils/validacao.js';
import { guardarSessao } from './services/storage.js';
import { inicializarUI, mostrarSucessoCadastro } from './components/ui.js';

const inicializarFormulario = () => {
    document.addEventListener('input', (evento) => {
        const campo = evento.target.closest('.input-moderno');
        if (campo) formatarValor(campo);
    });

    document.addEventListener('submit', (evento) => {
        const formulario = evento.target.closest('form');
        if (!formulario) return;

        evento.preventDefault();
        if (!validarFormulario(formulario)) return;

        guardarSessao(Object.fromEntries(new FormData(formulario).entries()));
        mostrarSucessoCadastro();
        formulario.reset();
    });
};

inicializarRouter();
inicializarUI();
inicializarFormulario();
