import { NodeConnectionType, INodeType, INodeTypeDescription, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

export class UppercaseNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Uppercase Node',
    name: 'uppercaseNode',
    group: ['transform'],
    version: 1,
    description: 'Converts input text to uppercase',
    defaults: {
      name: 'Uppercase Node',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    properties: [
      {
        displayName: 'Text',
        name: 'text',
        type: 'string',
        default: '',
        placeholder: 'Enter text...',
        description: 'Text to convert to uppercase',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    // Obtiene todos los items (datos) de entrada al nodo.
    // Cada item es un objeto `{ json: {...} }` que viene de un nodo anterior.
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      // Obtiene el parámetro 'text' que se ingresó en la UI del nodo.
      // El segundo argumento (`i`) indica la posición del item actual.
      const text = this.getNodeParameter('text', i) as string;

      returnData.push({
        json: {
          original: text,
          uppercase: text.toUpperCase(),
        },
      });
    }

    // Devuelve los datos procesados al siguiente nodo del flujo.
    return [returnData];
  }
}