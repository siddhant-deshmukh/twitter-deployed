import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import HTTP_CODES from "http-status-enum";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    let name: string, responseMessage: string;
    if (req.method === 'GET') {
        name = req.query.name;
        responseMessage = name
            ? "GET Hello, " + name + ". This HTTP triggered function executed successfully."
            : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";
    } else if (req.method === 'POST') {
        name = req.body && req.body.name;
        responseMessage = name
            ? "POST Hello, " + name + ". This HTTP triggered function executed successfully."
            : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";
    } else{
        context.res.status = HTTP_CODES.METHOD_NOT_ALLOWED
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };

};

export default httpTrigger;