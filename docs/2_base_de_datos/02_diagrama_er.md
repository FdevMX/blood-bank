# Diagrama Entidad-Relación

El siguiente diagrama muestra la estructura completa de la base de datos con todas las tablas, campos y relaciones entre ellas. Utiliza notación Mermaid `erDiagram`.

> Para visualizar este diagrama, abrir el archivo en VS Code con la extensión **Markdown Preview Mermaid Support**, o pegarlo en [mermaid.live](https://mermaid.live).

---

```mermaid
erDiagram

    usuario {
        serial      id              PK
        varchar     nombre_usuario
        varchar     email           UK
        varchar     password_hash
        varchar     rol
        varchar     estado
        timestamp   fecha_creacion
        timestamp   ultimo_acceso
    }

    grupo_sanguineo {
        serial      id      PK
        varchar     grupo   UK
        text        descripcion
        boolean     activo
    }

    tipo_donante {
        serial      id      PK
        varchar     nombre  UK
        text        descripcion
        boolean     activo
    }

    clasificacion_donacion {
        serial      id      PK
        varchar     nombre  UK
        text        descripcion
        boolean     activo
    }

    enfermedad_reciente {
        serial      id      PK
        varchar     nombre  UK
        text        descripcion
        boolean     activo
    }

    donante {
        serial      id                      PK
        varchar     codigo                  UK
        varchar     nombres
        varchar     apellidos
        varchar     documento_identidad     UK
        date        fecha_nacimiento
        varchar     sexo
        varchar     ocupacion
        varchar     centro_trabajo
        text        direccion
        varchar     municipio
        varchar     departamento
        varchar     telefono
        varchar     email
        decimal     temperatura
        integer     id_tipo_donante         FK
        integer     id_grupo_sanguineo      FK
        date        fecha_ultima_donacion
        boolean     transfusiones_previas
        boolean     donaciones_previas
        varchar     estado
        timestamp   fecha_registro
        timestamp   ultima_modificacion
    }

    donacion {
        serial      id                  PK
        varchar     codigo              UK
        integer     id_donante          FK
        time        hora
        date        fecha
        decimal     cantidad_ml
        integer     id_grupo_sanguineo  FK
        integer     id_tipo_donante     FK
        integer     id_clasificacion    FK
        decimal     temperatura
        decimal     peso
        varchar     lso
        decimal     hemoglobina
        varchar     tension_arterial
        text        observaciones
        varchar     estado
        date        fecha_vencimiento
        varchar     ubicacion
        integer     id_usuario_registro FK
        timestamp   fecha_registro
    }

    donante_enfermedad {
        serial      id                  PK
        integer     id_donante          FK
        integer     id_enfermedad       FK
        date        fecha_diagnostico
        text        observaciones
    }

    auditoria {
        serial      id                  PK
        integer     id_usuario          FK
        varchar     accion
        varchar     tabla_afectada
        integer     registro_id
        jsonb       datos_anteriores
        jsonb       datos_nuevos
        varchar     ip_address
        text        user_agent
        timestamp   fecha
    }

    donante         ||--o{ donacion             : "realiza"
    donante         ||--o{ donante_enfermedad   : "tiene asociadas"
    donante         }o--|| tipo_donante         : "clasificado como"
    donante         }o--|| grupo_sanguineo      : "pertenece a"
    donacion        }o--|| tipo_donante         : "es de tipo"
    donacion        }o--|| grupo_sanguineo      : "es del grupo"
    donacion        }o--|| clasificacion_donacion : "clasificada como"
    donacion        }o--|| usuario              : "registrada por"
    donante_enfermedad }o--|| enfermedad_reciente : "referencia a"
    auditoria       }o--|| usuario              : "generada por"
```

---

## Descripción de la Notación

| Símbolo | Significado |
|---------|-------------|
| `PK` | Primary Key — clave primaria |
| `FK` | Foreign Key — clave foránea |
| `UK` | Unique Key — valor único en la tabla |
| `\|\|--o{` | Uno a muchos: un registro de la izquierda relacionado con cero o más de la derecha |
| `}o--\|\|` | Muchos a uno: cero o más registros de la izquierda relacionados con exactamente uno de la derecha |

---

## Notas del Diagrama

- **`donante` → `donacion`**: Un donante puede tener registradas cero o muchas donaciones a lo largo del tiempo.
- **`donante` → `donante_enfermedad`**: Un donante puede tener cero o muchas enfermedades recientes asociadas.
- **`donante` → `tipo_donante`**: Un donante tiene un tipo de donante principal (puede ser NULL en datos incompletos).
- **`donante` → `grupo_sanguineo`**: Un donante pertenece a un grupo sanguíneo (puede ser NULL si no se conoce).
- **`donacion` → `tipo_donante`**: Cada donación especifica el tipo en que fue realizada.
- **`donacion` → `grupo_sanguineo`**: Cada donación registra el grupo sanguíneo de la unidad donada.
- **`donacion` → `clasificacion_donacion`**: Cada donación se clasifica como ÚTIL o NO ÚTIL.
- **`donacion` → `usuario`**: Registra qué usuario del sistema ingresó la donación.
- **`donante_enfermedad` → `enfermedad_reciente`**: Vincula una entrada de la tabla de relación con la enfermedad específica del catálogo.
- **`auditoria` → `usuario`**: Cada evento de auditoría registra qué usuario lo originó.
