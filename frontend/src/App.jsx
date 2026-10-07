import { useRef, useState } from 'react'
import { Header } from './elements/Header.jsx'
import { NovoPedido } from './elements/NovoPedido.jsx'
import { PedidosRecentes } from './elements/PedidosRecentes.jsx'
import './App.css'

function App() {
  const [pedidos, setPedidos] = useState([])
  const proximoPedidoId = useRef(0)

  return (
    <>
      <main className="justify-self-center p-[5%] bg-blue-600 w-screen h-fit font-[Blinker]">
        <Header></Header>
        <div className="flex gap-5">
          <NovoPedido onEnviarPedido={(pedido) => {
            setPedidos((pedidosAtuais) => [
              { ...pedido, id: proximoPedidoId.current++ },
              ...pedidosAtuais,
            ])
          }}></NovoPedido>
          <PedidosRecentes pedidos={pedidos}></PedidosRecentes>
        </div>
      </main>
    </>
  )
}

export default App
