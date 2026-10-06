import { useState } from 'react'
import { Header } from './elements/Header.jsx'
import { NovoPedido } from './elements/NovoPedido.jsx'
import './App.css'

function App() {

  return (
    <>
      <main className="justify-self-center p-[5%] bg-blue-600 w-screen h-screen font-[Blinker]">
        <Header></Header>
        <NovoPedido></NovoPedido>
      </main>
    </>
  )
}

export default App
