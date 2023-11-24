import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ESTADO from '../recursos/estado';

const urlBase = 'http://localhost:4000/produto';

// Thunks
export const buscarProdutos = createAsyncThunk('produto/buscarProdutos', async () => {
    try {
        const resposta = await fetch(urlBase, { method: 'GET' });
        const dados = await resposta.json();
        if (dados.status) {
            return {
                status: true,
                listaProdutos: dados.listaProdutos,
                mensagem: ''
            }
        } else {
            return {
                status: false,
                listaProdutos: [],
                mensagem: 'Ocorreu um erro ao recuperar os produtos da base de dados.'
            }
        }
    } catch (erro) {
        return {
            status: false,
            listaProdutos: [],
            mensagem: 'Ocorreu um erro ao recuperar os produtos da base de dados: ' + erro.message
        }
    }
});

export const adicionarProduto = createAsyncThunk('produto/adicionar', async (produto) => {
    const resposta = await fetch(urlBase, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produto)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar o produto: ' + erro.message
        }
    });

    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            produto
        }
    } else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar o produto.',
            produto
        }
    }
});

export const atualizarProduto = createAsyncThunk('produto/atualizar', async (produto) => {
    const resposta = await fetch(urlBase, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produto)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar o produto: ' + erro.message
        }
    });

    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            produto
        }
    } else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar o produto.',
            produto
        }
    }
});

export const removerProduto = createAsyncThunk('produto/remover', async (produto) => {
    const resposta = await fetch(urlBase, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produto)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover o produto: ' + erro.message,
            produto
        }
    });

    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            produto
        }
    } else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover o produto.',
            produto
        }
    }
});

const initialState = {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    produtos: [],
};

const produtoSlice = createSlice({
    name: 'produto',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(buscarProdutos.pending, (state) => {
                state.estado = ESTADO.PENDENTE;
                state.mensagem = "Buscando produtos...";
            })
            .addCase(buscarProdutos.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.estado = ESTADO.OCIOSO;
                    state.mensagem = action.payload.mensagem;
                    state.produtos = action.payload.listaProdutos;
                } else {
                    state.estado = ESTADO.ERRO;
                    state.mensagem = action.payload.mensagem;
                }
            })
            .addCase(buscarProdutos.rejected, (state, action) => {
                state.estado = ESTADO.ERRO;
                state.mensagem = action.error.message;
            })
            .addCase(adicionarProduto.fulfilled, (state, action) => {
                state.estado = ESTADO.OCIOSO;
                state.produtos.push(action.payload.produto);
                state.mensagem = action.payload.mensagem;
            })
            .addCase(adicionarProduto.pending, (state, action) => {
                state.estado = ESTADO.PENDENTE;
                state.mensagem = "Adicionando produto...";
            })
            .addCase(adicionarProduto.rejected, (state, action) => {
                state.mensagem = "Erro ao adicionar o produto: " + action.error.message;
                state.estado = ESTADO.ERRO;
            })
            .addCase(atualizarProduto.fulfilled, (state, action) => {
                state.estado = ESTADO.OCIOSO;
                const indice = state.produtos.findIndex(p => p.codigo === action.payload.produto.codigo);
                state.produtos[indice] = action.payload.produto;
                state.mensagem = action.payload.mensagem;
            })
            .addCase(atualizarProduto.pending, (state, action) => {
                state.estado = ESTADO.PENDENTE;
                state.mensagem = "Atualizando produto...";
            })
            .addCase(atualizarProduto.rejected, (state, action) => {
                state.mensagem = "Erro ao atualizar o produto: " + action.error.message;
                state.estado = ESTADO.ERRO;
            })
            .addCase(removerProduto.fulfilled, (state, action) => {
                state.estado = ESTADO.OCIOSO;
                state.mensagem = action.payload.mensagem;
                state.produtos = state.produtos.filter(p => p.codigo !== action.payload.produto.codigo);
            })
            .addCase(removerProduto.pending, (state, action) => {
                state.estado = ESTADO.PENDENTE;
                state.mensagem = "Removendo produto...";
            })
            .addCase(removerProduto.rejected, (state, action) => {
                state.mensagem = "Erro ao remover o produto: " + action.error.message;
                state.estado = ESTADO.ERRO;
            });
    }
});

export default produtoSlice.reducer;
