import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

// Define y exporta una clase que representa las credenciales para autenticar la NASA API en n8n
export class NasaPicsApi implements ICredentialType {
	// Nombre interno de las credenciales, usado por n8n para vincular con los nodos
	name = 'NasaPicsApi';
	// Nombre visible en el UI de n8n cuando se seleccionan credenciales
	displayName = 'NASA Pics API';
	// URL de documentación (opcional). Se usa para guiar al usuario. Aquí se usa el link del tutorial de ejemplo
	documentationUrl = 'https://docs.n8n.io/integrations/creating-nodes/build/declarative-style-node/';
	// Definición de los campos que el usuario verá al configurar las credenciales
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey', // Nombre interno del campo (referenciado en el código)
			type: 'string', // Tipo de dato del campo (texto plano)
			default: '', // Valor por defecto (vacío)
		},
	];
	// Configuración de cómo n8n usará las credenciales al hacer peticiones HTTP
	authenticate = {
		type: 'generic', // Tipo de autenticación (no específica de algún proveedor)
		properties: {
			// Significa que la clave API se añadirá como query string en las peticiones
			qs: {
				// Aquí n8n reemplazará $credentials.apiKey por el valor que el usuario haya ingresado
				'api_key': '={{$credentials.apiKey}}'
			}
		},
	} as IAuthenticateGeneric;
}
// Ejemplo de resultado: GET https://api.nasa.gov/planetary/apod?api_key=TU_API_KEY