import { useEffect, useRef, useState } from "react";

export const NovoPedido = ({ onEnviarPedido }) => {
    const [itens, setItens] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [nomeItem, setNomeItem] = useState("");
    const [valorItem, setValorItem] = useState("");
    const [nomeCliente, setNomeCliente] = useState("");
    const [numeroMesa, setNumeroMesa] = useState("");
    const dialogRef = useRef(null);
    const proximoItemId = useRef(0);

    useEffect(() => {
        const dialog = dialogRef.current;

        if (modalAberto && !dialog.open) {
            dialog.showModal();
        } else if (!modalAberto && dialog.open) {
            dialog.close();
        }
    }, [modalAberto]);

    const total = itens.reduce((soma, item) => soma + item.valor, 0);
    const formatarValor = (valor) =>
        new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(valor);

    const adicionarItem = (event) => {
        event.preventDefault();
        setItens((itensAtuais) => [
            ...itensAtuais,
            {
                id: proximoItemId.current++,
                nome: nomeItem.trim(),
                valor: Number(valorItem),
            },
        ]);
        setNomeItem("");
        setValorItem("");
        setModalAberto(false);
    };

    const enviarPedido = (event) => {
        event.preventDefault();

        if (itens.length === 0) {
            return;
        }

        onEnviarPedido({
            nomeCliente: nomeCliente.trim(),
            numeroMesa: numeroMesa.trim(),
            itens: itens.map(({ nome, valor }) => ({ nome, valor })),
            total,
        });
        setNomeCliente("");
        setNumeroMesa("");
        setItens([]);
    };

    return (
        <main className="flex flex-col w-[75%] h-fit p-3 bg-white rounded-sm my-5">
            <h1 className="font-bold text-xl">Novo Pedido</h1>
            <h3 className="text-gray-400">Preencha com os dados do pedido.</h3>
            <form onSubmit={enviarPedido} className="my-5">
                <h2 className="font-bold">Informações do Pedido</h2>
                <div className="flex flex-row gap-5">
                    <label htmlFor="numMesa">
                        Número da Mesa
                        <br />
                        <input
                            name="numMesa"
                            id="numMesa"
                            value={numeroMesa}
                            onChange={(event) => setNumeroMesa(event.target.value)}
                            required
                            pattern=".*\S.*"
                            title="Informe o número da mesa."
                            className="rounded-sm border-2"
                        />
                    </label>
                    <label htmlFor="nomCliente">
                        Nome do Cliente <br />
                        <input
                            name="nomCliente"
                            id="nomCliente"
                            value={nomeCliente}
                            onChange={(event) => setNomeCliente(event.target.value)}
                            required
                            pattern=".*\S.*"
                            title="Informe o nome do cliente."
                            className="rounded-sm border-2"
                        />
                    </label>
                </div>
                <div className="my-5 container mx-auto flex justify-between items-center">
                    <h2 className="font-bold">Itens do pedido</h2>
                    <button
                        type="button"
                        onClick={() => setModalAberto(true)}
                        className="hover:cursor-pointer px-4 py-2 bg-blue-200 hover:bg-blue-300 rounded-md transition-colors"
                    >
                        + Adicionar Itens
                    </button>
                </div>
                <div className={`rounded-sm bg-blue-100 w-full h-75 overflow-y-auto p-4 ${itens.length === 0 ? "flex items-center justify-center" : "flex flex-wrap content-start items-start gap-3"}`}>
                    {itens.length === 0 ? (
                        <p>Nenhum Item Adicionado.</p>
                    ) : (
                        itens.map((item) => (
                            <div key={item.id} className="min-w-[180px] flex-1 rounded-sm bg-white p-3">
                                <div className="flex items-start justify-between gap-2">
                                    <p className="font-semibold">{item.nome}</p>
                                    <button
                                        type="button"
                                        onClick={() => setItens((itensAtuais) => itensAtuais.filter(({ id }) => id !== item.id))}
                                        aria-label={`Remover ${item.nome}`}
                                        className="rounded px-2 py-1 text-red-700 hover:bg-red-100"
                                    >
                                        Excluir
                                    </button>
                                </div>
                                <p>{formatarValor(item.valor)}</p>
                            </div>
                        ))
                    )}
                </div>
                <div className="flex mx-auto justify-between items-center">
                    <p>Total do Pedido:</p>
                    <p className="text-3xl text-emerald-600">{formatarValor(total)}</p>
                </div>
                <button
                    type="submit"
                    disabled={itens.length === 0}
                    className="mt-4 rounded-md bg-emerald-600 px-4 py-2 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                    Enviar pedido
                </button>
            </form>
            <dialog
                ref={dialogRef}
                aria-labelledby="titulo-modal-item"
                onClose={() => setModalAberto(false)}
                onClick={(event) => {
                    if (event.target === event.currentTarget) {
                        setModalAberto(false);
                    }
                }}
                className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md border-0 bg-transparent p-0 backdrop:bg-black/50"
            >
                <form onSubmit={adicionarItem} className="rounded-md bg-white p-6 shadow-xl">
                    <h2 id="titulo-modal-item" className="mb-4 text-xl font-bold">Adicionar item</h2>
                    <label htmlFor="nomeItem" className="mb-3 block">
                        Nome do produto
                        <input
                            autoComplete="off"
                            autoFocus
                            id="nomeItem"
                            name="nomeItem"
                            type="text"
                            required
                            pattern=".*\S.*"
                            title="Informe o nome do produto."
                            value={nomeItem}
                            onChange={(event) => setNomeItem(event.target.value)}
                            className="mt-1 block w-full rounded-sm border-2 p-2"
                        />
                    </label>
                    <label htmlFor="valorItem" className="mb-5 block">
                        Valor
                        <input
                            id="valorItem"
                            name="valorItem"
                            type="number"
                            min="0"
                            step="0.01"
                            required
                            value={valorItem}
                            onChange={(event) => setValorItem(event.target.value)}
                            className="mt-1 block w-full rounded-sm border-2 p-2"
                        />
                    </label>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setModalAberto(false)}
                            className="rounded-md border px-4 py-2 hover:bg-gray-100"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-blue-200 px-4 py-2 hover:bg-blue-300"
                        >
                            Adicionar
                        </button>
                    </div>
                </form>
            </dialog>
        </main>
    );
};