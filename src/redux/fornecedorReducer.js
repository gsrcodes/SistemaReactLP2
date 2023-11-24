import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ESTADO from '../recursos/estado';

const urlBase = 'http://localhost:4000/fornecedor';

// Thunks
export const buscarFornecedores = createAsyncThunk('fornecedor/buscarFornecedores', async () => {
    try {
        const resposta = await fetch(urlBase, { method: 'GET' });
        const dados = await resposta.json();
        if (dados.status) {
            return {
                status: true,
                listaFornecedores: dados.listaFornecedores,
                mensagem: ''
            }
        } else {
            return {
                status: false,
                listaFornecedores: [],
                mensagem: 'Ocorreu um erro ao recuperar os fornecedores da base de dados.'
            }
        }
    } catch (erro) {
        return {
            status: false,
            listaFornecedores: [],
            mensagem: 'Ocorreu um erro ao recuperar os fornecedores da base de dados: ' + erro.message
        }
    }
});

export const adicionarFornecedor = createAsyncThunk('fornecedor/adicionar', async (fornecedor) => {
    const resposta = await fetch(urlBase, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fornecedor)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar o fornecedor: ' + erro.message
        }
    });

    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            fornecedor
        }
    } else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar o fornecedor.',
            fornecedor
        }
    }
});

export const atualizarFornecedor = createAsyncThunk('fornecedor/atualizar', async (fornecedor) => {
    const resposta = await fetch(urlBase, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fornecedor)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar o fornecedor: ' + erro.message
        }
    });

    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            fornecedor
        }
    } else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar o fornecedor.',
            fornecedor
        }
    }
});

export const removerFornecedor = createAsyncThunk('fornecedor/remover', async (cnpj) => {
    const resposta = await fetch(`${urlBase}/${cnpj}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover o fornecedor: ' + erro.message,
            fornecedor: { cnpj }
        }
    });

    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            fornecedor: { cnpj }
        }
    } else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover o fornecedor.',
            fornecedor: { cnpj }
        }
    }
});

const initialState = {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    fornecedores: [],
};

const fornecedorSlice = createSlice({
    name: 'fornecedor',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(buscarFornecedores.pending, (state) => {
                state.estado = ESTADO.PENDENTE;
                state.mensagem = "Buscando fornecedores...";
            })
            .addCase(buscarFornecedores.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.estado = ESTADO.OCIOSO;
                    state.mensagem = action.payload.mensagem;
                    state.fornecedores = action.payload.listaFornecedores;
                } else {
                    state.estado = ESTADO.ERRO;
                    state.mensagem = action.payload.mensagem;
                }
            })
            .addCase(buscarFornecedores.rejected, (state, action) => {
                state.estado = ESTADO.ERRO;
                state.mensagem = action.error.message;
            })
            .addCase(adicionarFornecedor.fulfilled, (state, action) => {
                state.estado = ESTADO.OCIOSO;
                state.fornecedores.push(action.payload.fornecedor);
                state.mensagem = action.payload.mensagem;
            })
            .addCase(adicionarFornecedor.pending, (state, action) => {
                state.estado = ESTADO.PENDENTE;
                state.mensagem = "Adicionando fornecedor...";
            })
            .addCase(adicionarFornecedor.rejected, (state, action) => {
                state.mensagem = "Erro ao adicionar o fornecedor: " + action.error.message;
                state.estado = ESTADO.ERRO;
            })
            .addCase(atualizarFornecedor.fulfilled, (state, action) => {
                state.estado = ESTADO.OCIOSO;
                const indice = state.fornecedores.findIndex(fornecedor => fornecedor.cnpj === action.payload.fornecedor.cnpj);
                state.fornecedores[indice] = action.payload.fornecedor;
                state.mensagem = action.payload.mensagem;

            })
            .addCase(atualizarFornecedor.pending, (state, action) => {
                state.estado = ESTADO.PENDENTE;
                state.mensagem = "Atualizando fornecedor...";
            })
            .addCase(atualizarFornecedor.rejected, (state, action) => {
                state.mensagem = "Erro ao atualizar o fornecedor: " + action.error.message;
                state.estado = ESTADO.ERRO;
            })
            .addCase(removerFornecedor.fulfilled, (state, action) => {
                state.estado = ESTADO.OCIOSO;
                state.mensagem = action.payload.mensagem;
                state.fornecedores = state.fornecedores.filter(fornecedor => fornecedor.cnpj !== action.payload.fornecedor.cnpj);
            })
            .addCase(removerFornecedor.pending, (state, action) => {
                state.estado = ESTADO.PENDENTE;
                state.mensagem = "Removendo fornecedor...";
            })
            .addCase(removerFornecedor.rejected, (state, action) => {
                state.mensagem = "Erro ao remover o fornecedor: " + action.error.message;
                state.estado = ESTADO.ERRO;
            })
    }
});

export default fornecedorSlice.reducer;