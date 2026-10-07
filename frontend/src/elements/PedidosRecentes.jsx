const formatarValor = (valor) =>
    new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(valor);

export const PedidosRecentes = ({ pedidos }) => {
    return (
        <aside className="my-5 h-screen w-[25%] overflow-y-auto rounded-sm bg-white p-3">
            <h1 className="font-bold text-xl">Pedidos Recentes</h1>
            {pedidos.length === 0 ? (
                <p className="mt-4 text-gray-500">Nenhum pedido enviado.</p>
            ) : (
                <ul className="mt-4 space-y-3">
                    {pedidos.map((pedido) => (
                        <li key={pedido.id} className="rounded-md bg-blue-50 p-3">
                            <h2 className="font-bold">{pedido.nomeCliente}</h2>
                            <p className="text-sm text-gray-600">Mesa {pedido.numeroMesa}</p>
                            <ul className="my-2 border-y border-blue-100 py-2">
                                {pedido.itens.map((item, index) => (
                                    <li key={`${pedido.id}-${index}`} className="flex justify-between gap-2 text-sm">
                                        <span>{item.nome}</span>
                                        <span>{formatarValor(item.valor)}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="flex justify-between font-semibold">
                                <span>Total</span>
                                <span>{formatarValor(pedido.total)}</span>
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </aside>
    );
};