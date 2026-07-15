# Proyecto DevOps - Sistema de Registro Turístico

## Descripción

Este proyecto consiste en una aplicación web para el registro de turistas, desarrollada como parte de la asignatura de DevOps.

La solución está compuesta por un frontend en Angular, un backend en Flask y una base de datos PostgreSQL, todo desplegado mediante Docker Compose sobre una instancia EC2 de AWS.

Además, se implementó un pipeline de Entrega Continua utilizando GitHub Actions y GitHub Container Registry (GHCR).

---

# Tecnologías utilizadas

- Angular
- Flask (Python)
- PostgreSQL
- Docker
- Docker Compose
- Traefik
- Portainer
- pgAdmin
- GitHub Actions
- GitHub Container Registry (GHCR)
- AWS EC2
- Let's Encrypt (SSL)

---

# Arquitectura

La arquitectura está compuesta por los siguientes servicios:

- Frontend Angular
- Backend Flask
- Base de datos PostgreSQL
- pgAdmin
- Portainer
- Traefik como Reverse Proxy

Todos los servicios se ejecutan mediante Docker Compose sobre una instancia EC2.

---

# Requisitos

Antes de ejecutar el proyecto se necesita tener instalado:

- Git
- Docker
- Docker Compose

---

# Clonar el proyecto

```bash
git clone https://github.com/andrekn95/devops-proyecto1.git

cd devops-proyecto1
```

---

# Levantar los servicios

```bash
docker compose up -d
```

---

# Verificar los contenedores

```bash
docker ps
```

Deberán ejecutarse los siguientes contenedores:

- angular-frontend
- flask-backend
- postgres-db
- pgadmin
- traefik
- portainer

---

# Actualizar el proyecto

Después de realizar cambios en GitHub y que GitHub Actions genere una nueva imagen Docker:

```bash
git pull

docker compose pull

docker compose up -d
```

---

# Pipeline de Entrega Continua

El proyecto utiliza GitHub Actions para automatizar la construcción de las imágenes Docker.

Flujo:

1. Se realiza un cambio en el código.
2. Se ejecuta `git push`.
3. GitHub Actions construye la imagen Docker.
4. La imagen se publica en GitHub Container Registry (GHCR).
5. En la VPS se ejecuta:

```bash
docker compose pull

docker compose up -d
```

6. Docker descarga la nueva imagen y actualiza el servicio.

---

# Servicios publicados

| Servicio | URL |
|----------|-----|
| Aplicación Web | https://pilapanta.byronrm.com |
| Backend API | https://backend.pilapanta.byronrm.com |
| pgAdmin | https://pgadmin.pilapanta.byronrm.com |
| Portainer | https://portainer.pilapanta.byronrm.com |

---

# Comprobación del Backend

Puede verificarse el funcionamiento del backend mediante:

```
https://backend.pilapanta.byronrm.com/api/health
```

---

# Base de datos

Motor utilizado:

- PostgreSQL

Administrador:

- pgAdmin

La aplicación almacena la información de los registros turísticos directamente en PostgreSQL.

---

# Estructura del proyecto

```
devops-proyecto1
│
├── front/
│   ├── Dockerfile
│   └── Código Angular
│
├── backend/
│   ├── Dockerfile
│   └── API Flask
│
├── traefik/
│
├── docker-compose.yml
│
└── .github/
    └── workflows/
        ├── frontend.yml
        ├── backend.yml
        └── deploy.yml
```

---

# Autor

Kevin Andrés Pilapanta Morales

Proyecto desarrollado para la asignatura de DevOps.
