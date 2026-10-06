import { useState } from 'react'
import { Header } from './elements/Header.jsx'
import { NovoPedido } from './elements/NovoPedido.jsx'
import { PedidosRecentes } from './elements/PedidosRecentes.jsx'
import './App.css'

function App() {

  return (
    <>
      <main className="justify-self-center p-[5%] bg-blue-600 w-screen h-fit font-[Blinker]">
        <Header></Header>
        <div className="flex gap-5">
          <NovoPedido></NovoPedido>
          <PedidosRecentes></PedidosRecentes>
        </div>
      </main>
    </>
  )
}

export default App
