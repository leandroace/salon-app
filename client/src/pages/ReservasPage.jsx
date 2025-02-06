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
        const salonId = reserva.salon.id;
        if (!acc[salonId]) {
            acc[salonId] = {
                nombre: reserva.salon.nombre, 
                reservas: []
            };
        }
        acc[salonId].reservas.push(reserva);
        return acc;
    }, {});
  
    return (
        <div>
            <h2>Reservas de Salones</h2>
            <Link to="/reservas-create">
                <button>Crear Reserva</button>
            </Link>

            {/* **Renderizar una tabla por cada salón** */}
            {Object.entries(reservasPorSalon).map(([salonId, salonData]) => (
                <div key={salonId} style={{ marginBottom: "20px" }}>
                    <h3>{salonData.nombre}</h3>
                    <table border="1">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Clase</th>
                                <th>Fecha</th>
                                <th>Hora Inicio</th>
                                <th>Hora Fin</th>
                                <th>Tipo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salonData.reservas.map((reserva) => (
                                <tr key={reserva.id}>
                                    <td>{reserva.id}</td>
                                    <td>{reserva.clase}</td>
                                    <td>{reserva.fecha || `Cada ${reserva.dia_semana}`}</td>
                                    <td>{reserva.hora_inicio}</td>
                                    <td>{reserva.hora_fin}</td>
                                    <td>{reserva.tipo}</td>
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
