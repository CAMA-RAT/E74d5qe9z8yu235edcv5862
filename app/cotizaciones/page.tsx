"use client";

import React, { useState, useEffect } from "react";

export default function CotizacionPage() {
    const [fecha, setFecha] = useState("");
    const [folio, setFolio] = useState("");
    const [mostrarDireccion, setMostrarDireccion] = useState(false);
    
    // Partidas
    const [partidas, setPartidas] = useState([
        { id: 1, desc: "", cant: 1, unit: 0 }
    ]);
    
    // Notas
    const [notas, setNotas] = useState([
        { id: 1, text: "Aplican restricciones, precios sujetos a cambio." },
        { id: 2, text: "Vigencia de la cotización 10 días." }
    ]);
    
    const [tasaIva, setTasaIva] = useState(16);
    const [statusMessage, setStatusMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const hoy = new Date().toISOString().split('T')[0];
        setFecha(hoy);
        setFolio(`${hoy}-#1`);
    }, []);

    const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFecha = e.target.value;
        setFecha(newFecha);
        const correlativo = folio.split('-').pop() || '#1';
        setFolio(`${newFecha}-${correlativo}`);
    };

    const toggleDireccion = () => setMostrarDireccion(!mostrarDireccion);

    const agregarNota = () => {
        const newId = notas.length > 0 ? Math.max(...notas.map(n => n.id)) + 1 : 1;
        setNotas([...notas, { id: newId, text: "" }]);
    };

    const eliminarNota = (id: number) => {
        setNotas(notas.filter(n => n.id !== id));
    };

    const handleNotaChange = (id: number, text: string) => {
        setNotas(notas.map(n => n.id === id ? { ...n, text } : n));
    };

    const agregarPartida = () => {
        const newId = partidas.length > 0 ? Math.max(...partidas.map(p => p.id)) + 1 : 1;
        setPartidas([...partidas, { id: newId, desc: "", cant: 1, unit: 0 }]);
    };

    const eliminarPartida = (id: number) => {
        setPartidas(partidas.filter(p => p.id !== id));
    };

    const handlePartidaChange = (id: number, field: string, value: string | number) => {
        setPartidas(partidas.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const subtotal = partidas.reduce((acc, p) => acc + (p.cant * p.unit), 0);
    const iva = subtotal * (tasaIva / 100);
    const total = subtotal + iva;

    const formatter = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatusMessage(null);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const payload = {
            ...data,
            partidas,
            notas,
            subtotalCalculado: formatter.format(subtotal),
            ivaCalculado: formatter.format(iva),
            totalCalculado: formatter.format(total),
        };

        try {
            // Simulando envío a la API
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log("Datos a enviar:", payload);
            setStatusMessage({ text: "¡Cotización enviada exitosamente a la base de datos!", type: "success" });
        } catch (error) {
            console.error(error);
            setStatusMessage({ text: "Ocurrió un error al enviar.", type: "error" });
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setStatusMessage(null), 5000);
        }
    };

    return (
        <div className="p-4 md:p-8 text-gray-800 font-sans min-h-screen bg-gray-100">
            {/* FontAwesome import */}
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    .no-print { display: none !important; }
                    body { background-color: white !important; }
                    .max-w-5xl { max-width: 100% !important; box-shadow: none !important; margin: 0 !important; border: none !important; padding: 0 !important; }
                    .bg-gray-50, .bg-yellow-50, .bg-blue-50 { background-color: transparent !important; }
                    .shadow-xl, .shadow-sm, .shadow-inner { box-shadow: none !important; border: 1px solid #e5e7eb !important; }
                    input, textarea { border: none !important; background: transparent !important; outline: none !important; resize: none !important; padding: 0 !important; }
                    @page { size: letter; margin: 1.5cm; }
                    html { zoom: 0.9; }
                }
                input[type=number]::-webkit-inner-spin-button, 
                input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
                input[type=number] { -moz-appearance: textfield; }
            `}} />

            <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden print:shadow-none print:rounded-none">
                
                {statusMessage && (
                    <div className={`text-center p-3 text-sm font-semibold text-white transition-all duration-300 ${statusMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {statusMessage.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
                    
                    {/* ENCABEZADO */}
                    <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4 border-gray-200 gap-4">
                        <h1 className="text-3xl md:text-4xl font-black text-slate-800 uppercase tracking-widest text-center md:text-left w-full md:w-auto">Cotización</h1>
                        
                        <div className="flex flex-row md:flex-row items-center justify-between md:justify-end w-full md:w-auto gap-6">
                            <div className="inline-flex flex-col items-start md:items-end">
                                <label htmlFor="fecha" className="text-[10px] font-semibold text-gray-500 uppercase">Fecha</label>
                                <input type="date" id="fecha" name="fecha" value={fecha} onChange={handleFechaChange} className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" />
                            </div>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/ecologo.svg" alt="Ecotermic Logo" className="h-12 w-auto object-contain" />
                        </div>
                    </div>

                    {/* DATOS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="bg-white p-4 md:p-5 rounded-lg border border-gray-100 shadow-sm flex flex-col justify-center">
                            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 border-b pb-1">Datos de Empresa</h2>
                            <h2 className="text-lg font-bold text-slate-800 leading-tight">ECOTERMIC SOLAR S.A. DE C.V.</h2>
                            <p className="text-sm text-gray-600 mt-2"><span className="font-semibold">Domicilio:</span> Bahamas 1388 D</p>
                            <p className="text-sm text-gray-600">09880 CDMX Iztapalapa</p>
                            <div className="text-sm text-gray-600 mt-3 flex flex-col gap-1.5">
                                <span className="flex items-center gap-2"><i className="fab fa-whatsapp text-green-600 w-4"></i> 5550373767</span>
                                <span className="flex items-center gap-2"><i className="fas fa-phone text-slate-500 w-4"></i> 5536527139</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 md:p-5 rounded-lg border border-gray-100 shadow-inner">
                            <div className="flex justify-between items-center mb-3 border-b pb-1">
                                <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Datos de Cliente</h2>
                                <button type="button" onClick={toggleDireccion} className="text-xs text-blue-600 hover:text-blue-800 font-semibold no-print flex items-center gap-1">
                                    <i className="fas fa-map-marker-alt"></i> Mostrar Dirección
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                                <div className="flex flex-col">
                                    <label htmlFor="folio" className="text-[10px] font-semibold text-gray-500 uppercase">Folio</label>
                                    <input type="text" id="folio" name="folio" value={folio} onChange={(e) => setFolio(e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none font-medium bg-white" />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="telefono" className="text-[10px] font-semibold text-gray-500 uppercase">Teléfono</label>
                                    <input type="text" id="telefono" name="telefono" placeholder="Ej. 55 1234 5678" className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none font-medium bg-white" />
                                </div>
                                <div className="flex flex-col col-span-2">
                                    <label htmlFor="nombre" className="text-[10px] font-semibold text-gray-500 uppercase">Nombre / Razón Social</label>
                                    <input type="text" id="nombre" name="nombre" placeholder="Ej. Nombre del Cliente o Empresa" className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none font-medium bg-white" />
                                </div>
                                <div className="flex flex-col col-span-2">
                                    <label htmlFor="correo" className="text-[10px] font-semibold text-gray-500 uppercase">Correo Electrónico</label>
                                    <input type="email" id="correo" name="correo" placeholder="correo@hospital.com" className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none font-medium bg-white" />
                                </div>
                                {mostrarDireccion && (
                                    <div className="flex flex-col col-span-2">
                                        <label htmlFor="direccion" className="text-[10px] font-semibold text-gray-500 uppercase">Dirección</label>
                                        <input type="text" id="direccion" name="direccion" placeholder="Ej. Calle, Número, Colonia, C.P." className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none font-medium bg-white w-full" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* PARTIDAS */}
                    <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-800 text-white text-xs uppercase tracking-wider">
                                    <th className="p-3 w-16 text-center">Partida</th>
                                    <th className="p-3 min-w-[300px]">Descripción</th>
                                    <th className="p-3 w-24 text-center">Cant.</th>
                                    <th className="p-3 w-32 text-right">Unitario ($)</th>
                                    <th className="p-3 w-32 text-right">Total ($)</th>
                                    <th className="p-3 w-10 text-center no-print"></th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-gray-200">
                                {partidas.map((partida, index) => (
                                    <tr key={partida.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-3 text-center font-semibold text-gray-600">{index + 1}</td>
                                        <td className="p-3">
                                            <textarea 
                                                name={`desc_${partida.id}`} 
                                                rows={2} 
                                                placeholder="Descripción de la partida" 
                                                value={partida.desc}
                                                onChange={(e) => handlePartidaChange(partida.id, 'desc', e.target.value)}
                                                className="w-full bg-transparent border-none focus:ring-1 focus:ring-blue-300 rounded p-1 resize-none overflow-hidden" 
                                            />
                                        </td>
                                        <td className="p-3 text-center">
                                            <input 
                                                type="number" 
                                                name={`cant_${partida.id}`} 
                                                value={partida.cant} 
                                                min="1" 
                                                onChange={(e) => handlePartidaChange(partida.id, 'cant', parseFloat(e.target.value) || 0)}
                                                className="w-full text-center border border-gray-300 rounded p-1 focus:ring-blue-500" 
                                            />
                                        </td>
                                        <td className="p-3">
                                            <input 
                                                type="number" 
                                                name={`unit_${partida.id}`} 
                                                value={partida.unit || ""} 
                                                step="0.01" 
                                                onChange={(e) => handlePartidaChange(partida.id, 'unit', parseFloat(e.target.value) || 0)}
                                                className="w-full text-right border border-gray-300 rounded p-1 focus:ring-blue-500" 
                                            />
                                        </td>
                                        <td className="p-3 text-right font-medium text-gray-700">
                                            {formatter.format(partida.cant * partida.unit).replace('$', '')}
                                        </td>
                                        <td className="p-3 text-center no-print">
                                            <button type="button" onClick={() => eliminarPartida(partida.id)} className="text-red-500 hover:text-red-700 p-1"><i className="fas fa-trash-alt"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="p-3 bg-white border-t border-gray-200 no-print flex justify-center">
                            <button type="button" onClick={agregarPartida} className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-2 px-4 py-2 border border-blue-200 rounded-full hover:bg-blue-50 transition-colors">
                                <i className="fas fa-plus-circle"></i> Añadir Nueva Partida
                            </button>
                        </div>
                    </div>

                    {/* TOTALES Y NOTAS */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div className="w-full md:w-1/2 space-y-4 text-sm text-gray-600">
                            <div className="bg-slate-50 p-4 rounded border border-slate-200 relative">
                                <p className="font-bold text-slate-700 mb-1">NOTA:</p>
                                <ul className="list-disc pl-4 space-y-1 mb-3">
                                    {notas.map((nota, index) => (
                                        <li key={nota.id} className="relative group flex items-center">
                                            <input 
                                                type="text" 
                                                name={`nota_${index + 1}`} 
                                                value={nota.text} 
                                                onChange={(e) => handleNotaChange(nota.id, e.target.value)}
                                                className={`bg-transparent border-none w-full focus:ring-1 focus:ring-slate-400 p-0 m-0 outline-none text-gray-700 ${index === 1 ? 'font-semibold' : ''}`} 
                                            />
                                            <button type="button" onClick={() => eliminarNota(nota.id)} className="ml-2 text-red-500 opacity-0 group-hover:opacity-100 no-print transition-opacity"><i className="fas fa-times"></i></button>
                                        </li>
                                    ))}
                                </ul>
                                <button type="button" onClick={agregarNota} className="text-xs font-semibold text-slate-600 hover:text-slate-800 flex items-center gap-1 no-print bg-slate-200 px-2 py-1 rounded transition-colors">
                                    <i className="fas fa-plus"></i> Añadir nota
                                </button>
                            </div>

                            <div className="bg-[#004481] text-white p-4 rounded border border-[#003366]">
                                <p className="font-bold text-white mb-2 border-b border-blue-400 pb-1">Datos Bancarios</p>
                                <p><span className="font-semibold text-blue-200">Banco:</span> BBVA Bancomer</p>
                                <p><span className="font-semibold text-blue-200">Titular:</span> ECOTERMIC SOLAR S.A. DE C.V.</p>
                                <p><span className="font-semibold text-blue-200">RFC:</span> ESO090216HH3</p>
                                <p><span className="font-semibold text-blue-200">Cuenta:</span> 0164964551</p>
                                <p><span className="font-semibold text-blue-200">CLABE Interbancaria:</span> 012180001649645513</p>
                            </div>
                        </div>

                        <div className="w-full md:w-5/12 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="flex justify-between p-3 border-b text-sm">
                                <span className="font-semibold text-gray-600">Subtotal</span>
                                <span className="font-medium text-gray-800">{formatter.format(subtotal)}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 border-b text-sm bg-gray-50">
                                <span className="font-semibold text-gray-600">Tasa IVA (%)</span>
                                <div className="flex items-center">
                                    <input 
                                        type="number" 
                                        value={tasaIva} 
                                        onChange={(e) => setTasaIva(parseFloat(e.target.value) || 0)} 
                                        min="0" max="100" 
                                        className="w-16 text-right border border-gray-300 rounded p-1 bg-white font-medium text-gray-800 focus:ring-slate-500 outline-none" 
                                    />
                                    <span className="ml-1 text-gray-800 font-medium">%</span>
                                </div>
                            </div>
                            <div className="flex justify-between p-3 border-b text-sm">
                                <span className="font-semibold text-gray-600">IVA</span>
                                <span className="font-medium text-gray-800">{formatter.format(iva)}</span>
                            </div>
                            <div className="flex justify-between p-4 border-b bg-slate-800 text-white">
                                <span className="font-bold text-lg">Total Contado</span>
                                <span className="font-bold text-lg">{formatter.format(total)}</span>
                            </div>
                            <div className="flex justify-between p-3 text-sm bg-slate-50">
                                <span className="font-semibold text-slate-700">T. Crédito BBVA (12 meses)</span>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center">
                                        <span className="text-slate-700 mr-1">$</span>
                                        <input type="number" name="tarjeta_credito" defaultValue="2806.81" step="0.01" className="text-right border border-slate-300 rounded p-1 text-slate-800 font-bold w-24 bg-white focus:ring-1 focus:ring-slate-500" />
                                    </div>
                                    <span className="text-xs text-slate-500 mt-1">/ mes</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 space-y-2 md:space-y-0">
                        <div className="flex items-center gap-2">
                            <i className="fas fa-globe"></i> ecotermicsolar.com.mx
                        </div>
                        <div className="flex gap-4">
                            <span><i className="fas fa-phone"></i> 3767 5037 55</span>
                            <span><i className="fas fa-phone"></i> 55 3652 7139</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="fas fa-envelope"></i> ecotermicsolar@gmail.com
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-4 pt-4 border-t no-print">
                        <button type="button" onClick={() => window.print()} className="px-6 py-2 border border-gray-300 rounded text-gray-700 font-medium hover:bg-gray-100 transition-colors flex items-center gap-2">
                            <i className="fas fa-print"></i> Imprimir / PDF
                        </button>
                        <button type="submit" disabled={isSubmitting} className={`px-8 py-3 bg-slate-800 rounded text-white font-bold shadow hover:bg-slate-900 focus:ring-4 focus:ring-slate-300 transition-colors flex items-center gap-2 ${isSubmitting ? 'opacity-70' : ''}`}>
                            {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
                            {isSubmitting ? 'Enviando...' : 'Enviar Cotización API'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}