import React from "react"
import SectionTransition from "../../lib/sectionTransition";
import { RadioGroup } from '@headlessui/react'
import Image from 'next/image'
import { currencyFormatter } from '../../utils'
import Spinner from "../../lib/spinner";


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export const cars = [
    {
        name: 'Defender 90', code: 'DEF-90', img: '/90.png', price: 61940
    },
    {
        name: 'Defender 110', code: 'DEF-110', img: '/110.png', price: 64035
    },
    {
        name: 'Defender 130', code: 'DEF-130', img: '/130.png', price: 80280
    }
]

export const configurations = [
    { name: 'Tow Bar', code: 'TOW-BAR', price: 780 },
    { name: 'Electric Diff Lock', code: 'E-DIFF', price: 1120 },
    { name: 'Snorkel', code: 'SNORKEL', price: 687 }
]


const CatalogueSection = ({ show, setSection }) => {



    const [selectedCar, setSelectedCar] = React.useState(cars[0])
    const [selectedConfig, setSelectedConfig] = React.useState([])
    const [loading, setLoading] = React.useState(false)

    const handleConfigChange = (e, conf) => {
        const { checked } = e.target;
        const _selectedConf = [...selectedConfig].filter(c => c.code != conf.code)
        setSelectedConfig(checked ? [..._selectedConf, conf] : _selectedConf)
    }


    const total = React.useMemo(() => {
        let tot = 0;
        if (selectedCar) {
            tot += selectedCar.price
        }
        if (selectedConfig.length) {
            for (let c of selectedConfig) {
                tot += c.price
            }
        }
        return tot

    }, [selectedCar, selectedConfig])


    const confirmSelection = async (e) => {
        e.preventDefault()
        setLoading(true);
        const req = await fetch('/api/reservation-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ car: selectedCar, config: selectedConfig, total })
        })
        if (req.ok) {
            const { client_secret } = await req.json()
            setLoading(false);
            setSection('reservationPayment', { total, car: selectedCar, config: selectedConfig, client_secret })
        }
    }


    const carOptions = React.useMemo(() => {
        return <RadioGroup value={selectedCar} onChange={setSelectedCar}>
            <RadioGroup.Label className="sr-only"> Server size </RadioGroup.Label>
            <div className="space-y-4">
                {cars.map((car) => (
                    <RadioGroup.Option
                        key={car.code}
                        value={car}
                        className={({ checked, active }) =>
                            classNames(
                                active ? 'border-green ring-2 ring-white bg-white' : '',
                                checked ? 'border-transparent ' : 'border-gray-300 ',
                                selectedCar?.code == car.code ? 'bg-white' : 'bg-darkGrey',
                                'relative block cursor-pointer rounded-lg border  px-6 py-4 shadow-sm focus:outline-none sm:flex sm:justify-between'
                            )
                        }
                    >
                        {({ active, checked }) => (
                            <>
                                <span className="flex items-center">

                                    <span className="flex flex-col text-sm">
                                        <RadioGroup.Label as="span" className="font-medium text-lg text-gray-900">
                                            {car.name}
                                        </RadioGroup.Label>
                                        <RadioGroup.Description as="span" className="text-gray-500">

                                        </RadioGroup.Description>
                                    </span>
                                </span>
                                <RadioGroup.Description>
                                    <Image src={car.img} height={100} width={100} alt={car.name} />
                                </RadioGroup.Description>
                                <RadioGroup.Description
                                    as="span"
                                    className="mt-2 flex justify-center text-md sm:mt-0 sm:ml-4 sm:flex-col sm:text-right"
                                >
                                    <span className="font-medium text-gray-900">{currencyFormatter.format(car.price)}</span>
                                </RadioGroup.Description>
                                <span
                                    className={classNames(
                                        active ? 'border' : 'border-2',
                                        checked ? 'border-indigo-500' : 'border-transparent',
                                        'pointer-events-none absolute -inset-px rounded-lg'
                                    )}
                                    aria-hidden="true"
                                />
                            </>
                        )}
                    </RadioGroup.Option>
                ))}
            </div>
        </RadioGroup>
    }, [selectedCar])

    const addOns = React.useMemo(() => {
        return <div className="bg-white bg-transparent-500 z-40 p-5 w-full rounded-lg mb-20"> <fieldset >
            <div className="flex flex-row justify-between">
                <legend className="text-lg font-medium mt-5 text-gray-900 ">{selectedCar.name}</legend>
                <legend className="text-lg font-medium mt-5 text-gray-900 ">Configuration</legend>
            </div>
            <div className="mt-9 divide-y divide-darkGrey border-t border-b border-darkGrey">
                {configurations.map((conf, confID) => (
                    <div key={confID} className="relative flex items-start justify-around py-4">
                        <div className="min-w-0 flex-1  text-sm">
                            <label htmlFor={`conf-${conf.code}`} className="select-none font-medium text-gray-700">
                                {conf.name}
                            </label>
                        </div>
                        <div className="text-md">{currencyFormatter.format(conf.price)}</div>
                        <div className="ml-3 flex h-5 items-center">
                            <input
                                id={`conf-${conf.code}`}
                                name={`conf-${conf.code}`}
                                onChange={(e) => handleConfigChange(e, conf)}
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-green focus:ring-darkGreen"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </fieldset>
            <div className="flex flex-row w-full justify-between align-middle items-center">
                <div className="text-xl font-bold">{currencyFormatter.format(total)}</div>
                <button
                    onClick={confirmSelection}
                    className="flex flex-row justify-around bottom-6 ml-4 mt-2 w-full px-10 rounded-md bg-green py-3 font-medium text-white shadow hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                    Reserve for £99
                    {loading && <Spinner />}

                </button>
            </div>


        </div>
    })

    return (
        <SectionTransition show={show}>
            <div className={`bg-darkGreen pt-10 sm:pt-16 lg:overflow-hidden lg:pt-8 lg:pb-14 h-screen flex items-center `}>
                <div className="mx-auto max-w-7xl lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                        <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:flex lg:items-center lg:px-0 lg:text-left">
                            <div className="lg:py-24">

                                <h1 className="mt-4 text-4xl font-bold color-white text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                                    <span className="block text-white">Reserve a New  </span>
                                    <span className="block text-white bg-clip-text pb-3 sm:pb-5">
                                        Defender
                                    </span>
                                </h1>
                                <p className="text-base text-gray-300 sm:text-xl mb-3 lg:text-lg xl:text-xl">
                                    Select a model and any optional extras
                                </p>
                                {carOptions}
                            </div>
                        </div>
                        <div className="mt-12 -mb-16 sm:-mb-48 lg:relative lg:m-0 flex flex-col">
                            <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
                                <img
                                    className="z-10 w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                                    src="/defender.png"
                                    alt=""
                                />
                            </div>
                            <div className="h-1/2"></div>
                            {addOns}
                        </div>
                    </div>
                </div>
            </div></SectionTransition>)
}

export default CatalogueSection