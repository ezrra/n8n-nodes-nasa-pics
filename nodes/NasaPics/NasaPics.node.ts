import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class NasaPics implements INodeType {
  description: INodeTypeDescription = {
    // Basic node details will go here

    displayName: 'NASA Pics', // El nombre que se mostrará en la UI de n8n cuando estés armando un flujo.
    name: 'NasaPics', // El nombre interno del nodo. Este se usa como identificador clave, por ejemplo, en las rutas del código.
    icon: 'file:docsify.svg', // El ícono del nodo. Debe ser un archivo SVG y estar ubicado en la misma carpeta que el nodo. Se carga usando file: como prefijo.
    group: ['transform'], // Clasifica el nodo en un grupo dentro de n8n (por ejemplo: 'transform', 'input', 'output', etc.). Esto determina cómo se organiza en el UI.
    version: 1, // Versión del nodo. Sirve para control de cambios o migraciones de versiones más adelante.
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}', // Este texto se mostrará debajo del nombre del nodo en el UI. Usa expresiones n8n (={{ ... }}) para mostrar dinámicamente el operation y el resource seleccionados por el usuario.
    description: 'Get data from NASAs API', // Una breve descripción de lo que hace el nodo. También visible en la interfaz.
    defaults: { // Establece valores por defecto cuando arrastras el nodo al canvas. En este caso, el nombre del nodo será 'NASA Pics'.
      name: 'NASA Pics',
    },
    // Define las conexiones de entrada y salida del nodo. 
    // Este nodo recibe y entrega datos por la conexión principal (main).
    inputs: [NodeConnectionType.Main], // Esto indica que el nodo acepta datos de entrada, que vienen de otro nodo anterior.
    // Si lo dejas vacío ([]), el nodo no aceptará datos de ningún otro nodo.
    outputs: [NodeConnectionType.Main], // Esto indica que el nodo puede enviar datos de salida a otros nodos que estén conectados después.
     // Este nodo requiere credenciales para conectarse a la API de NASA.
     // Aquí debe haber un archivo NasaPicsApi.credentials.ts que defina cómo obtener y usar esas credenciales.
    credentials: [
      {
        name: 'NasaPicsApi',
        required: true,
      },
    ],
    // Define la configuración por defecto de las peticiones HTTP que hará el nodo, 
    // como la URL base y los headers. Esto evita repetir información en cada request.
    requestDefaults: {
      baseURL: 'https://api.nasa.gov',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },

    // Es un arreglo de objetos que define los campos de entrada que el usuario puede configurar en el panel del nodo.
    // Piensa en esto como los formularios que rellenas cuando configuras un nodo en n8n.
    properties: [
      {
        displayName: 'Resource', // 	El nombre visible para el usuario en la UI del nodo. Aparece como etiqueta en el formulario.
        name: 'resource', // 	El nombre interno del campo (clave del parámetro). Usado en código para acceder al valor: $parameter["resource"].
        type: 'options', // 	Indica que este campo es un menú desplegable (dropdown). El usuario debe elegir una opción.
        noDataExpression: true, // Permite que el campo soporte expresiones de n8n, aunque no siempre sea necesario aquí.
        // 	Un array de opciones que verá el usuario. Cada una tiene:
        // - name: Lo que ve el usuario.
        // - value: El valor que se guarda internamente y se usa en el código del nodo.
        options: [
          {
            name: 'Astronomy Picture of the Day',
            value: 'astronomyPictureOfTheDay',
          },
          {
            name: 'Mars Rover Photos',
            value: 'marsRoverPhotos',
          },
        ],
        default: 'astronomyPictureOfTheDay', // El valor que tendrá el campo por defecto cuando se agregue el nodo.
      },
      // Operations will go here
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options', // Tipo de campo: lista desplegable
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: [
              'astronomyPictureOfTheDay', // Solo aparece cuando el usuario selecciona el recurso astronomyPictureOfTheDay.
            ],
          },
        },
        options: [ // Lista de opciones dentro del campo "operation"
          {
            name: 'Get',
            value: 'get', // Valor interno que se usará en el código
            action: 'Get the APOD',
            description: 'Get the Astronomy Picture of the day',
            routing: { // Define cómo se construirá la petición HTTP
              request: {
                method: 'GET',
                url: '/planetary/apod',
              },
            },
          },
        ],
        default: 'get', // Valor por defecto seleccionado
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: [
              'marsRoverPhotos',
            ],
          },
        },
        options: [
          {
            name: 'Get',
            value: 'get',
            action: 'Get Mars Rover photos',
            description: 'Get photos from the Mars Rover',
            routing: {
              request: {
                method: 'GET',
              },
            },
          },
        ],
        default: 'get',
      },
      {
        displayName: 'Rover name',
        description: 'Choose which Mars Rover to get a photo from',
        required: true,
        name: 'roverName',
        type: 'options',
        options: [
          {name: 'Curiosity', value: 'curiosity'},
          {name: 'Opportunity', value: 'opportunity'},
          {name: 'Perseverance', value: 'perseverance'},
          {name: 'Spirit', value: 'spirit'},
        ],
        routing: {
          request: {
            url: '=/mars-photos/api/v1/rovers/{{$value}}/photos',
          },
        },
        default: 'curiosity',
        displayOptions: {
          show: {
            resource: [
              'marsRoverPhotos',
            ],
          },
        },
      },
      {
        displayName: 'Date',
        description: 'Earth date',
        required: true,
        name: 'marsRoverDate',
        type: 'dateTime',
        default:'',
        displayOptions: {
          show: {
            resource: [
              'marsRoverPhotos',
            ],
          },
        },
        routing: {
          request: {
            // You've already set up the URL. qs appends the value of the field as a query string
            qs: {
              earth_date: '={{ new Date($value).toISOString().substr(0,10) }}',
            },
          },
        },
      },
      // Optional/additional fields will go here

      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        default: {},
        placeholder: 'Add Field',
        displayOptions: {
          show: {
            resource: [
              'astronomyPictureOfTheDay',
            ],
            operation: [
              'get',
            ],
          },
        },
        options: [
          {
            displayName: 'Date',
            name: 'apodDate',
            type: 'dateTime',
            default: '',
            routing: {
              request: {
                // You've already set up the URL. qs appends the value of the field as a query string
                qs: {
                  date: '={{ new Date($value).toISOString().substr(0,10) }}',
                },
              },
            },
          },
        ],									
      }
    
    ]
  };
}