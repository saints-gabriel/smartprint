export const Header = () => {
  const isConnected = true
    return (
        <header className="bg-white p-4 rounded-sm">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">SmartPrint</h1>

            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md transition-colors">
                Carregar Logs
              </button>
              <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-md transition-colors">
                Testar Logs
              </button>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md transition-colors">
                Conectar impressora
              </button>
              {
                isConnected ? <p className="px-4 py-2 bg-green-100 text-green-500 rounded-md">Impressora Conectada</p>
                : <p className="px-4 py-2 bg-red-100 text-red-500 rounded-md">Impressora Desconectada</p>
              }
            </div>
          </div>
        </header>
    )
};