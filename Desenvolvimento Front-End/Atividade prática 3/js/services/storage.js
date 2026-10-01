const CHAVE_CADASTRO = 'maos-que-transformam:cadastrado';

export const guardarSessao = (dados) => {
    window.localStorage.setItem(CHAVE_CADASTRO, JSON.stringify(dados));
};

export const obterSessao = () => {
    const dados = window.localStorage.getItem(CHAVE_CADASTRO);
    return dados ? JSON.parse(dados) : null;
};
