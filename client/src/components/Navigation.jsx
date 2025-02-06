import {Link} from 'react-router-dom'

export function Navigation() {
  return (
    <div>
        <Link to="/reservas">
            <h1>
                Salones App
            </h1>
            
        </Link>
        <Link to="/reservas-create">Crear reserva</Link>
    </div>
  )
}
