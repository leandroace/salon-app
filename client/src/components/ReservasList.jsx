import { useEffect, useState } from "react";

const ReservasList = () => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReservas = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/v1/reservas/");
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

    return (
        <div>
            <h2>Reservas de Salones</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Salón</th>
                        <th>Clase</th>
                        <th>Fecha</th>
                        <th>Hora Inicio</th>
                        <th>Hora Fin</th>
                        <th>Tipo</th>
                    </tr>
                </thead>
                <tbody>
                    {reservas.map((reserva) => (
                        <tr key={reserva.id}>
                            <td>{reserva.id}</td>
                            <td>{reserva.salon}</td>
                            <td>{reserva.clase}</td>
                            <td>{reserva.fecha}</td>
                            <td>{reserva.hora_inicio}</td>
                            <td>{reserva.hora_fin}</td>
                            <td>{reserva.tipo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReservasList;
