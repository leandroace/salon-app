import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ReservasPage = () => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    // **Agrupar reservas por salón**
    const reservasPorSalon = reservas.reduce((acc, reserva) => {
        const salonId = reserva.salon?.id || reserva.salon;
        const salonNombre = reserva.salon?.nombre || `Salón ${salonId}`;

        if (!salonId) return acc; // Evita errores si no hay un salón asociado

        if (!acc[salonId]) {
            acc[salonId] = {
                nombre: salonNombre,
                reservas: []
            };
        }
        acc[salonId].reservas.push(reserva);
        return acc;
    }, {});

    // **Días de la semana (para mostrar nombres en lugar de números)**
    const diasSemana = {
        0: "Lunes",
        1: "Martes",
        2: "Miércoles",
        3: "Jueves",
        4: "Viernes",
        5: "Sábado",
        6: "Domingo",
    };

    return (
        <div>
            <h2>Reservas de Salones</h2>
            <Link to="/reservas-create">
                <button>Crear Reserva</button>
            </Link>

            {/* **Renderizar una tabla por cada salón** */}
            {Object.entries(reservasPorSalon).map(([salonId, { nombre, reservas }]) => (
                <div key={salonId} style={{ marginBottom: "20px" }}>
                    <h3>{nombre}</h3>
                    <table border="1">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Clase</th>
                                <th>Fecha / Día</th>
                                <th>Hora de Inicio</th>
                                <th>Hora de Fin</th>
                                <th>Tipo</th>
                                <th>Recurrente</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservas.map((reserva) => (
                                <tr key={reserva.id}>
                                    <td>{reserva.id}</td>
                                    <td>{reserva.clase}</td>
                                    <td>
                                        {reserva.tipo === "único"
                                            ? reserva.fecha
                                            : diasSemana[reserva.dia_semana] || "N/A"}
                                    </td>
                                    <td>{reserva.hora_inicio}</td>
                                    <td>{reserva.hora_fin}</td>
                                    <td>{reserva.tipo}</td>
                                    <td>{reserva.recurrente ? "Sí" : "No"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default ReservasPage;
