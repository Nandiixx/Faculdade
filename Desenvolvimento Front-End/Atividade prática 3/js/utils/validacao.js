export const formatarValor = (campo) => {
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

export const validarFormulario = (formulario) => {
    if (formulario.checkValidity()) return true;

    formulario.reportValidity();
    return false;
};
