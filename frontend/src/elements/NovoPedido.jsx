export const NovoPedido = () => {
    const itens = [
        {
            nome: "Coquinha Zero",
            valor: "30.00"
        },
        {
            nome: "X-Tudo",
            valor: "400.00"
        }
    ];


    // Sum all values
    const soma = itens.reduce((total, item) => {
        return total + parseFloat(item.valor);
    }, 0);

    const formattedSoma = `R$${soma}`;
    return (
        <main className="flex flex-col w-[75%] h-fit p-3 bg-white rounded-sm my-5">
            <h1 className="font-bold text-xl">Novo Pedido</h1>
            <h3 className="text-gray-400">Preencha com os dados do pedido.</h3>
            <div className="my-5">
                <h2 className="font-bold">Informações do Pedido</h2>
                <div className="flex flex-row gap-5">
                    <label htmlFor="numMesa">
                        Número da Mesa
                        <br />
                        <input name="numMesa" id="numMesa" className="rounded-sm border-2"></input>
                    </label>
                    <label htmlFor="nomCliente">
                        Nome do Cliente <br />
                        <input name="nomCliente" id="nomCliente" className="rounded-sm border-2"></input>
                    </label>
                </div>
                <div className="my-5 container mx-auto flex justify-between items-center">
                    <h2 className="font-bold">Itens do pedido</h2>
                    <button className="hover:cursor-pointer px-4 py-2 bg-blue-200 hover:bg-blue-300 rounded-md transition-colors">+ Adicionar Itens</button>
                </div>
                <div className="rounded-sm bg-blue-100 w-full h-75 flex items-center justify-center">
                    {itens.length === 0 ? (
                        <p className="align-self">Nenhum Item Adicionado.</p>
                    ) : (
                        itens.map((item) => (
                            <div key={item.id} className="w-full h-75 m-3">
                                <p>{item.nome}</p>
                                <p>R${item.valor}</p>
                            </div>
                        ))
                    )}
                </div>
                <div className="flex mx-auto justify-between">
                    <p>Total do Pedido:</p>
                    <p>{formattedSoma}</p>
                </div>
            </div>
        </main>
    )
}