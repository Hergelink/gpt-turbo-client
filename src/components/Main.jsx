import React from 'react'
import Chat from './Chat'
import EditorInfo from './EditorInfo'
import Info from './Info'
import TextEditor from  './TextEditor' 
export default function Main() {
  return (
    <main>
      <section id='first'>
        <Info />
        <Chat />
      </section>
      <section id='second'>
        <EditorInfo />
        <TextEditor />
      </section>
    </main>
  )
}
