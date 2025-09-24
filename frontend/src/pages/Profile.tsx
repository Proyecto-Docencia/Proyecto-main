import React, { useEffect, useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Edit,
  Save,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { fetchProfile, saveProfile } from '../utils/api';
import '../css/Profile.css';

// Datos reales de la Universidad San Sebastián
const sedesFacultadesCarreras = {
  "Santiago": {
    "Facultad de Arquitectura, Arte y Diseño": [
      "Arquitectura",
      "Diseño Gráfico",
      "Diseño de Interiores"
    ],
    "Facultad de Ciencias": [
      "Licenciatura en Ciencias Biológicas",
      "Biología Marina",
      "Química y Farmacia"
    ],
    "Facultad de Ciencias de la Rehabilitación y Calidad de Vida": [
      "Kinesiología",
      "Terapia Ocupacional",
      "Fonoaudiología"
    ],
    "Facultad de Ciencias para el Cuidado de la Salud": [
      "Enfermería",
      "Nutrición y Dietética",
      "Tecnología Médica"
    ],
    "Facultad de Derecho y Ciencias Sociales": [
      "Derecho",
      "Trabajo Social",
      "Ciencia Política"
    ],
    "Facultad de Economía, Negocios y Gobierno": [
      "Ingeniería Comercial",
      "Contador Auditor",
      "Administración Pública"
    ],
    "Facultad de Educación": [
      "Educación Parvularia",
      "Pedagogía en Educación Básica",
      "Pedagogía en Educación Diferencial",
      "Pedagogía en Inglés"
    ],
    "Facultad de Ingeniería": [
      "Ingeniería Civil Industrial",
      "Ingeniería Civil Informática",
      "Ingeniería en Informática",
      "Ingeniería Civil en Minas"
    ],
    "Facultad de Medicina": [
      "Medicina"
    ],
    "Facultad de Medicina Veterinaria": [
      "Medicina Veterinaria"
    ],
    "Facultad de Odontología": [
      "Odontología"
    ],
    "Facultad de Psicología y Humanidades": [
      "Psicología",
      "Comunicación Audiovisual",
      "Periodismo"
    ]
  },
  "Concepción": {
    "Facultad de Arquitectura, Arte y Diseño": [
      "Arquitectura",
      "Diseño Gráfico"
    ],
    "Facultad de Ciencias": [
      "Química y Farmacia",
      "Biología Marina"
    ],
    "Facultad de Ciencias de la Rehabilitación y Calidad de Vida": [
      "Kinesiología",
      "Terapia Ocupacional",
      "Fonoaudiología"
    ],
    "Facultad de Ciencias para el Cuidado de la Salud": [
      "Enfermería",
      "Nutrición y Dietética",
      "Tecnología Médica"
    ],
    "Facultad de Derecho y Ciencias Sociales": [
      "Derecho",
      "Trabajo Social"
    ],
    "Facultad de Economía, Negocios y Gobierno": [
      "Ingeniería Comercial",
      "Contador Auditor"
    ],
    "Facultad de Educación": [
      "Educación Parvularia",
      "Pedagogía en Educación Básica",
      "Pedagogía en Educación Diferencial",
      "Pedagogía en Inglés"
    ],
    "Facultad de Ingeniería": [
      "Ingeniería Civil Industrial",
      "Ingeniería Civil Informática",
      "Ingeniería en Informática"
    ],
    "Facultad de Medicina": [
      "Medicina"
    ],
    "Facultad de Medicina Veterinaria": [
      "Medicina Veterinaria"
    ],
    "Facultad de Odontología": [
      "Odontología"
    ],
    "Facultad de Psicología y Humanidades": [
      "Psicología",
      "Comunicación Audiovisual"
    ]
  },
  "Valdivia": {
    "Facultad de Ciencias": [
      "Licenciatura en Ciencias Biológicas",
      "Química y Farmacia"
    ],
    "Facultad de Ciencias de la Rehabilitación y Calidad de Vida": [
      "Kinesiología",
      "Terapia Ocupacional"
    ],
    "Facultad de Ciencias para el Cuidado de la Salud": [
      "Enfermería",
      "Nutrición y Dietética"
    ],
    "Facultad de Derecho y Ciencias Sociales": [
      "Derecho",
      "Trabajo Social"
    ],
    "Facultad de Economía, Negocios y Gobierno": [
      "Ingeniería Comercial",
      "Contador Auditor"
    ],
    "Facultad de Educación": [
      "Educación Parvularia",
      "Pedagogía en Educación Básica",
      "Pedagogía en Educación Diferencial"
    ],
    "Facultad de Ingeniería": [
      "Ingeniería Civil Industrial",
      "Ingeniería en Gestión de Expediciones y Ecoturismo"
    ],
    "Facultad de Medicina Veterinaria": [
      "Medicina Veterinaria"
    ],
    "Facultad de Psicología y Humanidades": [
      "Psicología"
    ]
  },
  "De la Patagonia": {
    "Facultad de Ciencias": [
      "Licenciatura en Ciencias Biológicas"
    ],
    "Facultad de Ciencias para el Cuidado de la Salud": [
      "Enfermería"
    ],
    "Facultad de Derecho y Ciencias Sociales": [
      "Trabajo Social"
    ],
    "Facultad de Educación": [
      "Educación Parvularia",
      "Pedagogía en Educación Básica"
    ],
    "Facultad de Ingeniería": [
      "Ingeniería en Gestión de Expediciones y Ecoturismo"
    ],
    "Facultad de Psicología y Humanidades": [
      "Psicología"
    ]
  }
};
const regionesComunas = {
  "Región de Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
  "Región de Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
  "Región de Antofagasta": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"],
  "Región de Atacama": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"],
  "Región de Coquimbo": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
  "Región de Valparaíso": ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Limache", "Olmué", "Villa Alemana"],
  "Región Metropolitana": ["Santiago", "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"],
  "Región del Libertador General Bernardo O'Higgins": ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"],
  "Región del Maule": ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"],
  "Región de Ñuble": ["Chillán", "Bulnes", "Cobquecura", "Coelemu", "Coihueco", "Chillán Viejo", "El Carmen", "Ninhue", "Ñiquén", "Pemuco", "Pinto", "Portezuelo", "Quillón", "Quirihue", "Ránquil", "San Carlos", "San Fabián", "San Ignacio", "San Nicolás", "Treguaco", "Yungay"],
  "Región del Biobío": ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"],
  "Región de La Araucanía": ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"],
  "Región de Los Ríos": ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"],
  "Región de Los Lagos": ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"],
  "Región Aysén del General Carlos Ibáñez del Campo": ["Coyhaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Cochrane", "O'Higgins", "Tortel", "Chile Chico", "Río Ibáñez"],
  "Región de Magallanes y de la Antártica Chilena": ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"]
};

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const [name, setName] = useState<string>(() => localStorage.getItem('profile_name') || user?.name || 'Usuario USS');
  const [email, setEmail] = useState<string>(() => localStorage.getItem('profile_email') || user?.email || 'usuario@uss.cl');
  const [role] = useState(user?.role || 'Docente USS');
  const [profileImage, setProfileImage] = useState<string | null>(() => localStorage.getItem('profile_image') || null);
  const [telefono, setTelefono] = useState<string>(() => localStorage.getItem('profile_telefono') || '+56 9 8765 4321');
  const [rut, setRut] = useState<string>(() => localStorage.getItem('profile_rut') || '12.345.678-9');
  const [direccion, setDireccion] = useState<string>(() => localStorage.getItem('profile_direccion') || 'Av. Providencia 1234, Providencia');
  const [comuna, setComuna] = useState<string>(() => localStorage.getItem('profile_comuna') || 'Providencia');
  const [region, setRegion] = useState<string>(() => localStorage.getItem('profile_region') || 'Región Metropolitana');
  
  // Estados para información académica
  const [sede, setSede] = useState<string>(() => localStorage.getItem('profile_sede') || 'Santiago');
  const [facultadesSeleccionadas, setFacultadesSeleccionadas] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('profile_facultades');
      return raw ? JSON.parse(raw) : ['Facultad de Ingeniería'];
    } catch {
      return ['Facultad de Ingeniería'];
    }
  });
  const [carrerasSeleccionadas, setCarrerasSeleccionadas] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('profile_carreras');
      return raw ? JSON.parse(raw) : ['Ingeniería Civil Informática'];
    } catch {
      return ['Ingeniería Civil Informática'];
    }
  });
  
  // Obtener las comunas de la región seleccionada
  const comunasDisponibles = regionesComunas[region as keyof typeof regionesComunas] || [];
  
  // Obtener facultades disponibles según la sede
  const facultadesDisponibles = Object.keys(sedesFacultadesCarreras[sede as keyof typeof sedesFacultadesCarreras] || {});
  
  // Obtener carreras disponibles según las facultades seleccionadas
  const carrerasDisponibles = facultadesSeleccionadas.flatMap(facultad => 
    sedesFacultadesCarreras[sede as keyof typeof sedesFacultadesCarreras]?.[facultad as keyof typeof sedesFacultadesCarreras[keyof typeof sedesFacultadesCarreras]] || []
  );
  
  // Manejar cambio de región
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevaRegion = e.target.value;
    setRegion(nuevaRegion);
    // Resetear comuna cuando cambia la región
    setComuna('');
  };

  // Manejar cambio de sede
  const handleSedeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevaSede = e.target.value;
    setSede(nuevaSede);
    // Resetear facultades y carreras cuando cambia la sede
    setFacultadesSeleccionadas([]);
    setCarrerasSeleccionadas([]);
  };

  // Manejar cambio de facultades (checkbox)
  const handleFacultadToggle = (facultad: string) => {
    setFacultadesSeleccionadas(prev => {
      const isSelected = prev.includes(facultad);
      let newSelection;
      
      if (isSelected) {
        newSelection = prev.filter(f => f !== facultad);
      } else {
        newSelection = [...prev, facultad];
      }
      
      // Filtrar carreras que ya no pertenecen a facultades seleccionadas
      const carrerasValidas = carrerasSeleccionadas.filter(carrera => {
        return newSelection.some(fac => {
          const carrerasDeFacultad = sedesFacultadesCarreras[sede as keyof typeof sedesFacultadesCarreras]?.[fac as keyof typeof sedesFacultadesCarreras[keyof typeof sedesFacultadesCarreras]] || [];
          return carrerasDeFacultad.includes(carrera);
        });
      });
      setCarrerasSeleccionadas(carrerasValidas);
      
      return newSelection;
    });
  };

  // Manejar cambio de carreras (checkbox)
  const handleCarreraToggle = (carrera: string) => {
    setCarrerasSeleccionadas(prev => {
      const isSelected = prev.includes(carrera);
      if (isSelected) {
        return prev.filter(c => c !== carrera);
      } else {
        return [...prev, carrera];
      }
    });
  };
  
  // Función para formatear teléfono chileno
  const formatearTelefono = (value: string) => {
    // Remover todos los caracteres no numéricos
    const numeros = value.replace(/\D/g, '');
    
    // Si empieza con 569, mantenerlo
    if (numeros.startsWith('569')) {
      const resto = numeros.slice(3);
      if (resto.length <= 8) {
        return `+56 9 ${resto.replace(/(\d{4})(\d{4})/, '$1 $2').trim()}`;
      }
    }
    // Si empieza con 56, agregar el 9
    else if (numeros.startsWith('56') && numeros.length > 2) {
      const sinPrefijo = numeros.slice(2);
      if (sinPrefijo.length <= 8) {
        return `+56 9 ${sinPrefijo.replace(/(\d{4})(\d{4})/, '$1 $2').trim()}`;
      }
    }
    // Si son solo 8 dígitos, agregar prefijo completo
    else if (numeros.length <= 8) {
      return `+56 9 ${numeros.replace(/(\d{4})(\d{4})/, '$1 $2').trim()}`;
    }
    
    return value;
  };

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatearTelefono(e.target.value);
    setTelefono(formatted);
  };

  // Función para formatear RUT chileno
  const formatearRUT = (value: string) => {
    // Remover todos los caracteres no alfanuméricos
    const cleaned = value.replace(/[^0-9kK]/g, '');
    
    if (cleaned.length === 0) return '';
    
    // Separar el dígito verificador
    const cuerpo = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);
    
    if (cuerpo.length === 0) return cleaned;
    
    // Formatear el cuerpo con puntos
    let formateado = '';
    for (let i = cuerpo.length - 1, j = 0; i >= 0; i--, j++) {
      if (j > 0 && j % 3 === 0) {
        formateado = '.' + formateado;
      }
      formateado = cuerpo[i] + formateado;
    }
    
    // Agregar el dígito verificador con guión
    if (cleaned.length > 1) {
      formateado += '-' + dv.toUpperCase();
    }
    
    return formateado;
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatearRUT(e.target.value);
    setRut(formatted);
  };
  
  // Autosave en localStorage para preservar datos al navegar/recargar
  useEffect(() => { localStorage.setItem('profile_name', name); }, [name]);
  useEffect(() => { localStorage.setItem('profile_email', email); }, [email]);
  useEffect(() => { if (profileImage) { localStorage.setItem('profile_image', profileImage); } }, [profileImage]);
  useEffect(() => { localStorage.setItem('profile_telefono', telefono); }, [telefono]);
  useEffect(() => { localStorage.setItem('profile_rut', rut); }, [rut]);
  useEffect(() => { localStorage.setItem('profile_direccion', direccion); }, [direccion]);
  useEffect(() => { localStorage.setItem('profile_comuna', comuna); }, [comuna]);
  useEffect(() => { localStorage.setItem('profile_region', region); }, [region]);
  useEffect(() => { localStorage.setItem('profile_sede', sede); }, [sede]);
  useEffect(() => { localStorage.setItem('profile_facultades', JSON.stringify(facultadesSeleccionadas)); }, [facultadesSeleccionadas]);
  useEffect(() => { localStorage.setItem('profile_carreras', JSON.stringify(carrerasSeleccionadas)); }, [carrerasSeleccionadas]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // Guardar en backend
    try {
      await saveProfile({
        name,
        email,
        region,
        comuna,
        telefono,
        rut,
        direccion,
        sede,
        facultades: facultadesSeleccionadas,
        carreras: carrerasSeleccionadas,
      });
    } catch (err) {
      console.error('Error guardando perfil', err);
      alert('No se pudo guardar el perfil. Verifica tu conexión o sesión.');
      return;
    }
    setIsEditing(false);
    // Persistir en cache local y sync AuthContext
    localStorage.setItem('profile_name', name);
    localStorage.setItem('profile_email', email);
    if (profileImage) localStorage.setItem('profile_image', profileImage);
    localStorage.setItem('profile_telefono', telefono);
    localStorage.setItem('profile_rut', rut);
    localStorage.setItem('profile_direccion', direccion);
    localStorage.setItem('profile_comuna', comuna);
    localStorage.setItem('profile_region', region);
    localStorage.setItem('profile_sede', sede);
    localStorage.setItem('profile_facultades', JSON.stringify(facultadesSeleccionadas));
    localStorage.setItem('profile_carreras', JSON.stringify(carrerasSeleccionadas));
    updateUser({ name, email });
  };

  // Cargar perfil real desde backend al montar
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchProfile();
        if (!mounted) return;
        if (data?.name) setName(data.name);
        if (data?.email) setEmail(data.email);
        if (data?.telefono) setTelefono(data.telefono);
        if (data?.rut) setRut(data.rut);
        if (data?.direccion) setDireccion(data.direccion);
        if (data?.region) setRegion(data.region);
        if (data?.comuna) setComuna(data.comuna);
        if (data?.sede) setSede(data.sede);
        if (Array.isArray(data?.facultades)) setFacultadesSeleccionadas(data.facultades);
        if (Array.isArray(data?.carreras)) setCarrerasSeleccionadas(data.carreras);
      } catch (e) {
        // Si falla, se mantiene cache local
        console.warn('No se pudo cargar perfil desde backend:', e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar que sea una imagen
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setProfileImage(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Por favor selecciona un archivo de imagen válido (JPG, PNG, etc.)');
      }
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        
        <div className="profile-header">
          <div className="profile-header-main">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Foto de perfil" 
                    className="profile-avatar-image"
                  />
                ) : (
                  <User size={40} />
                )}
              </div>
              {isEditing && (
                <div className="profile-image-upload-header">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="profile-file-input"
                    id="profile-image-input"
                  />
                  <label htmlFor="profile-image-input" className="profile-file-label-header">
                    {profileImage ? 'Cambiar foto' : 'Agregar foto'}
                  </label>
                </div>
              )}
            </div>
            <div className="profile-header-info">
              <h1 className="profile-name">{name}</h1>
              <p className="profile-role">{role}</p>
            </div>
          </div>
          <button 
            className={`profile-edit-btn ${isEditing ? 'editing' : ''}`}
            onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
          >
            {isEditing ? <X size={20} /> : <Edit size={20} />}
            {isEditing ? 'Cancelar' : 'Editar'}
          </button>
        </div>

        <form onSubmit={handleSave} className="profile-form">
          
          <div className="profile-content-grid">
            {/* Columna Izquierda - Información Personal */}
            <div className="profile-section">
              <div className="profile-section-header">
                <h2 className="profile-section-title">
                  <User size={20} />
                  Información Personal
                </h2>
              </div>
              
              <div className="profile-fields">
                <div className="profile-field">
                  <label className="profile-label">Nombre Completo</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="profile-input"
                    />
                  ) : (
                    <div className="profile-value">{name}</div>
                  )}
                </div>

                <div className="profile-field">
                  <label className="profile-label">
                    <Mail size={16} />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="profile-input"
                    />
                  ) : (
                    <div className="profile-value">{email}</div>
                  )}
                </div>

                {/* RUT y Teléfono en la misma línea */}
                <div className="profile-field-row">
                  <div className="profile-field profile-field-half">
                    <label className="profile-label">RUT</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={rut}
                        onChange={handleRutChange}
                        placeholder="12.345.678-9"
                        maxLength={12}
                        className="profile-input"
                      />
                    ) : (
                      <div className="profile-value">{rut}</div>
                    )}
                  </div>

                  <div className="profile-field profile-field-half">
                    <label className="profile-label">
                      <Phone size={16} />
                      Teléfono
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={telefono}
                        onChange={handleTelefonoChange}
                        placeholder="+56 9 1234 5678"
                        className="profile-input"
                      />
                    ) : (
                      <div className="profile-value">{telefono}</div>
                    )}
                  </div>
                </div>

                <div className="profile-field">
                  <label className="profile-label">
                    <MapPin size={16} />
                    Región
                  </label>
                  {isEditing ? (
                    <select
                      value={region}
                      onChange={handleRegionChange}
                      className="profile-select"
                    >
                      <option value="">Selecciona una región</option>
                      {Object.keys(regionesComunas).map((regionNombre) => (
                        <option key={regionNombre} value={regionNombre}>
                          {regionNombre}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="profile-value">{region}</div>
                  )}
                </div>

                <div className="profile-field">
                  <label className="profile-label">Comuna</label>
                  {isEditing ? (
                    <select
                      value={comuna}
                      onChange={(e) => setComuna(e.target.value)}
                      className="profile-select"
                      disabled={!region}
                    >
                      <option value="">Selecciona una comuna</option>
                      {comunasDisponibles.map((comunaNombre) => (
                        <option key={comunaNombre} value={comunaNombre}>
                          {comunaNombre}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="profile-value">{comuna}</div>
                  )}
                </div>

                <div className="profile-field">
                  <label className="profile-label">Dirección</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      placeholder="Av. Providencia 1234"
                      className="profile-input"
                    />
                  ) : (
                    <div className="profile-value">{direccion}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Columna Derecha - Información Académica */}
            <div className="profile-section">
              <div className="profile-section-header">
                <h2 className="profile-section-title">
                  <GraduationCap size={20} />
                  Información Académica
                </h2>
              </div>
              
              <div className="profile-fields">
                <div className="profile-field">
                  <label className="profile-label">Sede</label>
                  {isEditing ? (
                    <select
                      value={sede}
                      onChange={handleSedeChange}
                      className="profile-select"
                    >
                      <option value="">Seleccionar sede</option>
                      {Object.keys(sedesFacultadesCarreras).map((sedeNombre) => (
                        <option key={sedeNombre} value={sedeNombre}>
                          {sedeNombre}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="profile-value">{sede}</div>
                  )}
                </div>

                <div className="profile-field">
                  <label className="profile-label">Facultades</label>
                  {isEditing ? (
                    <div className="checkbox-group" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {facultadesDisponibles.map((facultad) => (
                        <label key={facultad} className="checkbox-item">
                          <input
                            type="checkbox"
                            checked={facultadesSeleccionadas.includes(facultad)}
                            onChange={() => handleFacultadToggle(facultad)}
                            className="checkbox-input"
                          />
                          <span className="checkbox-label">{facultad}</span>
                        </label>
                      ))}
                      {facultadesDisponibles.length === 0 && (
                        <p className="no-options">Selecciona una sede primero</p>
                      )}
                    </div>
                  ) : (
                    <div className="profile-value">
                      {facultadesSeleccionadas.length > 0 ? (
                        <ul className="selected-items-list">
                          {facultadesSeleccionadas.map((facultad, index) => (
                            <li key={index}>{facultad}</li>
                          ))}
                        </ul>
                      ) : (
                        'No hay facultades seleccionadas'
                      )}
                    </div>
                  )}
                </div>

                <div className="profile-field">
                  <label className="profile-label">Carreras que Imparte</label>
                  {isEditing ? (
                    <div className="checkbox-group" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                      {carrerasDisponibles.map((carrera) => (
                        <label key={carrera} className="checkbox-item">
                          <input
                            type="checkbox"
                            checked={carrerasSeleccionadas.includes(carrera)}
                            onChange={() => handleCarreraToggle(carrera)}
                            className="checkbox-input"
                          />
                          <span className="checkbox-label">{carrera}</span>
                        </label>
                      ))}
                      {carrerasDisponibles.length === 0 && (
                        <p className="no-options">
                          {facultadesSeleccionadas.length === 0 
                            ? 'Selecciona al menos una facultad primero' 
                            : 'No hay carreras disponibles para las facultades seleccionadas'
                          }
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="profile-value">
                      {carrerasSeleccionadas.length > 0 ? (
                        <ul className="selected-items-list">
                          {carrerasSeleccionadas.map((carrera, index) => (
                            <li key={index}>{carrera}</li>
                          ))}
                        </ul>
                      ) : (
                        'No hay carreras seleccionadas'
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {isEditing && (
            <div className="profile-actions">
              <button type="submit" className="btn-save">
                <Save size={20} />
                Guardar Cambios
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;