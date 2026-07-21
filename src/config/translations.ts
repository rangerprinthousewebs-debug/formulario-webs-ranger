export type Language = 'es' | 'en';

export const translations = {
  es: {
    welcomeTitle: 'Queremos conocer tu proyecto',
    welcomeDesc: 'En menos de 2 minutos comprenderemos qué necesitas para prepararte una propuesta 100% personalizada.',
    startBtn: 'Empezar',
    backBtn: 'Atrás',
    nextBtn: 'Siguiente',
    submitBtn: 'Enviar Respuestas',
    submittingBtn: 'Enviando...',
    finishBtn: 'Finalizar',
    stepIndicator: 'Paso {current} de {total}',
    
    // Validaciones
    valMin2Char: 'El nombre debe tener al menos 2 caracteres',
    valDescMore: 'Describe un poco más a qué se dedica tu negocio',
    valSelectOpt: 'Selecciona una opción',
    valMin1Obj: 'Selecciona al menos un objetivo',
    valMin1Sec: 'Selecciona al menos una sección',
    valMin1Medio: 'Selecciona al menos un medio',
    valNameReq: 'Tu nombre es requerido',
    valEmailReq: 'Ingresa un correo electrónico válido',
    valPhoneReq: 'Ingresa un número de WhatsApp válido',
    valCityReq: 'Tu ciudad es requerida',
    valEmailForm: 'Ingresa el correo donde recibirás formularios',
    valWhatsappBiz: 'Ingresa el WhatsApp del negocio',

    // Pasos
    p2_title: '¿Cómo se llama tu empresa o proyecto?',
    p2_placeholder: 'Ej: Sabores Mágicos, Consultora Rueda',
    
    p3_title: '¿A qué se dedica tu empresa?',
    p3_desc: 'Cuéntanos brevemente qué vendes o qué servicio ofreces.',
    p3_placeholder: 'Ej: Venta de ropa deportiva para dama y caballero',
    p3_examplesTitle: 'Ejemplos de respuesta',
    p3_examples: ['Clínica dental', 'Abogado corporativo', 'Cafetería artesanal', 'Estudio de fotografía'],
    
    p4_title: '¿Ya tienes un sitio web actualmente?',
    p4_yes: 'Sí',
    p4_no: 'No',
    p4_subLabel: '¿Cuál es tu dominio actual?',
    p4_subPlaceholder: 'www.tudominio.com',
    
    p5_title: '¿Qué tipo de página web necesitas?',
    p5_options: [
      { id: 'informativa', title: '🌐 Página informativa', desc: 'Presenta tu negocio, servicios y datos de contacto de forma limpia.' },
      { id: 'landing', title: '📅 Landing page', desc: 'Enfocada al 100% en vender un único producto o captar clientes.' },
      { id: 'corporativa', title: '🏢 Sitio corporativo', desc: 'Estructura más robusta, con blog, secciones dedicadas y servicios extensos.' },
      { id: 'no_seguro', title: '🤔 No estoy seguro', desc: 'Cuéntanos tu idea y te asesoramos para elegir la mejor opción.' }
    ],
    
    p6_title: '¿Qué objetivo principal tiene tu página?',
    p6_desc: 'Puedes elegir varias opciones.',
    p6_options: ['Conseguir clientes', 'Mostrar mis servicios', 'Mostrar mi empresa', 'Recibir contactos', 'Otros objetivos'],
    
    p7_title: '¿Qué secciones te gustaría incluir?',
    p7_desc: 'Elige todas las que consideres.',
    p7_options: ['Inicio', 'Nosotros', 'Servicios', 'Productos', 'Galería', 'Blog', 'Preguntas frecuentes', 'Contacto', 'Ubicación', 'Testimonios', 'Portafolio', 'Otra'],
    
    p8_title: '¿Ya tienes un logotipo para tu marca?',
    p8_yes: 'Sí, ya tengo',
    p8_no: 'No, necesito uno',
    
    p9_title: '¿Ya cuentas con fotografías del negocio?',
    p9_yes: 'Sí',
    p9_some: 'Algunas',
    p9_no: 'No',
    
    p10_title: '¿Ya tienes redactados los textos?',
    p10_yes: 'Sí, listos',
    p10_no: 'No, los escribiré',
    p10_help: 'Necesito ayuda',
    
    p11_title: '¿Qué estilo visual prefieres?',
    p11_options: [
      { id: 'minimalista', title: 'Minimalista', desc: 'Simple, espaciado, enfocado al contenido.' },
      { id: 'elegante', title: 'Elegante', desc: 'Colores sofisticados, tipografías clásicas.' },
      { id: 'moderno', title: 'Moderno', desc: 'Degradados, formas suaves, estilo tecnológico.' },
      { id: 'corporativo', title: 'Corporativo', desc: 'Limpio, formal, institucional.' },
      { id: 'creativo', title: 'Creativo', desc: 'Colores atrevidos, dinámico e interactivo.' }
    ],
    
    p12_title: '¿Qué colores identifican tu marca?',
    p12_placeholder: 'Ej: Azul marino y blanco, Tonos tierra, etc.',
    
    p13_title: '¿Hay páginas web que te gusten?',
    p13_desc: 'Pega enlaces de páginas web que te inspiren en estructura o diseño.',
    p13_placeholder: 'Ej: https://stripe.com, https://apple.com',
    
    p14_title: '¿Qué datos de contacto deben aparecer en tu web?',
    p14_desc: 'Elige todos los que apliquen.',
    p14_options: ['WhatsApp', 'Teléfono fijo', 'Correo', 'Instagram', 'Facebook', 'TikTok', 'Ubicación física'],
    
    p17_title: 'Datos de tu negocio para la web',
    p17_desc: 'Esta información aparecerá en tu página web para que tus clientes te contacten.',
    p17_email: 'Email para formularios de la web *',
    p17_whatsapp: 'WhatsApp del negocio *',
    p17_phone: 'Teléfono del negocio',
    p17_address: 'Dirección física',
    p17_socialsTitle: 'Redes sociales (pega el link o tu usuario)',
    
    p18_title: 'Último paso, tus datos de contacto',
    p18_desc: 'Para hacerte llegar la propuesta y resolver dudas.',
    p18_name: 'Tu Nombre',
    p18_email: 'Correo Electrónico',
    p18_whatsapp: 'WhatsApp',
    p18_city: 'Ciudad / País',
    
    p19_title: '¡Excelente! Ya tenemos una idea clara',
    p19_desc: 'Hemos recibido tu información. En las próximas horas te enviaremos una propuesta estructurada a tu correo.',
    
    errSubmit: 'Hubo un error al enviar el formulario. Por favor inténtalo de nuevo.'
  },
  en: {
    welcomeTitle: 'We want to get to know your project',
    welcomeDesc: 'In less than 2 minutes, we will understand your needs and prepare a 100% customized proposal.',
    startBtn: 'Get Started',
    backBtn: 'Back',
    nextBtn: 'Next',
    submitBtn: 'Submit Answers',
    submittingBtn: 'Sending...',
    finishBtn: 'Finish',
    stepIndicator: 'Step {current} of {total}',
    
    // Validations
    valMin2Char: 'Name must be at least 2 characters',
    valDescMore: 'Please describe a bit more what your business does',
    valSelectOpt: 'Please select an option',
    valMin1Obj: 'Please select at least one goal',
    valMin1Sec: 'Please select at least one section',
    valMin1Medio: 'Please select at least one contact method',
    valNameReq: 'Your name is required',
    valEmailReq: 'Please enter a valid email address',
    valPhoneReq: 'Please enter a valid WhatsApp number',
    valCityReq: 'Your city is required',
    valEmailForm: 'Please enter the email to receive website form entries',
    valWhatsappBiz: 'Please enter the business WhatsApp',

    // Steps
    p2_title: 'What is the name of your company or project?',
    p2_placeholder: 'E.g., Magic Flavors, Rueda Consulting',
    
    p3_title: 'What does your company do?',
    p3_desc: 'Briefly tell us what you sell or what service you offer.',
    p3_placeholder: 'E.g., Selling sports apparel for men and women',
    p3_examplesTitle: 'Examples',
    p3_examples: ['Dental clinic', 'Corporate lawyer', 'Artisanal coffee shop', 'Photography studio'],
    
    p4_title: 'Do you currently have a website?',
    p4_yes: 'Yes',
    p4_no: 'No',
    p4_subLabel: 'What is your current domain?',
    p4_subPlaceholder: 'www.yourdomain.com',
    
    p5_title: 'What type of website do you need?',
    p5_options: [
      { id: 'informativa', title: '🌐 Informational website', desc: 'Clean presentation of your business, services, and contact info.' },
      { id: 'landing', title: '📅 Landing page', desc: '100% focused on selling a single product or capturing leads.' },
      { id: 'corporativa', title: '🏢 Corporate site', desc: 'More robust structure with a blog, dedicated pages, and extensive services.' },
      { id: 'no_seguro', title: '🤔 Not sure', desc: 'Tell us your idea and we will advise you on the best option.' }
    ],
    
    p6_title: 'What is the main goal of your website?',
    p6_desc: 'You can choose multiple options.',
    p6_options: ['Get customers', 'Showcase my services', 'Showcase my company', 'Receive contacts', 'Other goals'],
    
    p7_title: 'Which sections would you like to include?',
    p7_desc: 'Select all that apply.',
    p7_options: ['Home', 'About Us', 'Services', 'Products', 'Gallery', 'Blog', 'FAQs', 'Contact', 'Location', 'Testimonials', 'Portfolio', 'Other'],
    
    p8_title: 'Do you already have a logo for your brand?',
    p8_yes: 'Yes, I do',
    p8_no: 'No, I need one',
    
    p9_title: 'Do you already have photos of the business?',
    p9_yes: 'Yes',
    p9_some: 'Some',
    p9_no: 'No',
    
    p10_title: 'Do you already have the written copy/texts?',
    p10_yes: 'Yes, ready',
    p10_no: 'No, I will write them',
    p10_help: 'I need help',
    
    p11_title: 'What visual style do you prefer?',
    p11_options: [
      { id: 'minimalista', title: 'Minimalist', desc: 'Simple, spacious, content-focused.' },
      { id: 'elegante', title: 'Elegant', desc: 'Sophisticated colors, classic typography.' },
      { id: 'moderno', title: 'Modern', desc: 'Gradients, soft shapes, tech/startup look.' },
      { id: 'corporativo', title: 'Corporate', desc: 'Clean, formal, institutional.' },
      { id: 'creativo', title: 'Creative', desc: 'Bold colors, dynamic and interactive.' }
    ],
    
    p12_title: 'What colors identify your brand?',
    p12_placeholder: 'E.g., Navy blue and white, Earth tones, etc.',
    
    p13_title: 'Are there any websites that you like?',
    p13_desc: 'Paste links to websites that inspire you in structure or design.',
    p13_placeholder: 'E.g., https://stripe.com, https://apple.com',
    
    p14_title: 'What contact details should appear on your website?',
    p14_desc: 'Select all that apply.',
    p14_options: ['WhatsApp', 'Landline', 'Email', 'Instagram', 'Facebook', 'TikTok', 'Physical Location'],
    
    p17_title: 'Your Business Info for the Web',
    p17_desc: 'This information will appear on your website so customers can contact you.',
    p17_email: 'Website form receiver email *',
    p17_whatsapp: 'Business WhatsApp *',
    p17_phone: 'Business Phone',
    p17_address: 'Physical address',
    p17_socialsTitle: 'Social media links (paste link or handle)',
    
    p18_title: 'Last step, your contact details',
    p18_desc: 'To send you the proposal and address any questions.',
    p18_name: 'Your Name',
    p18_email: 'Email Address',
    p18_whatsapp: 'WhatsApp',
    p18_city: 'City / Country',
    
    p19_title: 'Excellent! We have a clear idea now',
    p19_desc: 'We have received your information. In the next few hours we will send a structured proposal to your email.',
    
    errSubmit: 'There was an error submitting the form. Please try again.'
  }
};
