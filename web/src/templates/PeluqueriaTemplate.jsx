import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PeluqueriaTemplate({ datosPeluqueria }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState(0);
  
  // Estados para el calendario de reservas
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedService, setSelectedService] = useState('');
  const [bookingForm, setBookingForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Datos por defecto que se reemplazarán con los del usuario
  const peluqueria = {
    nombre: datosPeluqueria?.nombre || "Belleza Moderna Studio",
    slogan: datosPeluqueria?.slogan || "Tu belleza es nuestra pasión",
    descripcion: datosPeluqueria?.descripcion || datosPeluqueria?.descipcion || "Más de 10 años...",
    telefono: datosPeluqueria?.telefono || "+56 9 1234 5678",
    email: datosPeluqueria?.email || "hola@peluqueriamoderna.cl",
    direccion: datosPeluqueria?.direccion || "Av. Principal 123, Santiago, Chile",
    horarios: datosPeluqueria?.horarios || "Lunes a Viernes: 9:00 - 20:00 | Sábados: 10:00 - 18:00",
    whatsapp: datosPeluqueria?.whatsapp || "56912345678",
    salonId: datosPeluqueria?._id || null,
    servicios: datosPeluqueria?.servicios || [
      {
        nombre: "Corte de Cabello",
        precio: "$15.000",
        duracion: "45 min",
        descripcion: "Corte moderno y personalizado según tu estilo"
      },
      {
        nombre: "Tinte Completo",
        precio: "$35.000",
        duracion: "90 min",
        descripcion: "Coloración profesional con productos de calidad"
      },
      {
        nombre: "Mechas Californianas",
        precio: "$28.000",
        duracion: "75 min",
        descripcion: "Efecto sol natural con técnicas avanzadas"
      },
      {
        nombre: "Tratamiento Keratina",
        precio: "$45.000",
        duracion: "120 min",
        descripcion: "Alisado natural que cuida tu cabello"
      }
    ],
    imagenes: datosPeluqueria?.imagenes || [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1e1?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&h=400&fit=crop"
    ],
    equipo: datosPeluqueria?.equipo || [
      {
        nombre: "María González",
        puesto: "Estilista Senior",
        experiencia: "8 años",
        imagen: "https://images.unsplash.com/photo-1551839402-a6d5fb6c67f9?w=300&h=300&fit=crop&crop=face"
      },
      {
        nombre: "Carlos Rodríguez",
        puesto: "Colorista",
        experiencia: "6 años",
        imagen: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
      }
    ]
  };

  // Horarios disponibles (9:00 AM - 8:00 PM)
  const availableTimeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30"
  ];

  // Cargar citas reservadas cuando se selecciona una fecha
  useEffect(() => {
    if (selectedDate && peluqueria.salonId) {
      fetchBookedSlots(selectedDate);
    }
  }, [selectedDate, peluqueria.salonId]);

  const fetchBookedSlots = async (date) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/bookings/salon/${peluqueria.salonId}`);
      const bookingsForDate = response.data.filter(booking => booking.fecha === date);
      setBookedSlots(bookingsForDate.map(b => b.hora));
    } catch (error) {
      console.error("Error cargando horarios:", error);
      setBookedSlots([]);
    }
  };

  // Funciones del calendario
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isDateAvailable = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const handleDateSelect = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (isDateAvailable(date)) {
      setSelectedDate(formatDate(date));
      setSelectedTime(null);
      setSuccessMessage('');
      setErrorMessage('');
    }
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isTimeSlotBooked = (time) => {
    return bookedSlots.includes(time);
  };

  const handleFormChange = (e) => {
    setBookingForm({
      ...bookingForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !selectedService) {
      setErrorMessage('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const bookingData = {
        salonId: peluqueria.salonId,
        nombre: bookingForm.nombre,
        email: bookingForm.email,
        telefono: bookingForm.telefono,
        servicio: selectedService,
        fecha: selectedDate,
        hora: selectedTime,
        mensaje: bookingForm.mensaje
      };

      await axios.post('http://localhost:4000/api/bookings', bookingData);
      
      setSuccessMessage('¡Reserva confirmada! Te contactaremos pronto.');
      
      // Resetear formulario
      setBookingForm({ nombre: '', email: '', telefono: '', mensaje: '' });
      setSelectedDate(null);
      setSelectedTime(null);
      setSelectedService('');
      
      // Scroll al mensaje de éxito
      setTimeout(() => {
        document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (error) {
      console.error('Error creando reserva:', error);
      setErrorMessage(error.response?.data?.error || 'Error al crear la reserva. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const enviarWhatsApp = () => {
    const mensaje = `Hola, me gustaría agendar una cita en ${peluqueria.nombre}`;
    const url = `https://wa.me/${peluqueria.whatsapp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header y Navegación */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{peluqueria.nombre}</h1>
                <p className="text-sm text-emerald-600">{peluqueria.slogan}</p>
              </div>
            </div>

            {/* Navegación Desktop */}
            <nav className="hidden md:flex space-x-8">
              <a href="#inicio" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">Inicio</a>
              <a href="#reservar" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">Reservar</a>
              <a href="#servicios" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">Servicios</a>
              <a href="#galeria" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">Galería</a>
              <a href="#equipo" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">Equipo</a>
              <a href="#contacto" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">Contacto</a>
            </nav>

            {/* Botón Reservar Desktop */}
            <a
              href="#reservar"
              className="hidden md:flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-emerald-500/25 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Reservar Cita</span>
            </a>

            {/* Botón Menú Móvil */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Menú Móvil */}
          {menuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 animate-fadeIn">
              <div className="flex flex-col space-y-4">
                <a href="#inicio" className="text-gray-700 hover:text-emerald-600 font-medium py-2">Inicio</a>
                <a href="#reservar" className="text-gray-700 hover:text-emerald-600 font-medium py-2">Reservar</a>
                <a href="#servicios" className="text-gray-700 hover:text-emerald-600 font-medium py-2">Servicios</a>
                <a href="#galeria" className="text-gray-700 hover:text-emerald-600 font-medium py-2">Galería</a>
                <a href="#equipo" className="text-gray-700 hover:text-emerald-600 font-medium py-2">Equipo</a>
                <a href="#contacto" className="text-gray-700 hover:text-emerald-600 font-medium py-2">Contacto</a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&h=800&fit=crop"
            alt="Peluquería background"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Tu belleza merece lo <span className="text-emerald-400">mejor</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              {peluqueria.descripcion}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#reservar"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-emerald-500/25 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Reservar Ahora</span>
              </a>
              <a
                href="#servicios"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all text-center"
              >
                Ver Servicios
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Reservas con Calendario */}
      <section id="reservar" className="py-20 bg-gradient-to-br from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Reserva tu <span className="text-emerald-600">Cita</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Selecciona la fecha y hora que mejor te convenga
            </p>
          </div>

          {/* Mensajes de éxito/error */}
          {successMessage && (
            <div className="max-w-4xl mx-auto mb-8 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-green-700 font-medium">{successMessage}</p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="max-w-4xl mx-auto mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 font-medium">{errorMessage}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Calendario */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={handlePreviousMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="text-xl font-bold text-gray-900">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Días de la semana */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Días del mes */}
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                  const dateString = formatDate(date);
                  const isAvailable = isDateAvailable(date);
                  const isSelected = selectedDate === dateString;

                  return (
                    <button
                      key={day}
                      onClick={() => handleDateSelect(day)}
                      disabled={!isAvailable}
                      className={`
                        aspect-square rounded-lg font-medium transition-all
                        ${isSelected ? 'bg-emerald-500 text-white shadow-lg scale-110' : ''}
                        ${!isSelected && isAvailable ? 'bg-gray-100 hover:bg-emerald-100 text-gray-900' : ''}
                        ${!isAvailable ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : ''}
                      `}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {/* Horarios disponibles */}
              {selectedDate && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Horarios Disponibles</h4>
                  <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                    {availableTimeSlots.map(time => {
                      const isBooked = isTimeSlotBooked(time);
                      const isSelected = selectedTime === time;

                      return (
                        <button
                          key={time}
                          onClick={() => !isBooked && setSelectedTime(time)}
                          disabled={isBooked}
                          className={`
                            py-2 px-3 rounded-lg font-medium transition-all text-sm
                            ${isSelected ? 'bg-emerald-500 text-white shadow-md' : ''}
                            ${!isSelected && !isBooked ? 'bg-gray-100 hover:bg-emerald-100 text-gray-900' : ''}
                            ${isBooked ? 'bg-gray-50 text-gray-300 cursor-not-allowed line-through' : ''}
                          `}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Formulario de Reserva */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Datos de la Reserva ASTERISCO</h3>
              
              <form onSubmit={handleSubmitBooking} className="space-y-4">
                {/* Servicio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Servicio *
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Selecciona un servicio</option>
                    {peluqueria.servicios.map((servicio, index) => (
                      <option key={index} value={servicio.nombre}>
                        {servicio.nombre} - {servicio.precio} ({servicio.duracion})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={bookingForm.nombre}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Juan Pérez"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={bookingForm.email}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="juan@ejemplo.com"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={bookingForm.telefono}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="+56 9 1234 5678"
                  />
                </div>

                {/* Mensaje */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje (opcional)
                  </label>
                  <textarea
                    name="mensaje"
                    value={bookingForm.mensaje}
                    onChange={handleFormChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Algún comentario adicional..."
                  />
                </div>

                {/* Resumen de la reserva */}
                {selectedDate && selectedTime && selectedService && (
                  <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                    <h4 className="font-semibold text-emerald-900 mb-2">Resumen de tu reserva:</h4>
                    <div className="text-sm text-emerald-800 space-y-1">
                      <p><strong>Servicio:</strong> {selectedService}</p>
                      <p><strong>Fecha:</strong> {new Date(selectedDate).toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <p><strong>Hora:</strong> {selectedTime}</p>
                    </div>
                  </div>
                )}

                {/* Botón de envío */}
                <button
                  type="submit"
                  disabled={loading || !selectedDate || !selectedTime || !selectedService}
                  className={`
                    w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center space-x-2
                    ${loading || !selectedDate || !selectedTime || !selectedService
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-emerald-500 hover:bg-emerald-600 shadow-lg hover:shadow-emerald-500/25 hover:scale-105'
                    }
                  `}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Confirmar Reserva</span>
                    </>
                  )}
                </button>

                {/* Alternativa WhatsApp */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">¿Prefieres reservar por WhatsApp?</p>
                  <button
                    type="button"
                    onClick={enviarWhatsApp}
                    className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893-.001-3.189-1.248-6.189-3.515-8.452"/>
                    </svg>
                    <span>Contactar por WhatsApp</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios y Precios */}
      <section id="servicios" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nuestros <span className="text-emerald-600">Servicios</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ofrecemos una amplia gama de servicios profesionales para realzar tu belleza natural
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {peluqueria.servicios.map((servicio, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden group"
              >
                <div className="h-48 bg-gradient-to-br from-emerald-500 to-emerald-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold">{servicio.nombre}</h3>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-2xl font-bold">{servicio.precio}</span>
                      <span className="text-emerald-200">•</span>
                      <span className="text-emerald-200">{servicio.duracion}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-6">{servicio.descripcion}</p>
                  <a
                    href="#reservar"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Reservar</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galería */}
      <section id="galeria" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nuestra <span className="text-emerald-600">Galería</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubre algunos de nuestros trabajos y el ambiente de nuestra peluquería
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {peluqueria.imagenes.map((imagen, index) => (
              <div
                key={index}
                className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={imagen}
                  alt={`Trabajo ${index + 1}`}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-center">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="font-semibold">Ver más</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section id="equipo" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nuestro <span className="text-emerald-600">Equipo</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Conoce a los profesionales que harán de tu experiencia algo único
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {peluqueria.equipo.map((miembro, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <img
                    src={miembro.imagen}
                    alt={miembro.nombre}
                    className="w-32 h-32 rounded-full object-cover mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-colors"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{miembro.nombre}</h3>
                <p className="text-emerald-600 font-semibold mb-2">{miembro.puesto}</p>
                <p className="text-gray-600 text-sm">Experiencia: {miembro.experiencia}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto y Ubicación */}
      <section id="contacto" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Información de Contacto */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Visítanos <span className="text-emerald-600">Hoy</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Estamos aquí para ayudarte a lucir increíble. Agenda tu cita o visítanos en nuestro local.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Dirección</h3>
                    <p className="text-gray-600">{peluqueria.direccion}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Horarios</h3>
                    <p className="text-gray-600 whitespace-pre-line">{peluqueria.horarios}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Teléfono</h3>
                    <p className="text-gray-600">{peluqueria.telefono}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">{peluqueria.email}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={enviarWhatsApp}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893-.001-3.189-1.248-6.189-3.515-8.452"/>
                  </svg>
                  <span>WhatsApp</span>
                </button>
                <a
                  href={`mailto:${peluqueria.email}`}
                  className="border-2 border-gray-300 text-gray-700 hover:border-emerald-500 hover:text-emerald-600 px-8 py-4 rounded-xl font-semibold transition-colors text-center"
                >
                  Enviar Email
                </a>
              </div>
            </div>

            {/* Mapa */}
            <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
              <div className="h-96 bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p className="text-lg font-semibold">Mapa de Ubicación</p>
                  <p className="text-emerald-100">Integración con Google Maps</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Cómo llegar</h3>
                <p className="text-gray-600 text-sm">
                  Estamos ubicados en el corazón de la ciudad. Fácil acceso en transporte público y estacionamiento disponible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">B</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{peluqueria.nombre}</h3>
                  <p className="text-emerald-400 text-sm">{peluqueria.slogan}</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                {peluqueria.descripcion}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>{peluqueria.telefono}</p>
                <p>{peluqueria.email}</p>
                <p>{peluqueria.direccion}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Horarios</h4>
              <div className="text-sm text-gray-400 whitespace-pre-line">
                {peluqueria.horarios}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Síguenos</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 {peluqueria.nombre}. Todos los derechos reservados. | Creado con Peluweb
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}