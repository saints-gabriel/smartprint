import { useEffect, useRef, useState } from "react";

export const NovoPedido = ({ onEnviarPedido }) => {
    const [itens, setItens] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [nomeItem, setNomeItem] = useState("");
    const [valorItem, setValorItem] = useState("");
    const [quantidadeItem, setQuantidadeItem] = useState("1");
    const [nomeCliente, setNomeCliente] = useState("");
    const [numeroMesa, setNumeroMesa] = useState("");
    const [ipEsp32, setIpEsp32] = useState("192.168.1.100");
    const [enviando, setEnviando] = useState(false);
    const dialogRef = useRef(null);
    const proximoItemId = useRef(0);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (modalAberto && !dialog.open) {
            dialog.showModal();
        } else if (!modalAberto && dialog.open) {
            dialog.close();
        }
    }, [modalAberto]);

    const total = itens.reduce((soma, item) => soma + (item.valor * item.quantidade), 0);

    const formatarValor = (valor) =>
        new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(valor);

    const adicionarItem = (event) => {
        event.preventDefault();
        const qtd = parseInt(quantidadeItem) || 1;
        const vlr = parseFloat(valorItem) || 0;

        setItens((itensAtuais) => [
            ...itensAtuais,
            {
                id: proximoItemId.current++,
                nome: nomeItem.trim(),
                quantidade: qtd,
                valor: vlr,
                subtotal: qtd * vlr,
            },
        ]);
        setNomeItem("");
        setValorItem("");
        setQuantidadeItem("1");
        setModalAberto(false);
    };

    const enviarPedidoEEmitirComanda = async (event)     => {
        event.preventDefault();

        if (itens.length === 0) {
            return;
        }

       const dadosPedido = {
            nomeCliente: nomeCliente.trim(),
            numeroMesa: numeroMesa.trim(),
            itens: itens.map(({ nome, quantidade, valor, subtotal }) => ({ 
                nome, 
                quantidade, 
                valor, 
                subtotal 
            })),
            total,
            dataHora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
        };

        setEnviando(true);
        try {
            // Requisição HTTP POST direta ao ESP32 sem MQTT/broker externo
            const response = await fetch(`http://${ipEsp32}/imprimir`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dadosPedido)
            });

            if (response.ok) {
                alert("Cupom/Comanda enviada para o ESP32 e impressa com sucesso!");
            } else {
                alert(`Erro no ESP32: Status ${response.status}`);
            }
        } catch (error) {
            console.warn("Falha de conexão com o ESP32:", error);
            alert(`Aviso: Pedido salvo no sistema, mas não foi possível conectar ao ESP32 em http://${ipEsp32}. Verifique o IP e a rede Wi-Fi.`);
        } finally {
            setEnviando(false);
            // Salva no estado do React
            onEnviarPedido(dadosPedido);
            // Limpa o formulário
            setNomeCliente("");
            setNumeroMesa("");
            setItens([]);
        }
    
    };


    return (
        <main className="flex flex-col w-[75%] h-fit p-4 bg-white rounded-md shadow-sm border border-gray-100 my-5">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="font-bold text-xl">Novo Pedido / Comanda</h1>
                    <h3 className="text-gray-500">Preencha com os dados da mesa e dos itens.</h3>
           </div>
           <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-md border text-xs">
                    <label htmlFor="ipEsp" className="font-semibold text-gray-600">IP do ESP32:</label>
                    <input 
                        id="ipEsp"
                        type="text" 
                        value={ipEsp32} 
                        onChange={(e) => setIpEsp32(e.target.value)}
                        className="bg-white border rounded px-2 py-1 w-32 font-mono"
                        placeholder="192.168.1.100"
                    />
                </div>
            </div>

            <form onSubmit={enviarPedidoEEmitirComanda} className="my-5">
                <h2 className="font-bold text-gray-700 mb-2">Informações da Comanda</h2>
                <div className="flex flex-row gap-5">
                    <label htmlFor="numMesa" className="flex-1 text-sm font-medium text-gray-700">
                        Número da Mesa
                        <br />
                        <input
                            name="numMesa"
                            id="numMesa"
                            value={numeroMesa}
                            onChange={(event) => setNumeroMesa(event.target.value)}
                            required
                            placeholder="Ex: 05"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </label>
                    <label htmlFor="nomCliente" className="flex-1 text-sm font-medium text-gray-700">
                        Nome do Cliente <br />
                        <input
                            name="nomCliente"
                            id="nomCliente"
                            value={nomeCliente}
                            onChange={(event) => setNomeCliente(event.target.value)}
                            required
                            placeholder="Ex: João Silva"
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </label>
                </div>
                <div className="my-3 flex justify-between items-center">
                    <h2 className="font-bold text-gray-700">Itens do pedido</h2>
                    <button
                        type="button"
                        onClick={() => setModalAberto(true)}
                       className="hover:cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium shadow-sm"
                    >
                        + Adicionar Itens
                    </button>
                </div>
                <div className={`rounded-md bg-gray-50 border border-gray-200 min-h-60 p-4 mb-4 ${itens.length === 0 ? "flex items-center justify-center text-gray-400" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"}`}>
                    {itens.length === 0 ? (
                        <p>Nenhum Item Adicionado.</p>
                    ) : (
                        itens.map((item) => (
                            <div key={item.id} className="rounded-md bg-white p-3 shadow-sm border border-gray-200">
                                <div className="flex items-start justify-between gap-2">
                                    <p className="font-semibold text-gray-800">{item.quantidade}x {item.nome}</p>
                                    <button
                                        type="button"
                                        onClick={() => setItens((itensAtuais) => itensAtuais.filter(({ id }) => id !== item.id))}

                                        className="rounded text-xs text-red-600 hover:bg-red-50 p-1"
                                    >
                                        Remover
                                    </button>
                                </div>
                                <div className="mt-2 text-xs text-gray-500 flex justify-between">
                                    <span>Un: {formatarValor(item.valor)}</span>
                                    <span className="font-semibold text-gray-700">Subtotal: {formatarValor(item.subtotal)}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-md border border-blue-100 mb-4">
                    <span className="font-bold text-gray-700">Total da Comanda:</span>
                    <span className="text-3xl font-extrabold text-emerald-600">{formatarValor(total)}</span>
                </div>

                <button
                    type="submit"
                    disabled={itens.length === 0 || enviando}
                    className="w-full rounded-md bg-emerald-600 px-4 py-3 text-white font-bold transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300 shadow"
                >
                    {enviando ? "Enviando e Imprimindo..." : "Finalizar & Enviar para Impressão Thermal"}
                </button>
            </form>

            {/* Modal para Adicionar Item */}
            <dialog
                ref={dialogRef}
                onClose={() => setModalAberto(false)}
                onClick={(event) => {
                    if (event.target === event.currentTarget) setModalAberto(false);
                }}
                className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md border-0 bg-transparent p-0 backdrop:bg-black/50"
            >
                <form onSubmit={adicionarItem} className="rounded-lg bg-white p-6 shadow-2xl">
                    <h2 className="mb-4 text-xl font-bold text-gray-800">Adicionar Item à Comanda</h2>
                    
                    <label htmlFor="nomeItem" className="mb-3 block text-sm font-medium text-gray-700">
                        Nome do produto
                        <input
                            autoComplete="off"
                            autoFocus
                            id="nomeItem"
                            type="text"
                            required
                            placeholder="Ex: Sucos de Laranja / X-Tudo"
                            value={nomeItem}
                            onChange={(e) => setNomeItem(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                        />
                    </label>

                    <div className="flex gap-3 mb-5">
                        <label htmlFor="quantidadeItem" className="w-1/3 text-sm font-medium text-gray-700">
                            Qtd.
                            <input
                                id="quantidadeItem"
                                type="number"
                                min="1"
                                required
                                value={quantidadeItem}
                                onChange={(e) => setQuantidadeItem(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                            />
                        </label>

                        <label htmlFor="valorItem" className="w-2/3 text-sm font-medium text-gray-700">
                            Preço Unitário (R$)
                            <input
                                id="valorItem"
                                type="number"
                                min="0"
                                step="0.01"
                                required
                                placeholder="0.00"
                                value={valorItem}
                                onChange={(e) => setValorItem(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                            />
                        </label>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setModalAberto(false)}
                            className="rounded-md border px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Adicionar à Lista
                        </button>
                    </div>
                </form>
            </dialog>
        </main>
    );
};