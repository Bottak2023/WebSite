'use client';
import { useUser } from '@/context/Context'
import { getSpecificData, writeUserData } from '@/firebase/database'
import { useEffect, useState, useRef  } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/Button'
import Loader from '@/components/Loader'
// import { getCurrencyExchange } from '@/currency';
import Modal from '@/components/Modal'

import { useRouter } from 'next/navigation';



export default function Home() {

  const { user, userDB, setUserProfile, modal, setModal, users, setUsers, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, divisas, setDivisas, item, setItem, exchange, setExchange, } = useUser()
  const router = useRouter()
  const [filter, setFilter] = useState('')
  const [state, setState] = useState({})
  const [temporal, setTemporal] = useState(undefined)
  const refFirst = useRef(null);

  function onChangeFilter(e) {
    setFilter(e.target.value)
  }


  function sortArray(x, y) {
    if (x['translation']['spa']['common'].toLowerCase() < y['translation']['spa']['common'].toLowerCase()) { return -1 }
    if (x['translation']['spa']['common'].toLowerCase() > y['translation']['spa']['common'].toLowerCase()) { return 1 }
    return 0
  }
  function onChangeHandler(e, i) {
    setState({ ...state, [i.code]: { ...state[i.code], [e.target.name]: e.target.value } })
  }
  function manage(i) {
    setItem(i)
    setModal('Disable')
  }
  function save(i) {
    setItem(i)
    setModal('Save')
  }
  function disableConfirm() {
    function callback() {
      getSpecificData('divisas', setDivisas, () => { setModal('') })
    }

    setModal('Guardando...')
    writeUserData(`divisas/${item.code}`, { habilitado: item.habilitado === undefined || item.habilitado === false ? true : false }, setUserSuccess, callback)
    return
  }
  async function saveConfirm() {
    function callback() {
      getSpecificData('divisas', setDivisas, () => { setModal('') })
    }

    setModal('Guardando...')
    await writeUserData(`divisas/${item.code}`, state[item.code], setUserSuccess, callback)
    const obj = { ...state }
    delete obj[item.code]
    setState(obj)
    return
  }
  function round(num) {
    var m = Number((Math.abs(num) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(num);
  }

  const getCurrencyExchange = async (input, output) => {
    const arr = Object.values(divisas).filter(i => i.habilitado !== undefined && i.habilitado === true && i.code !== 'USD').map(i => i.code)
    if (arr.length === 0) {
      return
    }
    const res = await fetch('/api/getExchange', {
      method: 'POST',
      body: JSON.stringify({ divisas: arr }),
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8'
      })
    })
    const data = await res.json()
    console.log(data)

    setExchange(data)
  }

  const prev = () => {
    requestAnimationFrame(() => {
      const scrollLeft = refFirst.current.scrollLeft;
      console.log(scrollLeft)
      const itemWidth = screen.width - 50
      refFirst.current.scrollLeft = scrollLeft - itemWidth;
    });
  };
  const next = () => {
    requestAnimationFrame(() => {
      const scrollLeft = refFirst.current.scrollLeft;
      console.log(scrollLeft)
      const itemWidth = screen.width - 50
      console.log(itemWidth)
      refFirst.current.scrollLeft = scrollLeft + itemWidth;
    });
  };
  useEffect(() => {
    divisas !== undefined && exchange === undefined && getCurrencyExchange()
  }, [divisas]);

  return (
    <main className='h-full w-full'>
      {modal === 'Guardando...' && <Loader> {modal} </Loader>}
      {modal === 'Save' && <Modal funcion={saveConfirm}>Estas por modificar la tasa de cambio de:  {item['currency']}</Modal>}
      {modal === 'Disable' && <Modal funcion={disableConfirm}>Estas por {item.habilitado !== undefined && item.habilitado !== false ? 'DESABILITAR' : 'HABILITAR'} el siguiente item:  {item['currency']}</Modal>}
      <button className='fixed text-[20px] text-gray-500 h-[50px] w-[50px] rounded-full inline-block left-[0px] top-0 bottom-0 my-auto bg-[#00000010] z-20 lg:left-[20px]' onClick={prev}>{'<'}</button>
      <button className='fixed text-[20px] text-gray-500 h-[50px] w-[50px] rounded-full inline-block right-[0px] top-0 bottom-0 my-auto bg-[#00000010] z-20 lg:right-[20px]' onClick={next}>{'>'}</button>

      <div className="w-full   relative h-full overflow-auto shadow-2xl p-5 bg-white min-h-[80vh] scroll-smooth" ref={refFirst}>
        <h3 className='font-medium text-[14px]'>Lista De Cambios</h3>
        <br />
        <input type="text" className='border-b-[1px] text-[14px] outline-none w-[400px]' onChange={onChangeFilter} placeholder='Buscar Divisa' />
        <br />
        <br />
        <table className="w-full overflow-visible min-w-[1500px]  text-[14px] text-left text-gray-500 border-t-4 border-gray-400" style={{ minWidth: '1500px' }}>
          {/* <table className="relative w-full overflow-scroll max-w-[800px] h-[50px]  text-[14px] text-left text-gray-500 border-t-4 border-gray-400"> */}
          <thead className="text-[14px] text-gray-700 uppercase bg-white">
            <tr>
              <th scope="col" className=" px-3 py-3">
                #
              </th>
              <th scope="col" className=" px-3 py-3">
                Pais
              </th>
              <th scope="col" className=" px-3 py-3">
                Code
              </th>
              <th scope="col" className=" px-3 py-3">
                Tasa de <br /> cambio USD
              </th>
              <th scope="col" className="text-center px-3 py-3">
                Compra
              </th>
              <th scope="col" className="text-center px-3 py-3">
                Venta
              </th>
              <th scope="col" className="text-center px-3 py-3">
                Tarifa de Envio<br />
                1 - 1000 USD
              </th>
              <th scope="col" className="text-center px-3 py-3">
                Tarifa de Envio <br />
                1 001 - 10 000 USD
              </th>
              <th scope="col" className="text-center px-3 py-3">
                Tarifa de Envio<br />
                10 001 - 100 000 USD
              </th>
              <th scope="col" className="text-center px-3 py-3">
                Guardar
              </th>
              <th scope="col" className="text-center px-3 py-3">
                Habilitar
              </th>
            </tr>
          </thead>
          <tbody>
            {divisas && divisas !== undefined && Object.values(divisas).map((i, index) => {
              return i.currency !== undefined && i.currency.toLowerCase().includes(filter.toLowerCase()) && <tr className={`text-[14px] border-b hover:bg-gray-100  ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-100'} `} key={index}>
                <td className="px-3 py-4  flex text-gray-900 ">
                  <span className='h-full flex py-2'>{index + 1}</span>
                </td>
                <td className="px-3 py-4 text-gray-900 ">
                  {i['translation']['spa']['common']}
                </td>
                <td className="px-3 py-4 text-gray-900 ">
                  {i.code}/{i.currency}
                </td>
                <td className="w-[150px] px-3 py-4 text-gray-900 ">
                  1 USD = {exchange && exchange !== undefined && exchange[i.code] !== undefined && exchange[i.code]} {exchange && exchange !== undefined && exchange[i.code] !== undefined && `${i.code}`}
                </td>
                <td className="w-32 p-4">
                  <input type="number" name="compra" className='w-[100px] text-center p-2 outline-blue-200 rounded-xl' onChange={(e) => onChangeHandler(e, i)} defaultValue={i['compra'] !== undefined ? i['compra'] : 0} />
                </td>
                <td className="w-32 p-4">
                  <input type="number" name="venta" className='w-[100px] text-center p-2 outline-blue-200 rounded-xl' onChange={(e) => onChangeHandler(e, i)} defaultValue={i['venta'] !== undefined ? i['venta'] : 0} />
                </td>
                <td className="w-32 p-4">
                  <input type="number" name="tarifa 1" className='w-[100px] text-center p-2 outline-blue-200 rounded-xl' onChange={(e) => onChangeHandler(e, i)} defaultValue={i['tarifa 1'] !== undefined ? i['tarifa 1'] : 0} />
                </td>
                <td className="w-32 p-4">
                  <input type="number" name="tarifa 2" className='w-[100px] text-center p-2 outline-blue-200 rounded-xl' onChange={(e) => onChangeHandler(e, i)} defaultValue={i['tarifa 2'] !== undefined ? i['tarifa 2'] : 0} />
                </td>
                <td className="w-32 p-4">
                  <input type="number" name="tarifa 3" className='w-[100px] text-center p-2 outline-blue-200 rounded-xl' onChange={(e) => onChangeHandler(e, i)} defaultValue={i['tarifa 3'] !== undefined ? i['tarifa 3'] : 0} />
                </td>
                <td className="px-3 py-4">
                  {state && state[i.code] !== undefined
                    ? <Button theme={"Success"} click={() => save(i)}>Guardar</Button>
                    : <Button theme={"Disable"} >Disable</Button>
                  }
                </td>
                <td className="px-3 py-4">
                  {i.habilitado !== undefined && i.habilitado !== false
                    ? <Button theme={"Success"} click={() => manage(i, 'Desabilitar')}>Habilitado</Button>
                    : <Button theme={"Danger"} click={() => manage(i, 'Habilitar')}>Desabilitado</Button>
                  }
                </td>
              </tr>
            })
            }
          </tbody>
        </table>
      </div>
    </main>
  )
}




















