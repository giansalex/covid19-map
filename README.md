# COVID-19 Perú

Mapa de infectados por COVID-19 en Perú, almacenado en el [IPFS](https://ipfs.io/) y distribuido por cloudflare-ipfs.

## Iniciar
Para modificar los archivos e inicar la aplicacion en modo desarrollo, ejecutar:

```
npm run dev
```

## Publicar
Para generar los archivos (css,js,images) optimizados para publicación, ejecutar:

```
npm run build
```

Además, se necesita copiar otros archivos, la carpeta final deberia visualizarse de
la siguiente forma:

```
|
|-images/
|-data/
|-dist/
|-favicon.png
|-manifest.json
|-index.html
```

Finalmente si quieres ir más allá, necesitas tener un dominio configurado en cloudflare,
y una cuenta en temporal.cloud (IPFS Gateway) u otro servicio similar.

## Configuraciones Requeridas

- `COVID_URL` 
- `COVID_KEY`
- `TEMPORAL_USER`
- `TEMPORAL_PASS`
- `CF_API_TOKEN` (Cloudflare API Token)
- `CF_DOMAIN`