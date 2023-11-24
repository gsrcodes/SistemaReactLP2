import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ESTADO from '../recursos/estado';
const urlBase = 'http://localhost:4000/categoria';
//Thunks
export const buscarCategorias = createAsyncThunk('categoria/buscarCategorias', async () => {
    try { 
        const resposta = await fetch(urlBase, { method: 'GET' });
        const dados = await resposta.json();
        if (dados.status) {
            return {
                status: true,
                listaCategorias: dados.listaCategorias,
                mensagem: ''
            }
        }
        else {
            return {
                status: false,
                listaCategorias: [],
                mensagem: 'Ocorreu um erro ao recuperar as categorias da base de dados.'
            }
        }
    } catch (erro) {
        return {
            status: false,
            listaCategorias: [],
            mensagem: 'Ocorreu um erro ao recuperar as categorias da base de dados:' + erro.message
        }
    }
});

export const adicionarCategoria = createAsyncThunk('categoria/adicionar', async (categoria) => {
    const resposta = await fetch(urlBase, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoria)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar a categoria:' + erro.message
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            categoria
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar a categoria.',
            categoria
        }
    }
});

export const atualizarCategoria = createAsyncThunk('categoria/atualizar', async (categoria) => {
    const resposta = await fetch(urlBase, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoria)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar a categoria:' + erro.message
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            categoria

        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar a categoria.',
            categoria

        }
    }
});

export const removerCategoria = createAsyncThunk('categoria/remover', async (categoria) => {
    const resposta = await fetch(urlBase, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoria)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover a categoria:' + erro.message,
            categoria
        }
    });
    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            categoria
        }
    }
    else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover a categoria.',
            categoria
        }
    }
});

const initialState = {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    categorias: [],
};

const categoriaSlice = createSlice({
    name: 'categoria',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(buscarCategorias.pending, (state, action) => {
                state.estado = ESTADO.PENDENTE;
                state.mensagem = "Buscando categorias...";
            })
            .addCase(buscarCategorias.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.estado = ESTADO.OCIOSO;
                    state.mensagem = action.payload.mensagem;
                    state.categorias = action.payload.listaCategorias;
                } else {
                    state.estado = ESTADO.ERRO;
                    state.mensagem = action.payload.mensagem;
                }
            })
            .addCase(buscarCategorias.rejected, (state, action) => {
                state.estado = ESTADO.ERRO;
                state.mensagem = action.error.message;
            })
            .addCase(adicionarCategoria.fulfilled, (state, action) => {
                state.estado = ESTADO.OCIOSO;
                state.categorias.push(action.payload.categoria);
                state.mensagem = action.payload.mensagem;
            })
            .addCase(adicionarCategoria.pending, (state, action) => {
                state.estado = ESTADO.PENDENTE;
                state.mensagem = "Adicionando categoria...";
            })
            .addCase(adicionarCategoria.rejected, (state, action) => {
                state.mensagem = "Erro ao adicionar a categoria: " + action.error.message;
                state.estado = ESTADO.ERRO;
            })
            .addCase(atualizarCategoria.fulfilled, (state, action) => {
                state.estado = ESTADO.OCIOSO;
                const indice = state.categorias.findIndex(categoria => categoria.codigo === action.payload.categoria.codigo);
                state.categorias[indice] = action.payload.categoria;
                state.mensagem = action.payload.mensagem;

            })
            .addCase(atualizarCategoria.pending, (state, action) => {
                state.estado = ESTADO.PENDENTE;
                state.mensagem = "Atualizando categoria...";
            })
            .addCase(atualizarCategoria.rejected, (state, action) => {
                state.mensagem = "Erro ao atualizar a categoria: " + action.error.message;
                state.estado = ESTADO.ERRO;
            })
            .addCase(removerCategoria.fulfilled, (state, action) => {
                state.estado = ESTADO.OCIOSO;
                state.mensagem = action.payload.mensagem;
                state.categorias = state.categorias.filter(categoria => categoria.codigo !== action.payload.categoria.codigo);
            })
            .addCase(removerCategoria.pending, (state, action) => {
                state.estado = ESTADO.PENDENTE;
                state.mensagem = "Removendo categoria...";
            })
            .addCase(removerCategoria.rejected, (state, action) => {
                state.mensagem = "Erro ao remover a categoria: " + action.error.message;
                state.estado = ESTADO.ERRO;
            })
    }
});

export default categoriaSlice.reducer;