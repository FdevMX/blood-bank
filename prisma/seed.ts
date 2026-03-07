import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de datos iniciales...')

  // -------------------------------------------------------
  // 1. Grupos Sanguíneos (8 registros)
  // -------------------------------------------------------
  console.log('🩸 Insertando grupos sanguíneos...')
  const gruposSanguineos = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  for (const grupo of gruposSanguineos) {
    await prisma.grupoSanguineo.upsert({
      where: { grupo },
      update: {},
      create: { grupo },
    })
  }
  console.log(`  ✔ ${gruposSanguineos.length} grupos sanguíneos insertados.`)

  // -------------------------------------------------------
  // 2. Tipos de Donante (6 registros)
  // -------------------------------------------------------
  console.log('👤 Insertando tipos de donante...')
  const tiposDonante = [
    { nombre: 'VOLUNTARIO', descripcion: 'Donante que dona por iniciativa propia sin ningún vínculo directo con el receptor.' },
    { nombre: 'FAMILIAR', descripcion: 'Donante que dona para un familiar o conocido específico.' },
    { nombre: 'PLASMAFERESIS', descripcion: 'Donación de plasma mediante aféresis.' },
    { nombre: 'TROMBOCITIFERESIS', descripcion: 'Donación de plaquetas mediante aféresis.' },
    { nombre: 'LEUCOCITOSFERESIS', descripcion: 'Donación de leucocitos mediante aféresis.' },
    { nombre: 'OTROS', descripcion: 'Otros tipos de donación no clasificados.' },
  ]
  for (const tipo of tiposDonante) {
    await prisma.tipoDonante.upsert({
      where: { nombre: tipo.nombre },
      update: {},
      create: tipo,
    })
  }
  console.log(`  ✔ ${tiposDonante.length} tipos de donante insertados.`)

  // -------------------------------------------------------
  // 3. Clasificaciones de Donación (2 registros)
  // -------------------------------------------------------
  console.log('📋 Insertando clasificaciones de donación...')
  const clasificaciones = [
    { nombre: 'UTIL', descripcion: 'Donación que cumple con todos los criterios médicos y puede ser utilizada.' },
    { nombre: 'NO UTIL', descripcion: 'Donación que no cumple con los criterios médicos y debe descartarse.' },
  ]
  for (const clasif of clasificaciones) {
    await prisma.clasificacionDonacion.upsert({
      where: { nombre: clasif.nombre },
      update: {},
      create: clasif,
    })
  }
  console.log(`  ✔ ${clasificaciones.length} clasificaciones insertadas.`)

  // -------------------------------------------------------
  // 4. Enfermedades Recientes (16 registros)
  // -------------------------------------------------------
  console.log('🏥 Insertando enfermedades recientes...')
  const enfermedades = [
    { nombre: 'Hepatitis', descripcion: 'Inflamación del hígado causada por virus hepatotropos.' },
    { nombre: 'Sífilis', descripcion: 'Infección de transmisión sexual por Treponema pallidum.' },
    { nombre: 'Paludismo', descripcion: 'Enfermedad parasitaria transmitida por mosquito Anopheles.' },
    { nombre: 'Brucelosis', descripcion: 'Infección bacteriana zoonótica.' },
    { nombre: 'Tuberculosis', descripcion: 'Infección bacteriana que afecta principalmente los pulmones.' },
    { nombre: 'Febriles', descripcion: 'Enfermedades que cursan con fiebre reciente.' },
    { nombre: 'Diabetes', descripcion: 'Trastorno metabólico caracterizado por hiperglucemia.' },
    { nombre: 'Mellitus', descripcion: 'Condición relacionada con el metabolismo de la glucosa.' },
    { nombre: 'Cardiovasculares', descripcion: 'Enfermedades que afectan el corazón y los vasos sanguíneos.' },
    { nombre: 'Convulsiones', descripcion: 'Episodios de actividad eléctrica cerebral anormal.' },
    { nombre: 'Pérdida Reciente de Peso', descripcion: 'Pérdida de peso significativa sin causa aparente.' },
    { nombre: 'Extracciones Dentales', descripcion: 'Procedimientos odontológicos recientes que involucran extracción.' },
    { nombre: 'Sueros o Vacunaciones', descripcion: 'Aplicación reciente de sueros o vacunas.' },
    { nombre: 'Afecciones de la Piel', descripcion: 'Enfermedades dermatológicas activas.' },
    { nombre: 'Ingesta de Medicamentos', descripcion: 'Consumo reciente de medicamentos que contraindican la donación.' },
    { nombre: 'Cirugía Mayor', descripcion: 'Procedimiento quirúrgico reciente que requiere tiempo de recuperación.' },
  ]
  for (const enfermedad of enfermedades) {
    await prisma.enfermedadReciente.upsert({
      where: { nombre: enfermedad.nombre },
      update: {},
      create: enfermedad,
    })
  }
  console.log(`  ✔ ${enfermedades.length} enfermedades insertadas.`)

  console.log('\n✅ Seed completado exitosamente.')
  console.log('   Base de datos lista para operar.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error durante el seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
