import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ReservasPage = () => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [capacidad, setCapacidad] = useState("");
    const [fecha, setFecha] = useState("");
    const [hora, setHora] = useState("");
    const [dia, setDia] = useState("");

    useEffect(() => {
        const fetchReservas = async () => {
            try {
                const response = await fetch("http://localhost:8000/reservas/api/v1/reservas/");
                if (!response.ok) {
                    throw new Error("Error al obtener las reservas");
                }
                const data = await response.json();
                setReservas(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReservas();
    }, []);

    if (loading) return <p>Cargando reservas...</p>;
    if (error) return <p>Error: {error}</p>;

    // Agrupar reservas por salón
    const reservasPorSalon = reservas.reduce((acc, reserva) => {
        const salonId = reserva.salon?.id || reserva.salon;
        const salonNombre = reserva.salon?.nombre || `Salón ${salonId}`;
        const capacidadSalon = reserva.salon_capacidad || 0;



        if (!salonId) return acc;

        if (!acc[salonId]) {
            acc[salonId] = {
                nombre: salonNombre,
                capacidad: capacidadSalon,
                reservas: []
            };
        }
        acc[salonId].reservas.push(reserva);
        return acc;
    }, {});



    // Filtrar salones disponibles según capacidad y fecha
    const salonesDisponibles = Object.entries(reservasPorSalon).filter(([_, salon]) => {
        // Filtrar por capacidad
        const capacidadMinima = capacidad ? parseInt(capacidad, 10) : 0;
        if (capacidadMinima && salon.capacidad < capacidadMinima) {
            return false;
        }

        // Filtrar por fecha y hora
        if (fecha && hora) {
            const tieneConflicto = salon.reservas.some(reserva => {
                const mismaFecha = reserva.fecha === fecha;

                const horaInicio = reserva.hora_inicio.slice(0, 5);
                const horaFin = reserva.hora_fin.slice(0, 5);
                const horaCoincide = horaInicio <= hora && hora < horaFin;

                return mismaFecha && horaCoincide;
            });

            if (tieneConflicto) return false;
        }





        // Filtrar por día y hora combinados
        if (dia !== "" && hora !== "") {
            const tieneReservasCoincidentes = salon.reservas.some(reserva => {
                // Convertir reserva.hora_inicio y reserva.hora_fin a solo HH:mm
                const horaInicio = reserva.hora_inicio.slice(0, 5);
                const horaFin = reserva.hora_fin.slice(0, 5);

                // Condición para día y hora
                const coincideDia = dia !== "" ? reserva.dia_semana == dia : true;
                const coincideHora = hora !== "" ? (horaInicio <= hora && horaFin > hora) : true;

                return coincideDia && coincideHora; // Solo cuenta si cumple ambas condiciones
            });

            if (tieneReservasCoincidentes) return false;
        }

        return true;
    });

    return (
        <div>
            <h2>Reservas de Salones</h2>
            <Link to="/reservas-create">
                <button>Crear Reserva</button>
            </Link>

            {/* Filtros */}
            <div style={{ marginBottom: "20px" }}>
                <label>
                    Capacidad mínima:
                    <input
                        type="number"
                        value={capacidad}
                        onChange={(e) => setCapacidad(e.target.value)}
                        min="1"
                    />
                </label>
                <label style={{ marginLeft: "10px" }}>
                    Fecha:
                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                    />
                </label>
                <label style={{ marginLeft: "30px" }}>
                    Hora:
                    <input
                        type="time"
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                    />

                </label>
                <label style={{ marginLeft: "50px" }}>
                    Día:
                    <select value={dia} onChange={(e) => setDia(e.target.value)}>
                        <option value=""></option>
                        <option value="0">Lunes</option>
                        <option value="1">Martes</option>
                        <option value="2">Miércoles</option>
                        <option value="3">Jueves</option>
                        <option value="4">Viernes</option>
                    </select>
                </label>
            </div>

            {/* Mostrar salones disponibles */}
            {salonesDisponibles.length > 0 ? (
                salonesDisponibles.map(([salonId, { nombre, capacidad, reservas }]) => (
                    <div key={salonId} style={{ marginBottom: "20px" }}>
                        <h3>{nombre} (Capacidad: {capacidad})</h3>
                        <table border="1">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Clase</th>
                                    <th>Fecha Mes/dia</th>
                                    <th>Hora de Inicio</th>
                                    <th>Hora de Fin</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservas.map((reserva) => (
                                    <tr key={reserva.id}>
                                        <td>{reserva.id}</td>
                                        <td>{reserva.clase}</td>
                                        <td>{reserva.fecha}</td>
                                        <td>{reserva.hora_inicio}</td>
                                        <td>{reserva.hora_fin}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))
            ) : (
                <p>No hay salones disponibles con los filtros seleccionados.</p>
            )}
        </div>
    );
};

export default ReservasPage;
