import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Globe, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import { getCompanyByHostname, type CompanyConfig } from './config/companies';
import { translations, type Language } from './config/translations';

// URL del Webhook de Google Apps Script.
const SUBMIT_URL = 'https://script.google.com/macros/s/AKfycbxJBuidpPP3nfNBMuaRav__StHd9pBpZ2j-3YkB5K_Gh5q2gt3I7WHK4whCO1vzBObp/exec'; 

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [company, setCompany] = useState<CompanyConfig | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  
  // Idioma activo
  const [lang, setLang] = useState<Language>('es');

  // Cargar configuración de la empresa según el dominio al montar
  useEffect(() => {
    const activeCompany = getCompanyByHostname(window.location.hostname);
    setCompany(activeCompany);
    // Aplicar color primario dinámicamente al CSS
    document.documentElement.style.setProperty('--primary', activeCompany.primaryColor);

    // Auto-detectar idioma del navegador
    const navLang = navigator.language || (navigator as any).userLanguage;
    if (navLang && navLang.startsWith('en')) {
      setLang('en');
    }
  }, []);

  const t = translations[lang];

  // Esquema de Zod generado dinámicamente según el idioma seleccionado
  const formSchema = z.object({
    nombreEmpresaCliente: z.string().min(2, t.valMin2Char),
    actividad: z.string().min(5, t.valDescMore),
    tieneSitioWeb: z.enum(['si', 'no']),
    sitioWebActual: z.string().optional(),
    tipoPagina: z.string().min(1, t.valSelectOpt),
    objetivos: z.array(z.string()).min(1, t.valMin1Obj),
    secciones: z.array(z.string()).min(1, t.valMin1Sec),
    tieneLogo: z.string().min(1, t.valSelectOpt),
    tieneFotos: z.string().min(1, t.valSelectOpt),
    tieneTextos: z.string().min(1, t.valSelectOpt),
    estiloVisual: z.string().min(1, t.valSelectOpt),
    colores: z.string().min(2, t.valMin2Char),
    referencias: z.string().optional(),
    mediosContacto: z.array(z.string()).min(1, t.valMin1Medio),
    presupuesto: z.string().optional(), 
    inicio: z.string().optional(), 
    // Datos del negocio para la web
    emailNegocio: z.string().email(t.valEmailForm),
    whatsappNegocio: z.string().min(8, t.valWhatsappBiz),
    telefonoNegocio: z.string().optional(),
    direccionNegocio: z.string().optional(),
    instagramUrl: z.string().optional(),
    facebookUrl: z.string().optional(),
    tiktokUrl: z.string().optional(),
    otraRedSocial: z.string().optional(),
    // Datos personales
    nombre: z.string().min(3, t.valNameReq),
    correo: z.string().email(t.valEmailReq),
    whatsapp: z.string().min(8, t.valPhoneReq),
    ciudad: z.string().min(2, t.valCityReq)
  });

  type FormData = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      objetivos: [],
      secciones: [],
      mediosContacto: [],
      tieneSitioWeb: 'no',
      sitioWebActual: ''
    }
  });

  const watchTieneSitioWeb = watch('tieneSitioWeb');

  const totalSteps = 19; // 1 (Intro) + 15 preguntas visibles + 2 ocultos + 1 (Gracias)
  const visibleSteps = 15; // Pasos visibles de preguntas (17 - 2 ocultos)

  // Validación de pasos individuales antes de continuar
  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    
    switch (currentStep) {
      case 2: fieldsToValidate = ['nombreEmpresaCliente']; break;
      case 3: fieldsToValidate = ['actividad']; break;
      case 4: 
        fieldsToValidate = watchTieneSitioWeb === 'si' ? ['tieneSitioWeb', 'sitioWebActual'] : ['tieneSitioWeb']; 
        break;
      case 5: fieldsToValidate = ['tipoPagina']; break;
      case 6: fieldsToValidate = ['objetivos']; break;
      case 7: fieldsToValidate = ['secciones']; break;
      case 8: fieldsToValidate = ['tieneLogo']; break;
      case 9: fieldsToValidate = ['tieneFotos']; break;
      case 10: fieldsToValidate = ['tieneTextos']; break;
      case 11: fieldsToValidate = ['estiloVisual']; break;
      case 12: fieldsToValidate = ['colores']; break;
      case 13: fieldsToValidate = ['referencias']; break;
      case 14: fieldsToValidate = ['mediosContacto']; break;
      // case 15 y 16 están ocultos por ahora
      case 17: fieldsToValidate = ['emailNegocio', 'whatsappNegocio']; break;
      case 18: fieldsToValidate = ['nombre', 'correo', 'whatsapp', 'ciudad']; break;
      default: break;
    }

    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate as any);
      if (!isValid) return;
    }

    if (currentStep < totalSteps) {
      // Saltar pasos 15 y 16 (ocultos)
      const next = currentStep === 14 ? 17 : currentStep + 1;
      setCurrentStep(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      // Saltar pasos 15 y 16 (ocultos) al retroceder
      const prev = currentStep === 17 ? 14 : currentStep - 1;
      setCurrentStep(prev);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    // Serializar arrays como texto separado por comas para Google Sheets
    const redesSociales = [
      data.instagramUrl ? `IG: ${data.instagramUrl}` : '',
      data.facebookUrl ? `FB: ${data.facebookUrl}` : '',
      data.tiktokUrl ? `TT: ${data.tiktokUrl}` : '',
      data.otraRedSocial ? `Otra: ${data.otraRedSocial}` : ''
    ].filter(Boolean).join(' | ');

    const payload: Record<string, string> = {
      empresa: company?.name || 'Desconocida',
      nombre: data.nombre,
      correo: data.correo,
      whatsapp: data.whatsapp,
      ciudad: data.ciudad,
      nombreEmpresaCliente: data.nombreEmpresaCliente,
      actividad: data.actividad,
      sitioWebActual: data.tieneSitioWeb === 'si' ? (data.sitioWebActual || 'Sí (no especificó URL)') : 'No tiene',
      tipoPagina: data.tipoPagina,
      objetivos: data.objetivos.join(', '),
      secciones: data.secciones.join(', '),
      tieneLogo: data.tieneLogo === 'si' ? 'Sí' : 'No',
      tieneFotos: data.tieneFotos === 'si' ? 'Sí' : data.tieneFotos === 'algunas' ? 'Algunas' : 'No',
      tieneTextos: data.tieneTextos === 'si' ? 'Sí' : data.tieneTextos === 'ayuda' ? 'Necesita ayuda' : 'No',
      estiloVisual: data.estiloVisual,
      colores: data.colores,
      referencias: data.referencias || 'No proporcionó',
      mediosContacto: data.mediosContacto.join(', '),
      presupuesto: data.presupuesto || '',
      inicio: data.inicio || '',
      emailNegocio: data.emailNegocio,
      whatsappNegocio: data.whatsappNegocio,
      telefonoNegocio: data.telefonoNegocio || '',
      direccionNegocio: data.direccionNegocio || '',
      redesSociales: redesSociales || 'No proporcionó'
    };

    try {
      // Enviar mediante formulario oculto + iframe (método más confiable para Google Apps Script)
      const iframe = document.createElement('iframe');
      iframe.name = 'hidden-form-target';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = SUBMIT_URL;
      form.target = 'hidden-form-target';

      for (const [key, value] of Object.entries(payload)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();

      // Limpiar después de enviar
      setTimeout(() => {
        document.body.removeChild(form);
        document.body.removeChild(iframe);
      }, 2000);

      setCurrentStep(19);
    } catch (error) {
      console.error('Error al enviar:', error);
      setSubmitError(t.errSubmit);
    } finally {
      setIsSubmitting(false);
    }
  };



  if (!company) {
    return (
      <div className="min-height-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const primaryBg = { backgroundColor: `${company.primaryColor}15` }; // 15% opacidad
  const primaryBorder = { borderColor: company.primaryColor };
  const primaryText = { color: company.primaryColor };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between py-3 sm:py-12 px-3 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Cabecera dinámica de la empresa con Selector de Idioma */}
      <header className="max-w-2xl mx-auto w-full flex items-center justify-between mb-4 sm:mb-8">
        <div className="flex items-center gap-3">
          {/* Ocultamos el logo en el paso 1 porque se mostrará gigante y centrado */}
          {company.logoUrl && currentStep > 1 ? (
            <div className="flex items-center justify-center">
              <img src={company.logoUrl} alt={company.name} className="h-8 object-contain" />
            </div>
          ) : currentStep > 1 ? (
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-800">
              <Sparkles className="h-6 w-6" style={primaryText} />
              <span>{company.name}</span>
            </div>
          ) : <div />}
        </div>

        {/* Switch de Idiomas de alta calidad */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLang('es')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              lang === 'es' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            ES
          </button>
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              lang === 'en' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            EN
          </button>
        </div>
      </header>

      {/* Contenedor principal con animaciones */}
      <main className="max-w-2xl mx-auto w-full bg-white rounded-2xl border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.04)] p-4 sm:p-10 flex flex-col justify-center min-h-[320px] sm:min-h-[500px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <AnimatePresence mode="wait">
            
            {/* PANTALLA 1: Introducción */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-6 py-6"
              >
                {/* Logo gigante centrado sobre el título */}
                {company.logoUrl ? (
                  <div className="mx-auto flex items-center justify-center mb-6">
                    <img src={company.logoUrl} alt={company.name} className="h-16 md:h-20 max-w-[280px] md:max-w-[340px] object-contain" />
                  </div>
                ) : (
                  <div className="mx-auto w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-2" style={primaryBg}>
                    <Globe className="h-8 w-8" style={primaryText} />
                  </div>
                )}
                
                <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
                  {t.welcomeTitle}
                </h1>
                <p className="text-lg text-slate-500 max-w-md mx-auto">
                  {t.welcomeDesc}
                </p>
                <div className="pt-6">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-white font-medium bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/10 gap-2 text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 animate-pulse hover:animate-none"
                    style={{ backgroundColor: company.primaryColor }}
                  >
                    {t.startBtn}
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* PANTALLA 2: Nombre Empresa */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <label className="block text-2xl font-bold text-slate-900 tracking-tight">
                  {t.p2_title}
                </label>
                <input
                  type="text"
                  placeholder={t.p2_placeholder}
                  {...register('nombreEmpresaCliente')}
                  className={`w-full px-5 py-4 border rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all ${
                    errors.nombreEmpresaCliente ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-blue-500'
                  }`}
                  style={!errors.nombreEmpresaCliente ? { '--tw-ring-color': company.primaryColor } as any : {}}
                  autoFocus
                />
                {errors.nombreEmpresaCliente && (
                  <p className="text-red-500 text-sm font-medium">{errors.nombreEmpresaCliente.message}</p>
                )}
              </motion.div>
            )}

            {/* PANTALLA 3: Actividad */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <label className="block text-2xl font-bold text-slate-900 tracking-tight">
                  {t.p3_title}
                </label>
                <p className="text-slate-500 text-sm">
                  {t.p3_desc}
                </p>
                <textarea
                  rows={3}
                  placeholder={t.p3_placeholder}
                  {...register('actividad')}
                  className={`w-full px-5 py-4 border rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all resize-none ${
                    errors.actividad ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-blue-500'
                  }`}
                  style={!errors.actividad ? { '--tw-ring-color': company.primaryColor } as any : {}}
                  autoFocus
                />
                {errors.actividad && (
                  <p className="text-red-500 text-sm font-medium">{errors.actividad.message}</p>
                )}
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">{t.p3_examplesTitle}</span>
                  <div className="flex flex-wrap gap-2">
                    {t.p3_examples.map((ej, i) => (
                      <span key={i} className="text-xs bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600">
                        {ej}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* PANTALLA 4: Sitio Web Actual */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <label className="block text-2xl font-bold text-slate-900 tracking-tight">
                  {t.p4_title}
                </label>
                
                <Controller
                  name="tieneSitioWeb"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { val: 'si', label: t.p4_yes },
                        { val: 'no', label: t.p4_no }
                      ].map((opt) => {
                        const isSelected = field.value === opt.val;
                        return (
                          <button
                            key={opt.val}
                            type="button"
                            onClick={() => field.onChange(opt.val)}
                            className={`p-5 rounded-xl border text-center font-semibold text-lg transition-card ${
                              isSelected 
                                ? 'bg-blue-50/50 border-blue-500 text-blue-700' 
                                : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:scale-[1.02]'
                            }`}
                            style={isSelected ? { ...primaryBg, ...primaryBorder, ...primaryText } : {}}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />

                {watchTieneSitioWeb === 'si' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3 pt-3"
                  >
                    <label className="block text-sm font-semibold text-slate-700">
                      {t.p4_subLabel}
                    </label>
                    <input
                      type="text"
                      placeholder={t.p4_subPlaceholder}
                      {...register('sitioWebActual')}
                      className="w-full px-5 py-4 border border-slate-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-blue-500"
                      style={{ '--tw-ring-color': company.primaryColor } as any}
                    />
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* PANTALLA 5: Tipo de Página */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <label className="block text-2xl font-bold text-slate-900 tracking-tight">
                  {t.p5_title}
                </label>
                
                <Controller
                  name="tipoPagina"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {t.p5_options.map((item) => {
                        const isSelected = field.value === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => field.onChange(item.id)}
                            className={`p-5 rounded-xl border text-left transition-card ${
                              isSelected 
                                ? 'bg-blue-50/50 border-blue-500' 
                                : 'border-slate-200 hover:border-slate-300 hover:scale-[1.02]'
                            }`}
                            style={isSelected ? { ...primaryBg, ...primaryBorder } : {}}
                          >
                            <h3 className={`font-semibold text-lg ${isSelected ? 'text-blue-700' : 'text-slate-900'}`} style={isSelected ? primaryText : {}}>
                              {item.title}
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
                {errors.tipoPagina && (
                  <p className="text-red-500 text-sm font-medium">{errors.tipoPagina.message}</p>
                )}
              </motion.div>
            )}

            {/* PANTALLA 6: Objetivo */}
            {currentStep === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <label className="block text-2xl font-bold text-slate-900 tracking-tight">
                  {t.p6_title}
                </label>
                <p className="text-slate-500 text-sm">{t.p6_desc}</p>
                
                <Controller
                  name="objetivos"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {t.p6_options.map((obj) => {
                        const isSelected = field.value?.includes(obj);
                        return (
                          <button
                            key={obj}
                            type="button"
                            onClick={() => {
                              const nextVal = isSelected
                                ? field.value.filter(v => v !== obj)
                                : [...(field.value || []), obj];
                              field.onChange(nextVal);
                            }}
                            className={`p-4 rounded-xl border text-left font-medium flex items-center justify-between transition-card ${
                              isSelected 
                                ? 'bg-blue-50/50 border-blue-500 text-blue-700' 
                                : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:scale-[1.02]'
                            }`}
                            style={isSelected ? { ...primaryBg, ...primaryBorder, ...primaryText } : {}}
                          >
                            <span>{obj}</span>
                            {isSelected && <Check className="h-5 w-5" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
                {errors.objetivos && (
                  <p className="text-red-500 text-sm font-medium">{errors.objetivos.message}</p>
                )}
              </motion.div>
            )}

            {/* PANTALLA 7: Secciones */}
            {currentStep === 7 && (
              <motion.div
                key="step7"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <label className="block text-2xl font-bold text-slate-900 tracking-tight">
                  {t.p7_title}
                </label>
                <p className="text-slate-500 text-sm">{t.p7_desc}</p>

                <Controller
                  name="secciones"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {t.p7_options.map((sec) => {
                        const isSelected = field.value?.includes(sec);
                        return (
                          <button
                            key={sec}
                            type="button"
                            onClick={() => {
                              const nextVal = isSelected
                                ? field.value.filter(v => v !== sec)
                                : [...(field.value || []), sec];
                              field.onChange(nextVal);
                            }}
                            className={`p-3.5 rounded-xl border text-center text-sm font-medium transition-card ${
                              isSelected 
                                ? 'bg-blue-50/50 border-blue-500 text-blue-700' 
                                : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:scale-[1.02]'
                            }`}
                            style={isSelected ? { ...primaryBg, ...primaryBorder, ...primaryText } : {}}
                          >
                            {sec}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
                {errors.secciones && (
                  <p className="text-red-500 text-sm font-medium">{errors.secciones.message}</p>
                )}
              </motion.div>
            )}

            {/* PANTALLA 8: Logo */}
            {currentStep === 8 && (
              <motion.div
                key="step8"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <label className="block text-2xl font-bold text-slate-900 tracking-tight">
                  {t.p8_title}
                </label>
                
                <Controller
                  name="tieneLogo"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { val: 'si', label: t.p8_yes },
                        { val: 'no', label: t.p8_no }
                      ].map((opt) => {
                        const isSelected = field.value === opt.val;
                        return (
                          <button
                            key={opt.val}
                            type="button"
                            onClick={() => field.onChange(opt.val)}
                            className={`p-6 rounded-xl border text-center font-semibold text-lg transition-card ${
                              isSelected 
                                ? 'bg-blue-50/50 border-blue-500 text-blue-700' 
                                : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:scale-[1.02]'
                            }`}
                            style={isSelected ? { ...primaryBg, ...primaryBorder, ...primaryText } : {}}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
                {errors.tieneLogo && (
                  <p className="text-red-500 text-sm font-medium">{errors.tieneLogo.message}</p>
                )}
              </motion.div>
            )}

            {/* PANTALLA 9: Fotografías */}
            {currentStep === 9 && (
              <motion.div
                key="step9"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <label className="block text-2xl font-bold text-slate-900 tracking-tight">
                  {t.p9_title}
                </label>
                
                <Controller
                  name="tieneFotos"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { val: 'si', label: t.p9_yes },
                        { val: 'algunas', label: t.p9_some },
                        { val: 'no', label: t.p9_no }
                      ].map((opt) => {
                        const isSelected = field.value === opt.val;
                        return (
                          <button
                            key={opt.val}
                            type="button"
                            onClick={() => field.onChange(opt.val)}
                            className={`p-5 rounded-xl border text-center font-semibold transition-card ${
                              isSelected 
                                ? 'bg-blue-50/50 border-blue-500 text-blue-700' 
                                : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:scale-[1.02]'
                            }`}
                            style={isSelected ? { ...primaryBg, ...primaryBorder, ...primaryText } : {}}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
                {errors.tieneFotos && (
                  <p className="text-red-500 text-sm font-medium">{errors.tieneFotos.message}</p>
                )}
              </motion.div>
            )}

            {/* PANTALLA 10: Textos */}
            {currentStep === 10 && (
              <motion.div
                key="step10"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <label className="block text-2xl font-bold text-slate-900 tracking-tight">
                  {t.p10_title}
                </label>
                
                <Controller
                  name="tieneTextos"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { val: 'si', label: t.p10_yes },
                        { val: 'no', label: t.p10_no },
                        { val: 'ayuda', label: t.p10_help }
                      ].map((opt) => {
                        const isSelected = field.value === opt.val;
                        return (
                          <button
                            key={opt.val}
                            type="button"
                            onClick={() => field.onChange(opt.val)}
                            className={`p-5 rounded-xl border text-center font-semibold transition-card ${
                              isSelected 
                                ? 'bg-blue-50/50 border-blue-500 text-blue-700' 
                                : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:scale-[1.02]'
                            }`}
                            style={isSelected ? { ...primaryBg, ...primaryBorder, ...primaryText } : {}}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
                {errors.tieneTextos && (
                  <p className="text-red-500 text-sm font-medium">{errors.tieneTextos.message}</p>
                )}
              </motion.div>
            )}

            {/* PANTALLA 11: Estilo Visual */}
            {currentStep === 11 && (
              <motion.div
                key="step11"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <label className="block text-2xl font-bold text-slate-900 tracking-tight">
                  {t.p11_title}
                </label>
                
                <Controller
                  name="estiloVisual"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {t.p11_options.map((style) => {
                        const isSelected = field.value === style.id;
                        const defaultImages: Record<string, string> = {
                          minimalista: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=400&q=80',
                          elegante: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80',
                          moderno: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=400&q=80',
                          corporativo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
                          creativo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80'
                        };
                        return (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => field.onChange(style.id)}
                            className={`flex flex-col text-left overflow-hidden rounded-xl border transition-card ${
                              isSelected 
                                ? 'border-blue-500 shadow-[0_4px_12px_rgba(37,99,235,0.08)] bg-blue-50/10' 
                                : 'border-slate-200 hover:border-slate-300 hover:scale-[1.01]'
                            }`}
                          >
                            <img src={defaultImages[style.id]} alt={style.title} className="h-28 w-full object-cover" />
                            <div className="p-3.5 space-y-1">
                              <h4 className="font-bold text-slate-800 text-sm flex items-center justify-between">
                                {style.title}
                                {isSelected && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: company.primaryColor }}></span>}
                              </h4>
                              <p className="text-xs text-slate-500 leading-relaxed">{style.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
                {errors.estiloVisual && (
                  <p className="text-red-500 text-sm font-medium">{errors.estiloVisual.message}</p>
                )}
              </motion.div>
            )}

            {/* PANTALLA 12: Colores */}
            {currentStep === 12 && (
              <motion.div
                key="step12"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <label className="block text-2xl font-bold text-slate-900 tracking-tight">
                  {t.p12_title}
                </label>
                <input
                  type="text"
                  placeholder={t.p12_placeholder}
                  {...register('colores')}
                  className={`w-full px-5 py-4 border rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all ${
                    errors.colores ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-blue-500'
                  }`}
                  style={!errors.colores ? { '--tw-ring-color': company.primaryColor } as any : {}}
                  autoFocus
                />
                {errors.colores && (
                  <p className="text-red-500 text-sm font-medium">{errors.colores.message}</p>
                )}
              </motion.div>
            )}

            {/* PANTALLA 13: Páginas de Referencia */}
            {currentStep === 13 && (
              <motion.div
                key="step13"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <label className="block text-2xl font-bold text-slate-900 tracking-tight">
                  {t.p13_title}
                </label>
                <p className="text-slate-500 text-sm font-medium">
                  {t.p13_desc}
                </p>
                <textarea
                  rows={3}
                  placeholder={t.p13_placeholder}
                  {...register('referencias')}
                  className="w-full px-5 py-4 border border-slate-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-blue-500 resize-none"
                  style={{ '--tw-ring-color': company.primaryColor } as any}
                  autoFocus
                />
              </motion.div>
            )}

            {/* PANTALLA 14: Información de Contacto */}
            {currentStep === 14 && (
              <motion.div
                key="step14"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <label className="block text-2xl font-bold text-slate-900 tracking-tight">
                  {t.p14_title}
                </label>
                <p className="text-slate-500 text-sm">{t.p14_desc}</p>

                <Controller
                  name="mediosContacto"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {t.p14_options.map((item) => {
                        const isSelected = field.value?.includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              const nextVal = isSelected
                                ? field.value.filter(v => v !== item)
                                : [...(field.value || []), item];
                              field.onChange(nextVal);
                            }}
                            className={`p-4 rounded-xl border text-center font-medium transition-card ${
                              isSelected 
                                ? 'bg-blue-50/50 border-blue-500 text-blue-700' 
                                : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:scale-[1.02]'
                            }`}
                            style={isSelected ? { ...primaryBg, ...primaryBorder, ...primaryText } : {}}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
                {errors.mediosContacto && (
                  <p className="text-red-500 text-sm font-medium">{errors.mediosContacto.message}</p>
                )}
              </motion.div>
            )}

            {/* PANTALLA 17: Datos del negocio para la web */}
            {currentStep === 17 && (
              <motion.div
                key="step17"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
                    {t.p17_title}
                  </h3>
                  <p className="text-slate-500 text-sm">
                    {t.p17_desc}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{t.p17_email}</label>
                    <input
                      type="email"
                      placeholder="contact@yourbusiness.com"
                      {...register('emailNegocio')}
                      className={`w-full px-4 py-3.5 border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        errors.emailNegocio ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-blue-500'
                      }`}
                      style={!errors.emailNegocio ? { '--tw-ring-color': company.primaryColor } as any : {}}
                    />
                    {errors.emailNegocio && <p className="text-red-500 text-xs">{errors.emailNegocio.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{t.p17_whatsapp}</label>
                    <input
                      type="tel"
                      placeholder="+1 512-607-4026"
                      {...register('whatsappNegocio')}
                      className={`w-full px-4 py-3.5 border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        errors.whatsappNegocio ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-blue-500'
                      }`}
                      style={!errors.whatsappNegocio ? { '--tw-ring-color': company.primaryColor } as any : {}}
                    />
                    {errors.whatsappNegocio && <p className="text-red-500 text-xs">{errors.whatsappNegocio.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{t.p17_phone}</label>
                    <input
                      type="tel"
                      placeholder="+1 512-607-4026"
                      {...register('telefonoNegocio')}
                      className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-blue-500"
                      style={{ '--tw-ring-color': company.primaryColor } as any}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{t.p17_address}</label>
                    <input
                      type="text"
                      placeholder="16801 Radholme Ct, Round Rock, TX"
                      {...register('direccionNegocio')}
                      className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-blue-500"
                      style={{ '--tw-ring-color': company.primaryColor } as any}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-sm font-bold text-slate-700 mb-3">{t.p17_socialsTitle}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-400">Instagram</label>
                      <input
                        type="text"
                        placeholder="@yourbusiness"
                        {...register('instagramUrl')}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-blue-500"
                        style={{ '--tw-ring-color': company.primaryColor } as any}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-400">Facebook</label>
                      <input
                        type="text"
                        placeholder="Link or page name"
                        {...register('facebookUrl')}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-blue-500"
                        style={{ '--tw-ring-color': company.primaryColor } as any}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-400">TikTok</label>
                      <input
                        type="text"
                        placeholder="@yourbusiness"
                        {...register('tiktokUrl')}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-blue-500"
                        style={{ '--tw-ring-color': company.primaryColor } as any}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-400">Other network / web</label>
                      <input
                        type="text"
                        placeholder="YouTube, LinkedIn, etc."
                        {...register('otraRedSocial')}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-blue-500"
                        style={{ '--tw-ring-color': company.primaryColor } as any}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PANTALLA 18: Datos personales de contacto */}
            {currentStep === 18 && (
              <motion.div
                key="step18"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
                    {t.p18_title}
                  </h3>
                  <p className="text-slate-500 text-sm">
                    {t.p18_desc}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{t.p18_name}</label>
                    <input
                      type="text"
                      placeholder="Ej: Ivan Rueda"
                      {...register('nombre')}
                      className={`w-full px-4 py-3.5 border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        errors.nombre ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-blue-500'
                      }`}
                      style={!errors.nombre ? { '--tw-ring-color': company.primaryColor } as any : {}}
                    />
                    {errors.nombre && <p className="text-red-500 text-xs">{errors.nombre.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{t.p18_email}</label>
                    <input
                      type="email"
                      placeholder="name@email.com"
                      {...register('correo')}
                      className={`w-full px-4 py-3.5 border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        errors.correo ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-blue-500'
                      }`}
                      style={!errors.correo ? { '--tw-ring-color': company.primaryColor } as any : {}}
                    />
                    {errors.correo && <p className="text-red-500 text-xs">{errors.correo.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{t.p18_whatsapp}</label>
                    <input
                      type="tel"
                      placeholder="+1 512-607-4026"
                      {...register('whatsapp')}
                      className={`w-full px-4 py-3.5 border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        errors.whatsapp ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-blue-500'
                      }`}
                      style={!errors.whatsapp ? { '--tw-ring-color': company.primaryColor } as any : {}}
                    />
                    {errors.whatsapp && <p className="text-red-500 text-xs">{errors.whatsapp.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">{t.p18_city}</label>
                    <input
                      type="text"
                      placeholder="Ej: Austin, TX"
                      {...register('ciudad')}
                      className={`w-full px-4 py-3.5 border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        errors.ciudad ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-blue-500'
                      }`}
                      style={!errors.ciudad ? { '--tw-ring-color': company.primaryColor } as any : {}}
                    />
                    {errors.ciudad && <p className="text-red-500 text-xs">{errors.ciudad.message}</p>}
                  </div>
                </div>

                {submitError && (
                  <p className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                    {submitError}
                  </p>
                )}
              </motion.div>
            )}

            {/* PANTALLA FINAL: Éxito */}
            {currentStep === 19 && (
              <motion.div
                key="step18"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-6"
              >
                <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-2">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                </div>
                
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {t.p19_title}
                </h1>
                
                <p className="text-base text-slate-500 max-w-md mx-auto">
                  {t.p19_desc}
                </p>

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      window.location.reload();
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl text-white font-medium bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/10 gap-2 cursor-pointer"
                    style={{ backgroundColor: company.primaryColor }}
                  >
                    {t.finishBtn}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </form>
      </main>

      {/* Navegación y pie del formulario */}
      {currentStep > 1 && currentStep < 19 && (
        <div className="max-w-2xl mx-auto w-full flex items-center justify-between mt-4 sm:mt-8 px-2">
          <button
            type="button"
            onClick={prevStep}
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 font-semibold hover:bg-slate-50 transition-colors cursor-pointer text-sm gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.backBtn}
          </button>
          
          {currentStep === 18 ? (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-white font-bold transition-all shadow-lg hover:brightness-105 cursor-pointer text-sm gap-2 disabled:opacity-50"
              style={{ backgroundColor: company.primaryColor }}
            >
              {isSubmitting ? t.submittingBtn : t.submitBtn}
              <Check className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-white font-bold transition-all shadow-lg hover:brightness-105 cursor-pointer text-sm gap-2"
              style={{ backgroundColor: company.primaryColor }}
            >
              {t.nextBtn}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Indicador de barra de progreso en el inferior de las preguntas */}
      {currentStep > 1 && currentStep < 19 && (
        <div className="max-w-2xl mx-auto w-full mt-3 sm:mt-4 px-2">
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-300"
              style={{ 
                width: `${((currentStep <= 14 ? currentStep - 1 : currentStep - 3) / visibleSteps) * 100}%`,
                backgroundColor: company.primaryColor 
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Pie de página con información de contacto dinámico */}
      <footer className="max-w-2xl mx-auto w-full text-center mt-6 sm:mt-12 text-xs text-slate-400 space-y-2">
        <p className="font-semibold text-slate-500">{company.name} © 2026</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          <span>{company.address}</span>
          <span>•</span>
          <span>{company.email}</span>
          <span>•</span>
          <span>{company.phone}</span>
        </div>
      </footer>
    </div>
  );
}
