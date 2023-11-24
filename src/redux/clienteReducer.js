import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ESTADO from '../recursos/estado';

const urlBase = 'http://localhost:4000/cliente';

// Thunks
export const buscarClientes = createAsyncThunk('cliente/buscarClientes', async () => {
    try {
        const resposta = await fetch(urlBase, { method: 'GET' });
        const dados = await resposta.json();
        if (dados.status) {
            return {
                status: true,
                listaClientes: dados.listaClientes,
                mensagem: ''
            }
        } else {
            return {
                status: false,
                listaClientes: [],
                mensagem: 'Ocorreu um erro ao recuperar os clientes da base de dados.'
            }
        }
    } catch (erro) {
        return {
            status: false,
            listaClientes: [],
            mensagem: 'Ocorreu um erro ao recuperar os clientes da base de dados: ' + erro.message
        }
    }
});

export const adicionarCliente = createAsyncThunk('cliente/adicionar', async (cliente) => {
    const resposta = await fetch(urlBase, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar o cliente: ' + erro.message
        }
    });

    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            cliente
        }
    } else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao adicionar o cliente.',
            cliente
        }
    }
});

export const atualizarCliente = createAsyncThunk('cliente/atualizar', async (cliente) => {
    const resposta = await fetch(urlBase, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar o cliente: ' + erro.message
        }
    });

    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            cliente
        }
    } else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao atualizar o cliente.',
            cliente
        }
    }
});

export const removerCliente = createAsyncThunk('cliente/remover', async (cliente) => {
    const resposta = await fetch(urlBase, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    }).catch(erro => {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover o cliente: ' + erro.message,
            cliente
        }
    });

    if (resposta.ok) {
        const dados = await resposta.json();
        return {
            status: dados.status,
            mensagem: dados.mensagem,
            cliente
        }
    } else {
        return {
            status: false,
            mensagem: 'Ocorreu um erro ao remover o cliente.',
            cliente
        }
    }
});

const initialState = {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    clientes: [],
};

const clienteSlice = createSlice({
    name: 'cliente',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(buscarClientes.pending, (state) => {
                state.estado = ESTADO.PENDENTE;
                state.mensagem = "Buscando clientes...";
            })
            .addCase(buscarClientes.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.estado = ESTADO.OCIOSO;
                    state.mensagem = action.payload.mensagem;
                    state.clientes = action.payload.listaClientes;
                } else {
                    state.estado = ESTADO.ERRO;
                    state.mensagem = action.payload.mensagem;
                }
            })
            .addCase(buscarClientes.rejected, (state, action) => {
                state.estado = ESTADO.ERRO;
                state.mensagem = action.error.message;
            })
            .addCase(adicionarCliente.fulfilled, (state, action) => {
                state.estado = ESTADO.OCIOSO;
                state.clientes.push(action.payload.cliente);
                state.mensagem = action.payload.mensagem;
            })
            .addCase(adicionarCliente.pending, (state, action) => {
                state.estado = ESTADO.PENDENTE;
                state.mensagem = "Adicionando cliente...";
            })
            .addCase(adicionarCliente.rejected, (state, action) => {
                state.mensagem = "Erro ao adicionar o cliente: " + action.error.message;
                state.estado = ESTADO.ERRO;
            })
            .addCase(atualizarCliente.fulfilled, (state, action) => {
                state.estado = ESTADO.OCIOSO;
                const indice = state.clientes.findIndex(c => c.cpf === action.payload.cliente.cpf);
                state.clientes[indice] = action.payload.cliente;
                state.mensagem = action.payload.mensagem;
            })
            .addCase(atualizarCliente.pending, (state, action) => {
                state.estado = ESTADO.PENDENTE;
                state.mensagem = "Atualizando cliente...";
            })
            .addCase(atualizarCliente.rejected, (state, action) => {
                state.mensagem = "Erro ao atualizar o cliente: " + action.error.message;
                state.estado = ESTADO.ERRO;
            })
            .addCase(removerCliente.fulfilled, (state, action) => {
                state.estado = ESTADO.OCIOSO;
                state.mensagem = action.payload.mensagem;
                state.clientes = state.clientes.filter(c => c.cpf !== action.payload.cliente.cpf);
            })
            .addCase(removerCliente.pending, (state, action) => {
                state.estado = ESTADO.PENDENTE;
                state.mensagem = "Removendo cliente...";
            })
            .addCase(removerCliente.rejected, (state, action) => {
                state.mensagem = "Erro ao remover o cliente: " + action.error.message;
                state.estado = ESTADO.ERRO;
            });
    }
});

export default clienteSlice.reducer;