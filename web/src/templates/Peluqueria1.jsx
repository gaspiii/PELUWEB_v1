export default function Peluqueria1({ data }) {
  return (
    <div className="template">
      <h1>{data.nombre}</h1>
      <p>{data.descripcion}</p>
      <img src={data.imagenLogo} />
    </div>
  )
}
