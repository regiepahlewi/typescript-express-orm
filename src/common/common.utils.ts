import * as moment from 'moment';
import { IResponse } from "../interface/response";
import { IRequestValidator } from "../interface/request";
import { Config } from "../config/config";

export function commonResponse(status: number, data: any, err?: any): IResponse {
    const dataResponse = {
        data: data,
        error: err
    }
    const res = {
        status: status,
        data: dataResponse
    }
    return res;
}

export function validateRequest(body: any, field: IRequestValidator[]) {

    const res = [];

    for (let i = 0; i < field.length; i++) {
        if (field[i].validation === 'required') {
            if (body[field[i].name] === '' ||
                !body[field[i].name]) {
                res.push(field[i].name + ' is required')
            }
        } else if (field[i].validation === 'regex') {
            const regex = new RegExp(field[i].regex);
            const data: string = body[field[i].name]
            if (!regex.test(data)) {
                res.push(field[i].name + ' is invalid format')
            }
        } else {
            return;
        }
    }

    return res;
}

export function convertToNull(body: any, field: string[]): any {
    for (const data of field) {
        if (body[data] === '') {
            body[data] = null
        }
    }
    return body
}

export function dateFormat(body: any, field: string[], format?: string): any {
    for (const data of field) {
        if (body[data] !== '' && body[data]) {
            body[data] = dateFormater(body[data], format);
        } else {
            body[data] = null;
        }
    }
    return body;
}

export function dateFormater(date: string, format?: string) {
    let dateConvert = Date.parse(date);
    const dateFormat = (format) ? format : Config.DATE_FORMAT;
    const momentFormat = moment(dateConvert).format(dateFormat);
    return momentFormat;
}
