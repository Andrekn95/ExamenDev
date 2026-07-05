--
-- PostgreSQL database dump
--

\restrict 1LTiPOH1Xi5K1gDAEyjnhbthCrxF16cSGQwCHH9ASVB4Y5lFcwKWnKhGmxmCWaY

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.3

-- Started on 2026-07-05 13:26:40

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 24582)
-- Name: huespedes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.huespedes (
    id integer NOT NULL,
    nombres_completos character varying(200) NOT NULL,
    telefono character varying(20) NOT NULL,
    correo_electronico character varying(100) NOT NULL,
    acompanantes integer NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT huespedes_acompanantes_check CHECK (((acompanantes >= 2) AND (acompanantes <= 4)))
);


ALTER TABLE public.huespedes OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24581)
-- Name: huespedes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.huespedes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.huespedes_id_seq OWNER TO postgres;

--
-- TOC entry 4938 (class 0 OID 0)
-- Dependencies: 219
-- Name: huespedes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.huespedes_id_seq OWNED BY public.huespedes.id;


--
-- TOC entry 222 (class 1259 OID 24596)
-- Name: restaurante; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.restaurante (
    id integer NOT NULL,
    desayuno character varying(50),
    bebida_desayuno character varying(50),
    almuerzo character varying(50),
    bebida_almuerzo character varying(50),
    tiene_alergias boolean DEFAULT false,
    detalle_alergia text,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.restaurante OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24595)
-- Name: restaurante_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.restaurante_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.restaurante_id_seq OWNER TO postgres;

--
-- TOC entry 4939 (class 0 OID 0)
-- Dependencies: 221
-- Name: restaurante_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.restaurante_id_seq OWNED BY public.restaurante.id;


--
-- TOC entry 224 (class 1259 OID 24608)
-- Name: tours; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tours (
    id integer NOT NULL,
    actividad character varying(100) NOT NULL,
    tipo_alojamiento character varying(50) NOT NULL,
    acepta_terminos boolean NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tours_acepta_terminos_check CHECK ((acepta_terminos = true))
);


ALTER TABLE public.tours OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 24607)
-- Name: tours_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tours_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tours_id_seq OWNER TO postgres;

--
-- TOC entry 4940 (class 0 OID 0)
-- Dependencies: 223
-- Name: tours_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tours_id_seq OWNED BY public.tours.id;


--
-- TOC entry 4765 (class 2604 OID 24585)
-- Name: huespedes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.huespedes ALTER COLUMN id SET DEFAULT nextval('public.huespedes_id_seq'::regclass);


--
-- TOC entry 4767 (class 2604 OID 24599)
-- Name: restaurante id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurante ALTER COLUMN id SET DEFAULT nextval('public.restaurante_id_seq'::regclass);


--
-- TOC entry 4770 (class 2604 OID 24611)
-- Name: tours id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tours ALTER COLUMN id SET DEFAULT nextval('public.tours_id_seq'::regclass);


--
-- TOC entry 4928 (class 0 OID 24582)
-- Dependencies: 220
-- Data for Name: huespedes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.huespedes (id, nombres_completos, telefono, correo_electronico, acompanantes, fecha_registro) FROM stdin;
1	Kevin Morales	0963148649	apilapanta@gmail.com	3	2026-07-05 08:29:05.45961
\.


--
-- TOC entry 4930 (class 0 OID 24596)
-- Dependencies: 222
-- Data for Name: restaurante; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.restaurante (id, desayuno, bebida_desayuno, almuerzo, bebida_almuerzo, tiene_alergias, detalle_alergia, fecha_registro) FROM stdin;
1	encebollado	{Café}	seco_pollo	{Café}	t	al camaron	2026-07-05 08:29:05.45961
\.


--
-- TOC entry 4932 (class 0 OID 24608)
-- Dependencies: 224
-- Data for Name: tours; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tours (id, actividad, tipo_alojamiento, acepta_terminos, fecha_registro) FROM stdin;
1	caminata	eco_lodge	t	2026-07-05 08:29:05.45961
\.


--
-- TOC entry 4941 (class 0 OID 0)
-- Dependencies: 219
-- Name: huespedes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.huespedes_id_seq', 1, true);


--
-- TOC entry 4942 (class 0 OID 0)
-- Dependencies: 221
-- Name: restaurante_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.restaurante_id_seq', 1, true);


--
-- TOC entry 4943 (class 0 OID 0)
-- Dependencies: 223
-- Name: tours_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tours_id_seq', 1, true);


--
-- TOC entry 4775 (class 2606 OID 24594)
-- Name: huespedes huespedes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.huespedes
    ADD CONSTRAINT huespedes_pkey PRIMARY KEY (id);


--
-- TOC entry 4777 (class 2606 OID 24606)
-- Name: restaurante restaurante_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurante
    ADD CONSTRAINT restaurante_pkey PRIMARY KEY (id);


--
-- TOC entry 4779 (class 2606 OID 24619)
-- Name: tours tours_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tours
    ADD CONSTRAINT tours_pkey PRIMARY KEY (id);


-- Completed on 2026-07-05 13:26:40

--
-- PostgreSQL database dump complete
--

\unrestrict 1LTiPOH1Xi5K1gDAEyjnhbthCrxF16cSGQwCHH9ASVB4Y5lFcwKWnKhGmxmCWaY

