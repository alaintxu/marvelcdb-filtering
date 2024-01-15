# MarvelCDB filtering

## Reducir la carga de MarvelCDB

No me gustaría que marvelcdb se sature debido a esta aplicación, así que estas son las
Principales medidas tomadas para reducir la cantidad de llamadas a MarvelCDB:

* Las cartas se descargan al navegador (usando almacenamiento local).
* Advertencias cuando se borran las cartas y cuando se descargan todas las cartas.
* Las cartas están paginadas (no se muestran todas a la vez).
* Las imágenes se cargan de forma diferida, por lo que se descargan justo cuando son visibles.
* El filtrado se realiza contra una copia local de las cartas.

> La lista de packs siempre se descarga de MarvelCDB por si ha habido alguna actualización.

## ¿Cómo funciona?

### Primera vez

La primera vez que entras en la aplicación, tienes que hacer clic en *Administrador de descargas*. Ahí:

1. Elige el *idioma*.
1. 2. Pulsa en *Descargar todo* o elige los packs que tengas/quieras descargar.

Ahora, tendrás la lista de cartas en tu navegador. Si haces clic en *Lista de cartas*, deberías ver la lista de cartas.

### Ejemplos de filtrado

#### 1. Interrupciones obligadas y de héroe

Queremos listar todas las cartas que contengan *Interrupción de héroe* o *Interrupción obligada* en su texto.

Así que tenemos que añadir esos conceptos en la entrada de texto y elegir la opción de la izquierda (*Al menos una debe coincidir*).

De esta forma, obtendrás todas las cartas con el texto *Interrupción de héroe* y todas las cartas con *Interrupción obligada*.

![](./screenshots/example1-en-text_filter.png)
![](./screenshots/example1-en-result.png)